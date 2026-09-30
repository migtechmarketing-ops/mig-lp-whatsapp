import { useEffect, useRef, useState } from 'react'

// O link do WhatsApp (com a mensagem do parceiro) vem do <meta> do index.html,
// trocado por LP no deploy. Ver partners.json e deploy-all.mjs.
export const WHATSAPP_URL =
  document.querySelector<HTMLMetaElement>('meta[name="mig-whatsapp"]')?.content ||
  'https://wa.me/5527999458244'

// ---------------------------------------------------------------------------
// Animate — wrapper de entrada (CSS puro, revelado por `forwards`)
// ---------------------------------------------------------------------------
type Direction = 'up' | 'down' | 'left' | 'right' | 'scale'
const DIRECTION_CLASS: Record<Direction, string> = {
  up: 'animate-fade-up',
  down: 'animate-fade-down',
  left: 'animate-fade-left',
  right: 'animate-fade-right',
  scale: 'animate-fade-scale',
}

export function Animate({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: Direction
}) {
  return (
    <div className={`opacity-0 ${DIRECTION_CLASS[direction]} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Formulário HubSpot
// ---------------------------------------------------------------------------
function HubspotForm() {
  const slot = useRef<HTMLDivElement>(null)
  const [enviado, setEnviado] = useState(false)

  // O wa.me responde com X-Frame-Options: DENY, então um redirect do HubSpot
  // para o WhatsApp quebra quando a LP está dentro do iframe do WordPress.
  // Em vez disso, o formulário exibe a mensagem de obrigado e nós oferecemos
  // o WhatsApp num link que abre fora do frame.
  useEffect(() => {
    const onSuccess = () => setEnviado(true)
    document.addEventListener('hs-form-event:on-submission:success', onSuccess)
    return () => document.removeEventListener('hs-form-event:on-submission:success', onSuccess)
  }, [])

  // O embed do HubSpot só varre o DOM no load, então o container vive no
  // index.html (fora do React) e é movido para cá assim que o form renderiza.
  useEffect(() => {
    let cancelled = false

    const move = () => {
      if (cancelled || !slot.current) return true
      const holder = document.getElementById('hs-holder')
      const frame = holder?.querySelector<HTMLElement>('.hs-form-frame')
      if (!frame || frame.childElementCount === 0) return false
      slot.current.appendChild(frame)
      holder?.remove()
      return true
    }

    if (move()) return
    const id = window.setInterval(() => {
      if (move()) window.clearInterval(id)
    }, 200)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  return (
    <Animate delay={700} direction="scale" className="w-full max-w-[380px] mx-auto lg:mx-0 shrink-0" >
      <div className="lg:scale-[0.8] lg:origin-right">
        <div id="formulario" ref={slot} className="hs-form-wrap scroll-mt-24 w-full rounded-[18px] sm:rounded-[20px] bg-white p-3 sm:p-4" />

        {enviado && (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-[10px] w-full h-[51px] rounded-[12px] bg-[#25D366] text-white text-[15px] font-[450] transition-colors hover:bg-[#1eb85a]"
          >
            <WhatsAppIcon className="w-[20px] h-[20px]" />
            Continuar no WhatsApp
          </a>
        )}
      </div>
    </Animate>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#080A19]">
      <video className="absolute inset-0 w-full h-full object-cover" src="/eua.mp4" autoPlay loop muted playsInline />
      {/* o vídeo EUA é claro: overlay necessário para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A19]/70 via-[#080A19]/45 to-[#080A19]/80" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Nav />

        <div className="flex-1 flex items-center py-8">
          <div className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
            <div className="max-w-[760px] text-left">
              <Animate delay={300} direction="up">
                <h1 className="text-white text-[30px] sm:text-[42px] md:text-[52px] lg:text-[58px] font-black leading-[1.05] mb-5 sm:mb-8">
                  Sua jornada de imigração profissional para os EUA começa com estratégia
                </h1>
              </Animate>

              <Animate delay={500} direction="up">
                <p className="text-white/80 text-[16px] sm:text-[18px] md:text-[20px] font-[450] leading-[1.3] max-w-[560px]">
                  Converse com um especialista da MIG e descubra quais caminhos existem para sua profissão e qual pode
                  ser o próximo passo da sua preparação.
                </p>
              </Animate>
            </div>

            <HubspotForm />
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <nav className="w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] pt-[20px] sm:pt-[30px] flex items-center relative z-50">
      <Animate delay={0} direction="down">
        <img src="/logo-mig.png" alt="MIG" className="h-[28px] sm:h-[34px] w-auto" />
      </Animate>

    </nav>
  )
}
