import QRCode from 'qrcode'

/**
 * Texturas do cartão desenhadas em canvas 2D.
 * Proporção do canvas = proporção do cartão (1.586), então o mapeamento UV é 1:1.
 */

export const CARD_RATIO = 1.586

const COLORS = {
  violet: '#5635F5',
  violet2: '#7047FF',
  cyan: '#00B8E6',
  ink: '#111111'
}

const FONT = '"Plus Jakarta Sans", "Inter", system-ui, sans-serif'

export function createCanvas(width) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = Math.round(width / CARD_RATIO)
  return canvas
}

/** PRNG determinístico — a textura de "papel" fica idêntica a cada redesenho. */
function seeded(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

function poly(ctx, points, fill) {
  ctx.beginPath()
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
}

function spacedText(ctx, text, x, y, spacing, align = 'left') {
  const chars = [...text]
  const widths = chars.map((c) => ctx.measureText(c).width)
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1)
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x
  const prevAlign = ctx.textAlign
  ctx.textAlign = 'left'
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y)
    cx += widths[i] + spacing
  })
  ctx.textAlign = prevAlign
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Símbolo NFC: ondas concêntricas. */
function drawNfcSymbol(ctx, x, y, size, color, lineWidth) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  for (let i = 0; i < 4; i++) {
    const r = size * (0.18 + i * 0.26)
    ctx.globalAlpha = 1 - i * 0.12
    ctx.beginPath()
    ctx.arc(x, y, r, -Math.PI / 4, Math.PI / 4)
    ctx.stroke()
  }
  ctx.restore()
}

function drawQr(ctx, text, x, y, size) {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const n = modules.size
  const quiet = 2
  const cell = size / (n + quiet * 2)
  const pad = size * 0.04

  // Placa branca levemente elevada
  ctx.save()
  ctx.shadowColor = 'rgba(17,17,17,0.10)'
  ctx.shadowBlur = size * 0.06
  ctx.shadowOffsetY = size * 0.015
  ctx.fillStyle = '#FFFFFF'
  roundRect(ctx, x - pad, y - pad, size + pad * 2, size + pad * 2, size * 0.07)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = COLORS.ink
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (modules.get(r, c)) {
        // +0.6px evita frestas entre módulos no redimensionamento
        ctx.fillRect(x + (c + quiet) * cell, y + (r + quiet) * cell, cell + 0.6, cell + 0.6)
      }
    }
  }
}

