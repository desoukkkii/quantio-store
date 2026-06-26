import { useEffect } from 'react'
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
        <i key={i} className={`${cls} text-[0.82rem] text-gold`} aria-hidden="true"></i>
      ))}
    </span>
  )
}

export default function ProductModal() {
  const { modalProduct, setModalProduct, wishlist, addToCart, toggleWishlist, fmt } = useStore()

  useEffect(() => {
    if (modalProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modalProduct])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setModalProduct(null) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setModalProduct])

  if (!modalProduct) return null

  const p = modalProduct
  const inWish = wishlist.includes(p.id)
  const origPrice = p.discountPercentage > 0
    ? p.price / (1 - p.discountPercentage / 100)
    : null
  const reviewCount = p.reviews ? p.reviews.length : p.stock

  return (
    <div
      className="fixed inset-0 bg-ink/55 backdrop-blur-md z-[300] flex items-center justify-center p-6"
      onClick={(e) => { if (e.target === e.currentTarget) setModalProduct(null) }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="bg-white rounded-xl max-w-[740px] w-full max-h-[90vh] overflow-y-auto relative scale-100 translate-y-0 transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] overscroll-contain">
        <button
          onClick={() => setModalProduct(null)}
          className="absolute top-4 right-4 bg-surface border border-border rounded-pill w-[38px] h-[38px] flex items-center justify-center cursor-pointer text-slate z-10 text-base transition-all duration-150 hover:bg-red-light hover:text-red hover:border-red-light"
          aria-label="Close product details"
        >
          <i className="fas fa-xmark" aria-hidden="true"></i>
        </button>
        <div className="grid grid-cols-2 gap-0 max-lg:grid-cols-1">
          <div className="bg-surface rounded-tl-xl rounded-bl-xl flex items-center justify-center p-10 min-h-[300px] border-r border-border max-lg:rounded-t-xl max-lg:rounded-bl-none max-lg:border-r-0 max-lg:border-b max-lg:border-border">
            <img className="max-w-full max-h-[260px] object-contain" src={p.thumbnail} alt={p.title} />
          </div>
          <div className="p-9 pl-8 max-lg:p-6">
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.8px] text-teal mb-3 block">{p.category}</span>
            <h2 id="modalTitle" className="font-display text-[1.5rem] font-normal mb-1 text-ink leading-[1.2]">{p.title}</h2>
            <div className="flex items-center gap-1 mb-4">
              <StarRating rating={p.rating} />
              <span className="text-mist text-[0.78rem] ml-0.5">{p.rating.toFixed(1)} · {reviewCount} reviews</span>
            </div>
            <p className="text-[0.875rem] text-slate leading-[1.65] mb-5">{p.description || 'No description available.'}</p>
            <div className="grid grid-cols-2 gap-2 mb-[22px] max-lg:grid-cols-1">
              {[
                { label: 'Brand', value: p.brand || 'Generic' },
                {
                  label: 'Availability',
                  value: p.stock > 0
                    ? <><span className="text-green">In Stock</span> ({p.stock})</>
                    : <span className="text-red">Out of Stock</span>
                },
                { label: 'SKU', value: p.sku || '—' },
                { label: 'Weight', value: p.weight ? `${p.weight}g` : '—' },
              ].map((item, i) => (
                <div key={i} className="bg-surface rounded-sm px-3.5 py-2.5 border border-border">
                  <div className="text-[0.62rem] uppercase tracking-[0.4px] text-mist mb-0.5 font-semibold">{item.label}</div>
                  <div className="font-semibold text-[0.85rem] text-ink">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex items-baseline gap-2.5 mb-[22px] flex-wrap">
              <span className="font-display text-2xl font-normal text-ink">{fmt(p.price)}</span>
              {origPrice && (
                <>
                  <span className="text-base text-mist line-through">{fmt(origPrice)}</span>
                  <span className="text-red text-[0.82rem] font-bold">Save {Math.round(p.discountPercentage)}%</span>
                </>
              )}
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => addToCart(p.id)} className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-white font-semibold text-[0.875rem] px-7 py-[13px] rounded-pill border-none cursor-pointer tracking-[0.2px] transition-all duration-150 hover:bg-ink-soft hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,15,20,0.2)] active:translate-y-0">
                <i className="fas fa-cart-plus" aria-hidden="true"></i> Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(p.id)}
                className={`inline-flex items-center gap-2 bg-transparent font-semibold text-[0.875rem] px-6 py-[13px] rounded-pill border-[1.5px] cursor-pointer transition-all duration-150 hover:bg-ink hover:text-white hover:border-ink ${inWish ? 'text-red border-red-light' : 'text-ink border-border-strong'}`}
                aria-label={`${inWish ? 'Remove from' : 'Add to'} wishlist`}
              >
                <i className={`fas fa-heart ${inWish ? 'text-red' : ''}`} aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
