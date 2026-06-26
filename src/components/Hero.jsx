export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-surface via-surface to-[#f0f9ff] border-b border-border overflow-hidden" aria-labelledby="heroHeading">
      <div className="max-w-content mx-auto px-7 max-[480px]:px-4 flex items-center gap-12 min-h-[580px] max-lg:flex-col max-lg:min-h-auto max-lg:gap-0">
        <div className="flex-1 max-w-[560px] py-20 max-lg:py-[52px] max-lg:pb-10 max-lg:max-w-full max-lg:text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[2.5px] text-gold mb-[18px]">
            Winter Collection 2026
          </p>
          <h1 id="heroHeading" className="font-display text-[clamp(2.8rem,6vw,4.8rem)] font-normal leading-[1.02] text-ink tracking-[-1px] mb-5">
            Essentials,<br /><em className="italic text-teal not-italic">Refined.</em>
          </h1>
          <p className="text-[1.05rem] text-slate leading-[1.7] mb-9 max-w-[400px] max-lg:mx-auto max-lg:max-w-full">
            Minimal design. Maximum comfort. Thoughtfully crafted for the way you live today.
          </p>
          <div className="flex items-center gap-5 mb-9 flex-wrap max-lg:justify-center">
            <a href="#shop" className="inline-flex items-center gap-2 bg-ink text-white font-semibold text-[0.875rem] px-7 py-[13px] rounded-pill no-underline border-none cursor-pointer tracking-[0.2px] transition-all duration-150 hover:bg-ink-soft hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,15,20,0.2)] active:translate-y-0">
              Shop Now
            </a>
            <a href="#deals" className="inline-flex items-center gap-2 bg-transparent text-ink-soft font-semibold text-[0.875rem] py-[13px] no-underline border-b-[1.5px] border-transparent cursor-pointer transition-all duration-150 hover:border-ink hover:gap-3">
              Explore Sale <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
          <div className="flex gap-5 flex-wrap max-lg:justify-center">
            {[
              { icon: 'fa-shield-halved', text: 'Secure checkout' },
              { icon: 'fa-truck', text: 'Free over $50' },
              { icon: 'fa-rotate-left', text: '30-day returns' },
            ].map((item, i) => (
              <span key={i} className="text-[0.78rem] text-slate flex items-center gap-1.5">
                <i className={`fas ${item.icon} text-teal text-[0.85em]`} aria-hidden="true"></i> {item.text}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-[500px] relative h-[460px] flex items-center justify-center max-lg:hidden" aria-hidden="true">
          <div className="hv-orbit animate-spin-slow"></div>
          <div className="hv-orbit hv-orbit--2 animate-spin-slower"></div>
          <div className="relative z-[2] w-[280px] h-[280px] flex items-center justify-center">
            <div className="hv-blob w-[200px] h-[200px] bg-teal/12 -top-5 -left-5"></div>
            <div className="hv-blob w-[150px] h-[150px] bg-gold/15 -bottom-2.5 -right-2.5"></div>
            <div className="hv-blob w-[120px] h-[120px] bg-ink/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="grid grid-cols-3 gap-2.5 relative z-[3]">
              {[
                { icon: 'fa-spray-can-sparkles', accent: false, dim: false },
                { icon: 'fa-gem', accent: true, dim: false },
                { icon: 'fa-shirt', accent: false, dim: false },
                { icon: 'fa-microchip', accent: false, dim: true },
                { icon: 'fa-star', accent: false, dim: false, lg: true, text: '4.9' },
                { icon: 'fa-house', accent: false, dim: false },
                { icon: 'fa-bicycle', accent: false, dim: true },
                { icon: 'fa-couch', accent: false, dim: false },
                { icon: 'fa-wand-magic-sparkles', accent: true, dim: false },
              ].map((cell, i) => (
                <div
                  key={i}
                  className={`w-[76px] h-[76px] bg-white border border-border rounded-md flex items-center justify-center flex-col gap-1 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md cursor-default ${cell.accent ? '!bg-ink !text-white !border-ink' : ''} ${cell.dim ? 'opacity-50' : ''} ${cell.lg ? 'text-gold border-gold-light bg-gold-light text-[1.6rem]' : 'text-slate text-[1.4rem]'}`}
                >
                  <i className={`fas ${cell.icon}`} aria-hidden="true"></i>
                  {cell.text && <span className="font-display text-[0.7rem] font-normal text-ink-muted">{cell.text}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
