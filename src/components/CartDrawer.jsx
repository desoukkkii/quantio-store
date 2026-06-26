import { useStore } from '../context/StoreContext'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, handleCheckout, fmt } = useStore()
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/50 backdrop-blur-sm z-[200] opacity-0 invisible transition-all duration-250 ${cartOpen ? '!opacity-100 !visible' : ''}`}
        aria-hidden={!cartOpen}
        onClick={() => setCartOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 right-0 w-[min(440px,100vw)] h-full bg-white z-[201] flex flex-col transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xl ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping Cart"
        aria-hidden={!cartOpen}
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-[22px] border-b border-border">
          <h2 className="text-base font-semibold flex items-center gap-2.5 text-ink">
            <i className="fas fa-bag-shopping" aria-hidden="true"></i> Cart
            {cartCount > 0 && <span className="text-[0.72rem] text-mist font-normal">({cartCount})</span>}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="bg-surface border border-border rounded-pill w-9 h-9 flex items-center justify-center cursor-pointer text-slate text-[0.95rem] transition-all duration-150 hover:bg-red-light hover:text-red hover:border-red-light"
            aria-label="Close cart"
          >
            <i className="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
          {!cart.length ? (
            <div className="text-center py-[60px] px-5">
              <div className="w-16 h-16 bg-surface border border-border rounded-lg flex items-center justify-center text-[1.6rem] text-mist mx-auto mb-4">
                <i className="fas fa-cart-plus" aria-hidden="true"></i>
              </div>
              <h3 className="text-base font-semibold text-ink mb-1.5">Your cart is empty</h3>
              <p className="text-[0.85rem] text-slate">Add something you love to get started.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3.5 bg-surface rounded-md p-3.5 mb-2.5 items-center hover:shadow-xs transition-shadow">
                <img className="w-[60px] h-[60px] object-contain bg-white rounded-sm p-1.5 shrink-0 border border-border" src={item.image} alt={item.title} loading="lazy" width="60" height="60" />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.82rem] font-semibold truncate mb-0.5 text-ink">{item.title}</div>
                  <div className="text-[0.78rem] text-slate">{fmt(item.price)} each</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-[26px] h-[26px] rounded-pill border border-border bg-white flex items-center justify-center cursor-pointer text-[0.6rem] text-slate transition-all duration-150 hover:border-ink hover:text-ink hover:bg-surface" aria-label={`Decrease quantity of ${item.title}`}>
                      <i className="fas fa-minus" aria-hidden="true"></i>
                    </button>
                    <span className="font-bold text-[0.85rem] min-w-[20px] text-center text-ink">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-[26px] h-[26px] rounded-pill border border-border bg-white flex items-center justify-center cursor-pointer text-[0.6rem] text-slate transition-all duration-150 hover:border-ink hover:text-ink hover:bg-surface" aria-label={`Increase quantity of ${item.title}`}>
                      <i className="fas fa-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <div className="font-bold text-[0.9rem] text-ink shrink-0">{fmt(item.price * item.qty)}</div>
                <button onClick={() => removeFromCart(item.id)} className="bg-none border-none text-mist cursor-pointer text-[0.9rem] p-1 rounded-sm hover:text-red hover:bg-red-light transition-all duration-150" aria-label={`Remove ${item.title} from cart`}>
                  <i className="fas fa-xmark" aria-hidden="true"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border px-6 py-5 bg-surface">
          <div className="flex justify-between items-baseline text-[0.95rem] font-semibold text-ink mb-1.5">
            <span>Subtotal</span>
            <span className="text-[1.3rem] font-bold">{fmt(subtotal)}</span>
          </div>
          <p className="text-[0.75rem] text-green mb-4 flex items-center gap-1.5">
            <i className="fas fa-truck" aria-hidden="true"></i> Free shipping on orders over $50
          </p>
          <button onClick={handleCheckout} className="w-full inline-flex items-center justify-center gap-2 bg-ink text-white font-semibold text-[0.95rem] py-[15px] px-7 rounded-pill border-none cursor-pointer tracking-[0.2px] transition-all duration-150 hover:bg-ink-soft hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,15,20,0.2)] active:translate-y-0">
            Checkout <i className="fas fa-lock" aria-hidden="true"></i>
          </button>
        </div>
      </aside>
    </>
  )
}
