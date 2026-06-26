import { useEffect, useRef } from 'react'
import { useStore } from '../context/StoreContext'

export default function Categories() {
  const { categories, products, catIcon, setCategoryFilter } = useStore()
  const gridRef = useRef(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      gridRef.current?.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    gridRef.current?.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [categories])

  return (
    <section className="max-w-content mx-auto px-7 max-[480px]:px-4 py-[72px] max-lg:px-5 max-lg:py-12" aria-labelledby="catHeading">
      <div className="flex items-end justify-between mb-9 max-lg:flex-col max-lg:items-start max-lg:gap-1">
        <div>
          <div className="text-[0.68rem] font-bold uppercase tracking-[2px] text-gold mb-1">Browse</div>
          <h2 id="catHeading" className="font-display text-[clamp(1.5rem,3vw,2rem)] font-normal text-ink">Shop by Category</h2>
        </div>
        <a href="#shop" className="text-[0.825rem] font-semibold text-ink no-underline inline-flex items-center gap-1.5 py-2 border-b border-border hover:gap-2.5 hover:border-ink transition-all duration-150 whitespace-nowrap">
          All Products <i className="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3.5 max-lg:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]" role="list">
        {categories.slice(0, 8).map((c) => (
          <a
            key={c}
            href="#shop"
            onClick={(e) => { e.preventDefault(); setCategoryFilter(c); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="group cat-card-bg relative bg-white border border-border rounded-lg px-5 pt-7 pb-6 text-center cursor-pointer no-underline text-ink block transition-all duration-250 hover:border-teal hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
            role="listitem"
            aria-label={`${c}, ${products.filter(p => p.category === c).length} items`}
          >
            <i className={`fas ${catIcon(c)} text-[1.8rem] text-teal mb-3 block transition-transform duration-250 group-hover:scale-110`} aria-hidden="true"></i>
            <h3 className="text-[0.9rem] font-semibold mb-1 text-ink">{c.charAt(0).toUpperCase() + c.slice(1)}</h3>
            <span className="text-[0.75rem] text-mist">{products.filter(p => p.category === c).length} items</span>
          </a>
        ))}
      </div>
    </section>
  )
}
