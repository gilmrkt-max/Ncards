import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  Shape,
  ShapeGeometry,
  ExtrudeGeometry,
  RingGeometry,
  PlaneGeometry,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshBasicMaterial,
  CanvasTexture,
  SRGBColorSpace,
  AmbientLight,
  DirectionalLight,
  PointLight,
  PMREMGenerator,
  Raycaster,
  Vector2,
  MathUtils
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { gsap } from 'gsap'
import { CARD_RATIO, createCanvas, drawFront, drawBack, createShadowCanvas, loadImage } from './cardTextures'

// Dimensões em unidades de mundo (proporção de cartão bancário ISO/IEC 7810)
const CARD_W = 3.37
const CARD_H = CARD_W / CARD_RATIO
const CARD_D = 0.045
const CARD_R = 0.17

// Pose de repouso: face levemente voltada para o smartphone (à direita)
const BASE = { rx: -0.2, ry: 0.36, rz: 0.12 }

const WAVE_COUNT = 3

function roundedRect(w, h, r) {
  const x = -w / 2
  const y = -h / 2
  const s = new Shape()
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

/** UV planar 0..1 a partir da posição — alinha a textura exatamente à face. */
function planarUV(geometry, w, h) {
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  }
  uv.needsUpdate = true
  return geometry
}

export class CardScene {
  /**
   * @param {object} opts
   * @param {HTMLCanvasElement} opts.canvas
   * @param {HTMLElement} opts.container    elemento que dimensiona o canvas
   * @param {HTMLElement} [opts.eventTarget] elemento que recebe cliques (padrão: container)
   * @param {boolean} opts.lowPower         mobile/tablet: menos pixels, materiais mais simples
   * @param {boolean} opts.reducedMotion
   * @param {string}  opts.logoSrc
   * @param {string}  opts.qrText
   * @param {() => DOMRect|null} opts.getTargetRect  retângulo do smartphone (animação de toque)
   * @param {(hovered: boolean) => void} opts.onHover
   * @param {() => void} opts.onTap           disparado no momento do "contato" NFC
   */
  constructor(opts) {
    this.opts = opts
    this.canvas = opts.canvas
    this.container = opts.container
    this.eventTarget = opts.eventTarget ?? opts.container
    this.lowPower = !!opts.lowPower
    this.reduced = !!opts.reducedMotion

    this.layout = { widthRatio: 0.6, offsetX: -0.1, offsetY: 0 }
    this.view = { w: 1, h: 1 }
    this.baseScale = 1

    // Estado animável
    this.pointer = { x: 0, y: 0 } // alvo do parallax (-1..1)
    this.smooth = { x: 0, y: 0 } // valor suavizado
    this.hover = 0
    this.hoverTarget = 0
    this.hovered = false
    this.intro = { s: 0.82, ry: -0.55 }
    this.tap = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }
    this.burst = { v: 0 }
    this.tapping = false
    this.time = 0
    this.wavePhase = 0

    this.ndc = new Vector2(10, 10)
    this.pointerInside = false
    this.raycaster = new Raycaster()

    this.running = false
    this.visible = true
    this.raf = 0
    this.lastTime = 0

    this.disposables = []