function drawTechLines(ctx, W, H, color) {
  const u = W / 1000
  ctx.save()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 1.6 * u
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const paths = [
    [[70, 520], [70, 470], [110, 430], [230, 430]],
    [[70, 555], [150, 555], [185, 520], [300, 520]],
    [[930, 90], [930, 140], [900, 170]]
  ]

  ctx.globalAlpha = 0.28
  paths.forEach((p) => {
    ctx.beginPath()
    p.forEach(([px, py], i) => {
      const X = px * u
      const Y = (py / 630) * H
      i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y)
    })
    ctx.stroke()
    const [ex, ey] = p[p.length - 1]
    ctx.beginPath()
    ctx.arc(ex * u, (ey / 630) * H, 4 * u, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

/**
 * Frente do cartão.
 * @param {HTMLImageElement|null} logo  logo oficial (desenhada sem alterações)
 */
export function drawFront(canvas, { logo = null, qrText }) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const u = W / 1000

  ctx.clearRect(0, 0, W, H)

  // Base off-white com leve variação de luz
  const base = ctx.createLinearGradient(0, 0, W, H)
  base.addColorStop(0, '#FFFFFF')
  base.addColorStop(0.55, '#FAF9F6')
  base.addColorStop(1, '#F1EFEA')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, W, H)

  // Grão de papel premium, muito sutil
  const rnd = seeded(7)
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = rnd() > 0.5 ? 'rgba(17,17,17,0.028)' : 'rgba(255,255,255,0.5)'
    ctx.fillRect(rnd() * W, rnd() * H, 1.2 * u, 1.2 * u)
  }

  // Facetas de cor — canto superior esquerdo
  const vGrad = ctx.createLinearGradient(0, 0, 230 * u, 230 * u)
  vGrad.addColorStop(0, COLORS.violet)
  vGrad.addColorStop(1, COLORS.violet2)
  poly(ctx, [[0, 0], [205 * u, 0], [0, 250 * u]], vGrad)

  const cGrad = ctx.createLinearGradient(0, 260 * u, 260 * u, 0)
  cGrad.addColorStop(0, 'rgba(0,184,230,0.85)')
  cGrad.addColorStop(1, 'rgba(112,71,255,0.55)')
  poly(ctx, [[205 * u, 0], [240 * u, 0], [0, 292 * u], [0, 250 * u]], cGrad)
  poly(ctx, [[258 * u, 0], [268 * u, 0], [0, 326 * u], [0, 314 * u]], 'rgba(86,53,245,0.22)')

  // Facetas de cor — canto inferior direito
  const vGrad2 = ctx.createLinearGradient(W, H, W - 230 * u, H - 230 * u)
  vGrad2.addColorStop(0, COLORS.violet)
  vGrad2.addColorStop(1, COLORS.violet2)
  poly(ctx, [[W, H], [W - 175 * u, H], [W, H - 215 * u]], vGrad2)
  const cGrad2 = ctx.createLinearGradient(W - 260 * u, H, W, H - 260 * u)
  cGrad2.addColorStop(0, 'rgba(0,184,230,0.8)')
  cGrad2.addColorStop(1, 'rgba(112,71,255,0.5)')
  poly(ctx, [[W - 175 * u, H], [W - 208 * u, H], [W, H - 255 * u], [W, H - 215 * u]], cGrad2)

  drawTechLines(ctx, W, H, COLORS.violet)

  // Símbolo NFC + rótulo — canto superior direito
  drawNfcSymbol(ctx, 842 * u, 100 * u, 58 * u, COLORS.ink, 7 * u)
  ctx.fillStyle = COLORS.ink
  ctx.font = `800 ${32 * u}px ${FONT}`
  ctx.textBaseline = 'middle'
  spacedText(ctx, 'NFC', 876 * u, 165 * u, 2 * u, 'center')

  // QR Code
  const qrSize = 170 * u
  drawQr(ctx, qrText, 775 * u, H / 2 - qrSize / 2 + 35 * u, qrSize)

  // Logo oficial — centralizada na área livre, proporção preservada
  const boxW = 400 * u
  const boxH = 250 * u
  const cx = 440 * u
  const cy = H / 2 + 8 * u
  if (logo && logo.naturalWidth) {
    const scale = Math.min(boxW / logo.naturalWidth, boxH / logo.naturalHeight)
    const lw = logo.naturalWidth * scale
    const lh = logo.naturalHeight * scale
    ctx.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh)
  } else {
    // Fallback temporário enquanto a logo não é carregada
    ctx.fillStyle = COLORS.ink
    ctx.textAlign = 'center'
    ctx.font = `800 ${84 * u}px ${FONT}`
    ctx.fillText('Nmento', cx, cy - 18 * u)
    ctx.font = `600 ${28 * u}px ${FONT}`
    ctx.fillStyle = '#333'
    spacedText(ctx, 'Technology', cx, cy + 50 * u, 10 * u, 'center')
    ctx.textAlign = 'left'
  }

  // Microtexto de acabamento
  ctx.fillStyle = 'rgba(17,17,17,0.38)'
  ctx.font = `600 ${15 * u}px ${FONT}`
  ctx.textBaseline = 'alphabetic'
  spacedText(ctx, 'SMART BUSINESS CARD', 300 * u, H - 44 * u, 5 * u)
}

/** Verso do cartão: violeta profundo, instrução de uso. */
export function drawBack(canvas) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const u = W / 1000

  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#6A45FF')
  g.addColorStop(0.5, '#5635F5')
  g.addColorStop(1, '#3A1FC9')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Grade fina
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1.2 * u
  for (let x = 0; x <= W; x += 50 * u) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = 0; y <= H; y += 50 * u) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  // Brilho ciano discreto
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.15, 0, W * 0.85, H * 0.15, W * 0.5)
  glow.addColorStop(0, 'rgba(0,184,230,0.35)')
  glow.addColorStop(1, 'rgba(0,184,230,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  drawNfcSymbol(ctx, 120 * u, H / 2, 150 * u, '#FFFFFF', 12 * u)

  ctx.fillStyle = '#FFFFFF'
  ctx.textBaseline = 'middle'
  ctx.font = `800 ${58 * u}px ${FONT}`
  ctx.fillText('Aproxime do', 330 * u, H / 2 - 40 * u)
  ctx.fillText('smartphone', 330 * u, H / 2 + 34 * u)

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = `600 ${17 * u}px ${FONT}`
  spacedText(ctx, 'NMENTO TECHNOLOGY', 330 * u, H - 70 * u, 6 * u)
}

/** Sombra de contato: elipse com gradiente radial, desenhada uma vez. */
export function createShadowCanvas() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 256
  const ctx = c.getContext('2d')
  ctx.translate(256, 128)
  ctx.scale(1, 0.5)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 250)
  g.addColorStop(0, 'rgba(60,40,140,0.22)')
  g.addColorStop(0.4, 'rgba(60,40,140,0.08)')
  g.addColorStop(1, 'rgba(60,40,140,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(0, 0, 250, 0, Math.PI * 2)
  ctx.fill()
  return c
}

export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}
