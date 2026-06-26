export default function FeaturesStrip() {
  const features = [
    { icon: 'fa-truck', title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: 'fa-rotate-left', title: 'Easy Returns', desc: '30-day return policy' },
    { icon: 'fa-shield-halved', title: 'Secure Payment', desc: '256-bit SSL encrypted' },
    { icon: 'fa-headset', title: '24/7 Support', desc: 'Dedicated help center' },
  ]
  return (
    <section className="border-y border-border bg-surface" aria-label="Store benefits">
      <div className="max-w-content mx-auto px-7 max-[480px]:px-4 py-8 max-lg:py-6 grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-lg:gap-4 max-[480px]:grid-cols-1">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-11 h-11 bg-teal-light rounded-md flex items-center justify-center text-teal text-[1.1rem] shrink-0">
              <i className={`fas ${f.icon}`} aria-hidden="true"></i>
            </div>
            <div>
              <strong className="block text-[0.85rem] font-semibold text-ink mb-0.5">{f.title}</strong>
              <span className="text-[0.76rem] text-slate">{f.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
