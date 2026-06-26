import { useStore } from '../context/StoreContext'

export default function WishlistDrawer() {
  const { products, wishlist, wishlistOpen, setWishlistOpen, addToCart, toggleWishlist, fmt } = useStore()

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/50 backdrop-blur-sm z-[200] opacity-0 invisible transition-all duration-250 ${wishlistOpen ? '!opacity-100 !visible' : ''}`}
        aria-hidden={!wishlistOpen}
        onClick={() => setWishlistOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 right-0 w-[min(440px,100vw)] h-full bg-white z-[201] flex flex-col transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xl ${wishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Wishlist"
        aria-hidden={!wishlistOpen}
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-[22px] border-b border-border">
          <h2 className="text-base font-semibold flex items-center gap-2.5 text-ink">
            <i className="fas fa-heart" aria-hidden="true"></i> Wishlist
            {wishlist.length > 0 && <span className="text-[0.72rem] text-mist font-normal">({wishlist.length})</span>}
          </h2>
          <button
            onClick={() => setWishlistOpen(false)}
            className="bg-surface border border-border rounded-pill w-9 h-9 flex items-center justify-center cursor-pointer text-slate text-[0.95rem] transition-all duration-150 hover:bg-red-light hover:text-red hover:border-red-light"
            aria-label="Close wishlist"
          >
            <i className="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          {!wishlist.length ? (
            <div className="text-center py-[60px] px-5">
              <div className="w-16 h-16 bg-surface border border-border rounded-lg flex items-center justify-center text-[1.6rem] text-mist mx-auto mb-4">
                <i className="fas fa-heart-crack" aria-hidden="true"></i>
              </div>
              <h3 className="text-base font-semibold text-ink mb-1.5">Nothing saved yet</h3>
              <p className="text-[0.85rem] text-slate">Heart items you love to find them here.</p>
            </div>
          ) : (
            wishlist.map((id) => {
              const p = products.find(x => x.id === id)
              if (!p) return null
              return (
                <div key={id} className="flex gap-3.5 bg-surface rounded-md p-3.5 mb-2.5 items-center">
                  <img className="w-[56px] h-[56px] object-contain bg-white rounded-sm p-1.5 shrink-0 border border-border" src={p.thumbnail} alt={p.title} loading="lazy" width="56" height="56" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.83rem] font-semibold text-ink mb-1 truncate">{p.title}</div>
                    <div className="text-[0.9rem] font-bold text-ink">{fmt(p.price)}</div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => addToCart(p.id)} className="inline-flex items-center gap-1.5 bg-transparent text-ink font-semibold text-[0.72rem] px-3 py-1.5 rounded-pill border-[1.5px] border-border-strong cursor-pointer transition-all duration-150 hover:bg-ink hover:text-white hover:border-ink" aria-label={`Add ${p.title} to cart`}>
                      <i className="fas fa-cart-plus" aria-hidden="true"></i> Add
                    </button>
                    <button onClick={() => toggleWishlist(p.id)} className="inline-flex items-center gap-1.5 bg-transparent font-semibold text-[0.72rem] px-3 py-1.5 rounded-pill border-[1.5px] border-red-light text-red cursor-pointer transition-all duration-150 hover:bg-red-light/50" aria-label={`Remove ${p.title} from wishlist`}>
                      <i className="fas fa-trash-can" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>
    </>
  )
}
