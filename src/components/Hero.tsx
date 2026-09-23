import { useEffect, useRef } from 'react'

// Troque o número pelo WhatsApp do time comercial da MIG
export const WHATSAPP_URL = 'https://wa.me/5511999999999'

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

// ---------------------------------------------------------------------------
// Formulário HubSpot
// ---------------------------------------------------------------------------
function HubspotForm() {
  const slot = useRef<HTMLDivElement>(null)

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
      <div id="formulario" ref={slot} className="hs-form-wrap scroll-mt-24 w-full rounded-[18px] sm:rounded-[20px] bg-white p-3 sm:p-4 lg:scale-[0.8] lg:origin-right" />
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
