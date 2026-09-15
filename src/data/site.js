/**
 * Configuração central da marca e do conteúdo.
 * Edite aqui textos, links e preços sem mexer nos componentes.
 */

export const brand = {
  name: 'Nmento Technology',
  tagline: 'Soluções em Tecnologia',
  // Logo oficial: coloque o arquivo em /public/brand/nmento-logo.png
  logo: '/brand/nmento-logo.png',
  // URL codificada no QR Code do cartão 3D
  profileUrl: 'https://nmento.com.br/cartao',
  whatsapp: 'https://wa.me/5500000000000',
  email: 'contato@nmento.com.br'
}

export const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'como-funciona', label: 'Como Funciona' },
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'planos', label: 'Planos' },
  { id: 'faq', label: 'FAQ' }
]

export const benefits = [
  { icon: 'nfc', title: 'NFC em 1 toque', text: 'Aproxime o cartão e conecte instantaneamente.' },
  { icon: 'qr', title: 'QR Code integrado', text: 'Tenha seu perfil sempre acessível em qualquer lugar.' },
  { icon: 'user', title: 'Perfil digital personalizado', text: 'Insira suas informações, redes sociais e muito mais.' },
  { icon: 'share', title: 'Compartilhe em segundos', text: 'Mais praticidade para você e para quem recebe.' }
]

export const steps = [
  { title: 'Aproxime', text: 'Aproxime o cartão do smartphone.' },
  { title: 'Conecte', text: 'A tecnologia NFC abre seu perfil digital.' },
  { title: 'Compartilhe', text: 'Seu contato, redes sociais e informações ficam disponíveis.' }
]

export const features = [
  { icon: 'nfc', title: 'Tecnologia NFC', text: 'Conexão por aproximação, compatível com iPhone e Android.' },
  { icon: 'qr', title: 'QR Code', text: 'Alternativa universal para qualquer câmera, sem aplicativo.' },
  { icon: 'user', title: 'Perfil personalizado', text: 'Sua foto, cores, links e informações em uma página única.' },
  { icon: 'refresh', title: 'Atualização online', text: 'Mudou de número ou cargo? Atualize sem imprimir de novo.' },
  { icon: 'share', title: 'Compartilhamento rápido', text: 'Seu contato salvo na agenda de quem recebe em segundos.' },
  { icon: 'leaf', title: 'Menos papel', text: 'Um único cartão substitui centenas de cartões impressos.' },
  { icon: 'badge', title: 'Mais profissionalismo', text: 'Uma primeira impressão moderna, memorável e premium.' },
  { icon: 'sparkles', title: 'Mais possibilidades', text: 'Links, portfólio, catálogo, avaliações e o que sua marca precisar.' }
]

// price: null → exibe "Sob consulta". Para mostrar um valor, use ex.: price: '89'
export const plans = [
  {
    name: 'Essencial',
    description: 'Para quem quer começar a se conectar de forma inteligente.',
    price: null,
    period: 'Orçamento sob medida',
    features: ['Cartão NFC', 'Perfil digital', 'QR Code', 'Compartilhamento'],
    cta: 'Escolher Essencial',
    featured: false
  },
  {
    name: 'Profissional',
    description: 'A experiência completa para profissionais e empreendedores.',
    price: null,
    period: 'Orçamento sob medida',
    features: ['Tudo do Essencial', 'Personalização avançada', 'Analytics', 'Redes sociais', 'Suporte prioritário'],
    cta: 'Criar meu cartão',
    featured: true
  },
  {
    name: 'Empresarial',
    description: 'Padronize a apresentação de toda a sua equipe.',
    price: null,
    period: 'a partir de 5 cartões',
    features: ['Cartões para equipes', 'Gestão centralizada', 'Personalização da empresa', 'Analytics avançado'],
    cta: 'Falar com vendas',
    featured: false
  }
]

export const faqs = [
  {
    q: 'Quem recebe o cartão precisa instalar algum aplicativo?',
    a: 'Não. Basta aproximar o cartão de um smartphone com NFC ou apontar a câmera para o QR Code. O perfil abre direto no navegador.'
  },
  {
    q: 'Funciona em iPhone e Android?',
    a: 'Sim. Todos os iPhones a partir do XS e a grande maioria dos Android com NFC leem o cartão. Para os demais, o QR Code garante o acesso.'
  },
  {
    q: 'Posso atualizar minhas informações depois?',
    a: 'Sim. Seu perfil é online: altere telefone, links, foto ou cargo quando quiser, sem trocar o cartão.'
  },
  {
    q: 'O cartão precisa de bateria ou carregamento?',
    a: 'Não. O chip NFC é passivo e é alimentado pelo próprio smartphone no momento da leitura.'
  },
  {
    q: 'Posso personalizar a arte do cartão?',
    a: 'Sim. Nos planos Profissional e Empresarial você aplica sua identidade visual, cores e logotipo no cartão físico.'
  },
  {
    q: 'Qual é o prazo de entrega?',
    a: 'Após a aprovação da arte, a produção leva em média de 5 a 7 dias úteis, mais o prazo de envio para sua região.'
  }
]

export const socials = [
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  { name: 'YouTube', href: '#', icon: 'youtube' },
  { name: 'WhatsApp', href: brand.whatsapp, icon: 'whatsapp' }
]
