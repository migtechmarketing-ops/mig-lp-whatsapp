export default function FinalCTA() {
  return (
    <section className="relative w-full bg-[#032CA5] text-center overflow-hidden">
      <img src="/bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-[50%_40%]" />
      <div className="absolute inset-0 bg-[#032CA5]/45" />
      <div className="relative w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-[82px] py-20 sm:py-28 lg:py-36 flex flex-col items-center">
        <h2 className="text-white text-[32px] sm:text-[44px] md:text-[56px] lg:text-[64px] font-black leading-[0.98] max-w-[900px]">
          Quer entender qual caminho faz sentido para você?
        </h2>
        <a
          href="#formulario"
          className="mt-8 sm:mt-12 inline-flex items-center gap-[10px] h-[46px] sm:h-[51px] px-5 sm:px-[27px] bg-[#032CA5] rounded-[12px] text-white text-[14px] sm:text-[15.5px] font-[450] leading-[15.5px] transition-colors hover:bg-[#0438c9]"
        >
          Fale com o especialista
        </a>
        <p className="mt-16 sm:mt-24 text-white/60 text-[12px] font-[450]">© {new Date().getFullYear()} MIG</p>
      </div>
    </section>
  )
}