    this.#initRenderer()
    this.#buildScene()
    this.#bindEvents()
    this.resize()
  }

  /* ------------------------------------------------------------------ */
  /* Setup                                                              */
  /* ------------------------------------------------------------------ */

  #initRenderer() {
    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: !this.lowPower || window.devicePixelRatio < 2,
      powerPreference: 'high-performance'
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.lowPower ? 1.5 : 2))
    renderer.outputColorSpace = SRGBColorSpace
    this.renderer = renderer

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(28, 1, 0.1, 100)
    this.camera.position.set(0, 0, 12)

    // Reflexos suaves de estúdio — gerado uma única vez
    const pmrem = new PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    this.envMap = pmrem.fromScene(room, 0.04).texture
    this.scene.environment = this.envMap
    this.scene.environmentIntensity = 0.42
    room.dispose?.()
    pmrem.dispose()
  }

  #texture(canvas) {
    const tex = new CanvasTexture(canvas)
    tex.colorSpace = SRGBColorSpace
    tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
    this.disposables.push(tex)
    return tex
  }

  #buildScene() {
    const { scene } = this

    // Luzes
    // Balanceado para a superfície chegar perto de 1.0: cores da marca sem estourar
    scene.add(new AmbientLight(0xffffff, 0.35))
    const key = new DirectionalLight(0xffffff, 1.0)
    key.position.set(3, 5, 7)
    scene.add(key)
    const fill = new DirectionalLight(0x9d8bff, 0.55)
    fill.position.set(-6, -2, 4)
    scene.add(fill)
    this.nfcLight = new PointLight(0x00b8e6, 0, 6, 1.6)
    scene.add(this.nfcLight)

    // Hierarquia: root (layout) > float (posição) > tilt (rotação) > cartão
    this.root = new Group()
    this.float = new Group()
    this.tilt = new Group()
    this.card = new Group()
    this.root.add(this.float)
    this.float.add(this.tilt)
    this.tilt.add(this.card)
    scene.add(this.root)

    // Texturas
    const texW = this.lowPower ? 1024 : 2048
    this.frontCanvas = createCanvas(texW)
    this.backCanvas = createCanvas(this.lowPower ? 768 : 1024)
    drawFront(this.frontCanvas, { qrText: this.opts.qrText })
    drawBack(this.backCanvas)
    this.frontTex = this.#texture(this.frontCanvas)
    this.backTex = this.#texture(this.backCanvas)
    this.#loadAssets()

    const shape = roundedRect(CARD_W, CARD_H, CARD_R)

    // Corpo (bordas) do cartão
    const bodyGeo = new ExtrudeGeometry(shape, { depth: CARD_D, bevelEnabled: false, curveSegments: 14 })
    bodyGeo.translate(0, 0, -CARD_D / 2)
    const bodyMat = new MeshStandardMaterial({ color: 0x24203a, roughness: 0.38, metalness: 0.35 })
    const body = new Mesh(bodyGeo, bodyMat)

    // Faces
    const faceGeo = planarUV(new ShapeGeometry(shape, 14), CARD_W, CARD_H)
    const FaceMaterial = this.lowPower ? MeshStandardMaterial : MeshPhysicalMaterial
    const surface = {
      roughness: 0.5,
      metalness: 0,
      emissive: 0xffffff,
      // verniz discreto: dá brilho ao girar sem "lavar" a arte e a logo
      ...(this.lowPower ? {} : { clearcoat: 0.3, clearcoatRoughness: 0.4 })
    }
    // emissiveMap mantém as cores fiéis à identidade; a luz adiciona volume e brilho
    const frontMat = new FaceMaterial({ ...surface, map: this.frontTex, emissiveMap: this.frontTex, emissiveIntensity: 0.14 })
    const backMat = new FaceMaterial({ ...surface, map: this.backTex, emissiveMap: this.backTex, emissiveIntensity: 0.12 })

    const front = new Mesh(faceGeo, frontMat)
    front.position.z = CARD_D / 2 + 0.001
    const back = new Mesh(faceGeo, backMat)
    back.rotation.y = Math.PI
    back.position.z = -CARD_D / 2 - 0.001

    this.card.add(body, front, back)
    this.hitTargets = [body, front, back]
    this.disposables.push(bodyGeo, bodyMat, faceGeo, frontMat, backMat)

    // Ondas NFC — arcos que nascem das laterais do cartão
    this.waves = []
    const arcGeo = new RingGeometry(0.5, 0.522, 56, 1, -Math.PI / 4.2, Math.PI / 2.1)
    this.disposables.push(arcGeo)
    const sides = [
      { x: CARD_W / 2 - 0.42, rot: 0, color: 0x00b8e6 },
      { x: -CARD_W / 2 + 0.42, rot: Math.PI, color: 0x7047ff }
    ]
    sides.forEach((side) => {
      for (let i = 0; i < WAVE_COUNT; i++) {
        const mat = new MeshBasicMaterial({ color: side.color, transparent: true, opacity: 0, depthWrite: false })
        const mesh = new Mesh(arcGeo, mat)
        mesh.position.set(side.x, 0.05, 0)
        mesh.rotation.z = side.rot
        mesh.renderOrder = 2
        this.card.add(mesh)
        this.waves.push({ mesh, offset: i / WAVE_COUNT })
        this.disposables.push(mat)
      }
    })

    // Sombra de contato (não flutua, só reage à altura do cartão)
    this.shadowTex = new CanvasTexture(createShadowCanvas())
    this.disposables.push(this.shadowTex)
    const shadowGeo = new PlaneGeometry(CARD_W * 1.25, CARD_W * 0.62)
    const shadowMat = new MeshBasicMaterial({ map: this.shadowTex, transparent: true, depthWrite: false, opacity: 0.9 })
    this.shadow = new Mesh(shadowGeo, shadowMat)
    this.shadow.position.set(0, -CARD_H * 0.98, -1.2)
    this.shadow.renderOrder = -1
    this.root.add(this.shadow)
    this.disposables.push(shadowGeo, shadowMat)
  }

  async #loadAssets() {
    // Aguarda a fonte (textos do canvas) e a logo oficial, então redesenha
    const fontReady = document.fonts
      ? Promise.all([
          document.fonts.load('800 40px "Plus Jakarta Sans"'),
          document.fonts.load('600 20px "Plus Jakarta Sans"')
        ]).catch(() => null)
      : Promise.resolve()
    const [logo] = await Promise.all([loadImage(this.opts.logoSrc), fontReady])
    if (this.disposed) return
    drawFront(this.frontCanvas, { logo, qrText: this.opts.qrText })
    drawBack(this.backCanvas)
    this.frontTex.needsUpdate = true
    this.backTex.needsUpdate = true
  }

  /* ------------------------------------------------------------------ */
  /* Eventos                                                            */
  /* ------------------------------------------------------------------ */

  #bindEvents() {
    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect()

      if (e.pointerType === 'mouse' && !this.reduced) {
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        this.pointer.x = MathUtils.clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1)
        this.pointer.y = MathUtils.clamp(-(e.clientY - cy) / (window.innerHeight / 2), -1, 1)
      }

      this.#updateNdc(e, rect)
    }

    this.onPointerLeave = () => {
      this.pointer.x = 0
      this.pointer.y = 0
      this.pointerInside = false
      this.#setHovered(false)
    }

    this.onClick = (e) => {
      this.#updateNdc(e, this.container.getBoundingClientRect())
      if (this.#hitTest()) this.playTap()
    }

    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', this.onPointerLeave)
    window.addEventListener('blur', this.onPointerLeave)
    this.eventTarget.addEventListener('click', this.onClick)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(this.container)

    this.io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      this.#syncLoop()
    })
    this.io.observe(this.container)

    this.onVisibility = () => this.#syncLoop()
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  #updateNdc(e, rect) {
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    this.pointerInside = x >= 0 && x <= 1 && y >= 0 && y <= 1
    this.ndc.set(x * 2 - 1, -(y * 2 - 1))
    this.pointerType = e.pointerType
  }

  #hitTest() {
    if (!this.pointerInside) return false
    this.raycaster.setFromCamera(this.ndc, this.camera)
    return this.raycaster.intersectObjects(this.hitTargets, false).length > 0
  }

  #setHovered(value) {
    if (this.hovered === value) return
    this.hovered = value
    this.hoverTarget = value ? 1 : 0
    this.eventTarget.style.cursor = value ? 'pointer' : ''
    this.opts.onHover?.(value)
  }

  /* ------------------------------------------------------------------ */
  /* API pública                                                        */
  /* ------------------------------------------------------------------ */

  setLayout(layout) {
    Object.assign(this.layout, layout)
    this.#applyLayout()
  }

  setReducedMotion(value) {
    this.reduced = value
    if (value) {
      this.pointer.x = 0
      this.pointer.y = 0
    }
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.#applyLayout()
    if (!this.running) this.#render(0)
  }

  #applyLayout() {
    const dist = this.camera.position.z
    const vh = 2 * Math.tan(MathUtils.degToRad(this.camera.fov / 2)) * dist
    const vw = vh * this.camera.aspect
    this.view = { w: vw, h: vh }

    // Cabe na largura desejada sem estourar a altura disponível
    const targetW = Math.min(vw * this.layout.widthRatio, vh * 0.62 * CARD_RATIO)
    this.baseScale = targetW / CARD_W
    this.root.position.set(vw * this.layout.offsetX, vh * this.layout.offsetY, 0)
  }

  /** Entrada: escala + rotação suave até a pose de repouso. */
  playIntro(delay = 0) {
    if (this.reduced) {
      this.intro.s = 1
      this.intro.ry = 0
      return
    }
    gsap.to(this.intro, { s: 1, ry: 0, duration: 1.8, delay, ease: 'expo.out' })
  }

  /** Clique/toque: o cartão se aproxima do smartphone e "conecta". */
  playTap() {
    if (this.tapping) return
    this.tapping = true

    const reach = this.#tapReach()
    const d = this.reduced ? 0.5 : 1

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => (this.tapping = false)
    })

    tl.to(this.tap, { x: reach, z: 0.9, y: 0.05, ry: 0.32, rx: 0.12, rz: -0.08, duration: 0.8 * d })
      .add(() => this.opts.onTap?.(), '-=0.18')
      .to(this.burst, { v: 1, duration: 0.25, ease: 'power2.out' }, '-=0.2')
      .to(this.tap, { x: reach - 0.08, duration: 0.18, ease: 'power2.out' })
      .to(this.tap, { x: reach, duration: 0.3, ease: 'power2.inOut' })
      .to(this.burst, { v: 0, duration: 1.2, ease: 'power2.out' }, '+=0.3')
      .to(this.tap, { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, duration: 1.3 * d }, '<')
  }

  #tapReach() {
    const rect = this.opts.getTargetRect?.()
    const c = this.container.getBoundingClientRect()
    if (!rect || !c.width) return CARD_W * 0.4
    const px = rect.left + rect.width * 0.5 - c.left
    const worldX = ((px / c.width) * 2 - 1) * (this.view.w / 2)
    const local = (worldX - this.root.position.x) / this.baseScale
    return MathUtils.clamp(local - CARD_W * 0.62, 0.15, CARD_W * 0.8)
  }

  start() {
    this.wantsRun = true
    this.#syncLoop()
  }

  #syncLoop() {
    const shouldRun = this.wantsRun && this.visible && !document.hidden && !this.disposed
    if (shouldRun && !this.running) {
      this.running = true
      this.lastTime = performance.now()
      this.raf = requestAnimationFrame(this.#tick)
    } else if (!shouldRun && this.running) {
      this.running = false
      cancelAnimationFrame(this.raf)
    }
  }

  /* ------------------------------------------------------------------ */
  /* Loop                                                               */
  /* ------------------------------------------------------------------ */

  #tick = (now) => {
    if (!this.running) return
    const dt = Math.min((now - this.lastTime) / 1000, 1 / 20)
    this.lastTime = now
    this.#render(dt)
    this.raf = requestAnimationFrame(this.#tick)
  }

  #render(dt) {
    this.time += dt
    const t = this.time
    const motion = this.reduced ? 0.15 : 1
    const parallax = this.reduced ? 0 : 1

    // Hover via raycast (1x por frame, só para mouse)
    if (this.pointerType === 'mouse' && !this.tapping) this.#setHovered(this.#hitTest())

    // Suavização exponencial independente de FPS
    const kPointer = 1 - Math.exp(-dt * 2.6)
    const kHover = 1 - Math.exp(-dt * 4.5)
    this.smooth.x += (this.pointer.x - this.smooth.x) * kPointer
    this.smooth.y += (this.pointer.y - this.smooth.y) * kPointer
    this.hover += (this.hoverTarget - this.hover) * kHover

    const h = this.hover
    const tap = this.tap
    const energy = Math.min(1, h + this.burst.v)

    // Flutuação: senoides com frequências não múltiplas (movimento orgânico)
    const floatY = (Math.sin(t * 0.8) * 0.1 + Math.sin(t * 1.37) * 0.025) * motion
    this.float.position.set(h * 0.16 + tap.x, floatY + h * 0.04 + tap.y, h * 0.35 + tap.z)

    this.tilt.rotation.set(
      BASE.rx + Math.sin(t * 0.55) * 0.05 * motion - this.smooth.y * 0.2 * parallax + tap.rx,
      BASE.ry + this.intro.ry + Math.sin(t * 0.42) * 0.11 * motion + this.smooth.x * 0.3 * parallax + h * 0.1 + tap.ry,
      BASE.rz + Math.sin(t * 0.5 + 1.2) * 0.03 * motion - this.smooth.x * 0.04 * parallax + tap.rz
    )

    const s = this.baseScale * this.intro.s
    this.root.scale.setScalar(s)

    // Sombra: menor e mais clara quando o cartão sobe ou se aproxima
    const lift = floatY + tap.z * 0.25 + h * 0.08
    this.shadow.position.x = this.float.position.x * 0.9
    this.shadow.scale.set(1 - lift * 0.5, 1 - lift * 0.5, 1)
    this.shadow.material.opacity = MathUtils.clamp(0.85 - lift * 1.4, 0.35, 0.95) * this.intro.s

    // Ondas NFC: expansão + fade contínuos, mais intensas no hover/toque
    this.wavePhase += dt * (0.32 + energy * 0.45) * (this.reduced ? 0.5 : 1)
    const baseOpacity = 0.32 + energy * 0.63
    for (const wave of this.waves) {
      const p = (this.wavePhase + wave.offset) % 1
      const sc = 1 + p * (1.2 + energy * 0.5)
      wave.mesh.scale.set(sc, sc, 1)
      wave.mesh.material.opacity = Math.sin(p * Math.PI) * (1 - p * 0.4) * baseOpacity
    }

    // Brilho ciano no lado do NFC
    this.nfcLight.position.set(this.root.position.x + (CARD_W / 2) * s + this.float.position.x * s, 0.4, 2)
    this.nfcLight.intensity = energy * 6

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    this.running = false
    cancelAnimationFrame(this.raf)
    gsap.killTweensOf([this.intro, this.tap, this.burst])
    window.removeEventListener('pointermove', this.onPointerMove)
    document.documentElement.removeEventListener('mouseleave', this.onPointerLeave)
    window.removeEventListener('blur', this.onPointerLeave)
    this.eventTarget.removeEventListener('click', this.onClick)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.resizeObserver?.disconnect()
    this.io?.disconnect()
    this.disposables.forEach((d) => d.dispose())
    this.envMap?.dispose()
    this.renderer.dispose()
  }
}
