import { useStore } from '../context/StoreContext'

export default function PromoBanner() {
  const { showDiscounted } = useStore()
  return (
    <section className="max-w-content mx-auto px-7 max-[480px]:px-4 pb-[72px] max-lg:px-5 max-lg:pb-12" id="deals" aria-labelledby="promoHeading">
      <div className="bg-gradient-to-r from-ink via-[#1e293b] to-[#0f3d38] rounded-xl px-[60px] py-14 max-lg:px-7 max-lg:py-10 flex items-center justify-between gap-10 text-white overflow-hidden relative max-lg:flex-col max-lg:text-center">
        <div className="promo-bg-shape"></div>
        <div className="max-w-[480px] relative z-[1]">
          <span className="inline-flex items-center bg-gold/20 text-gold text-[0.7rem] font-bold uppercase tracking-[1.5px] px-3.5 py-[5px] rounded-pill mb-4 border border-gold/30">
            Limited Time
          </span>
          <h2 id="promoHeading" className="font-display text-[clamp(2rem,4vw,3rem)] font-normal mb-3 leading-[1.1]">
            Up to <mark className="bg-none text-gold">40% Off</mark>
          </h2>
          <p className="text-[0.95rem] opacity-75 mb-7 leading-[1.6]">
            On select electronics and accessories. Offer ends soon — don&apos;t miss out.
          </p>
          <button onClick={showDiscounted} className="inline-flex items-center gap-2 bg-white text-ink font-semibold text-[0.875rem] px-7 py-[13px] rounded-pill border-none cursor-pointer tracking-[0.2px] transition-all duration-150 hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0">
            Shop the Sale
          </button>
        </div>
        <div className="shrink-0 relative z-[1] max-lg:hidden" aria-hidden="true">
          <div className="relative w-[160px] h-[160px]">
            <svg viewBox="0 0 120 120" fill="none" className="w-full h-full animate-ring-in" aria-hidden="true">
              <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <circle cx="60" cy="60" r="54" stroke="white" strokeWidth="2" strokeDasharray="339" strokeDashoffset="204" strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-display text-white leading-none text-center">
              <span className="text-[3.2rem] font-normal text-gold">40</span>%<br /><small className="text-[0.75rem] font-body font-bold tracking-[2px] opacity-70 uppercase">OFF</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
