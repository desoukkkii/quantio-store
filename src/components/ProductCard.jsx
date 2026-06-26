import { useEffect, useRef } from 'react'
import { useStore } from '../context/StoreContext'

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push('fas fa-star')
    else if (i === full && half) stars.push('fas fa-star-half-alt')
    else stars.push('far fa-star')
  }
  return (
    <span className="inline-flex items-center gap-0.5">
      {stars.map((cls, i) => (
        <i key={i} className={`${cls} text-[0.72rem] text-gold`} aria-hidden="true"></i>
      ))}
    </span>
  )
}

export default function ProductCard({ product, index }) {
  const { wishlist, addToCart, toggleWishlist, setModalProduct, fmt, getBadge } = useStore()
  const cardRef = useRef(null)
  const inWish = wishlist.includes(product.id)
  const badge = getBadge(product)
  const origPrice = product.discountPercentage > 0
    ? product.price / (1 - product.discountPercentage / 100)
    : null

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      cardRef.current?.classList.add('visible')
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          obs.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (cardRef.current) obs.observe(cardRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className="reveal group bg-white border border-border rounded-lg overflow-hidden cursor-pointer flex flex-col transition-all duration-250 hover:border-border-strong hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${index * 20}ms` }}
      onClick={() => setModalProduct(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setModalProduct(product) } }}
    >
      <div className="relative bg-surface h-[210px] flex items-center justify-center p-6 overflow-hidden max-lg:h-[160px] max-lg:p-4">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[0.62rem] font-bold uppercase tracking-[0.5px] px-2.5 py-1 rounded-pill text-white ${badge.type === 'sale' ? 'bg-red' : badge.type === 'bestseller' ? 'bg-gold text-ink' : 'bg-teal'}`}>
            {badge.text}
          </span>
        )}
        <button
          className={`absolute top-3 right-3 z-10 bg-white/95 border border-border rounded-pill w-[34px] h-[34px] flex items-center justify-center text-mist cursor-pointer text-[0.82rem] backdrop-blur-sm transition-all duration-150 hover:text-red hover:border-red-light hover:scale-110 ${inWish ? '!text-red !bg-red-light !border-red-light' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
          aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={inWish}
        >
          <i className="fas fa-heart" aria-hidden="true"></i>
        </button>
        <img
          className="max-w-full max-h-full object-contain transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-110"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          width="200"
          height="200"
        />
      </div>
      <div className="px-[18px] pb-[18px] pt-4 flex flex-col flex-1 max-lg:px-3.5 max-lg:pb-3.5">
        <div className="text-[0.66rem] font-bold uppercase tracking-[0.6px] text-teal mb-1.5">{product.category}</div>
        <h3 className="text-[0.9rem] font-semibold text-ink mb-1.5 line-clamp-2 leading-[1.4] flex-1 max-lg:text-[0.82rem]">{product.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-mist text-[0.72rem]">({product.rating.toFixed(1)})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[1.1rem] font-bold text-ink max-lg:text-base">
            {fmt(product.price)}
            {origPrice && <span className="text-[0.78rem] font-normal text-mist line-through ml-1.5">{fmt(origPrice)}</span>}
          </div>
          <button
            className="bg-ink border-none rounded-pill w-9 h-9 flex items-center justify-center text-white text-[0.82rem] cursor-pointer transition-all duration-150 hover:bg-teal hover:scale-110 hover:shadow-[0_4px_12px_rgba(15,118,110,0.35)] max-lg:w-8 max-lg:h-8 max-lg:text-[0.76rem]"
            onClick={(e) => { e.stopPropagation(); addToCart(product.id) }}
            aria-label={`Add ${product.title} to cart`}
          >
            <i className="fas fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
