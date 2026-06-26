import { useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function Footer() {
  const { addToast } = useStore()
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      addToast('Subscribed! Check your inbox for 10% off.', 'fa-envelope')
      setEmail('')
    }
  }

  return (
    <footer className="bg-ink text-white/85" role="contentinfo">
      <div className="max-w-content mx-auto px-7 max-[480px]:px-4 pt-[60px] pb-10 max-lg:pt-10 max-lg:pb-7 grid grid-cols-[1.6fr_1fr_1fr_1.6fr] gap-10 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1">
        <div>
          <div className="font-display text-[1.3rem] tracking-[3px] mb-3.5 flex items-center gap-2 text-white">
            <span className="text-gold text-[0.8em]" aria-hidden="true">✦</span> MERIDIAN
          </div>
          <p className="text-[0.85rem] leading-[1.7] text-white/55 mb-5">
            Your destination for premium essentials. We curate products that combine quality, design, and lasting value.
          </p>
          <div className="flex gap-2.5" aria-label="Social media links">
            {['instagram', 'twitter', 'facebook', 'pinterest'].map((s) => (
              <a key={s} href="#" aria-label={s.charAt(0).toUpperCase() + s.slice(1)}
                className="w-[38px] h-[38px] rounded-pill border border-white/15 flex items-center justify-center text-white/50 no-underline text-[0.9rem] transition-all duration-150 hover:border-white/40 hover:text-white hover:bg-white/8">
                <i className={`fab fa-${s}`} aria-hidden="true"></i>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[1.5px] text-white/40 mb-4">Shop</h4>
          <ul className="space-y-2.5" role="list">
            {['All Products', 'New Arrivals', 'Best Sellers', 'Sale', 'Gift Cards'].map((item) => (
              <li key={item}><a href="#" className="text-white/60 no-underline text-[0.875rem] hover:text-white transition-colors duration-150">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[1.5px] text-white/40 mb-4">Support</h4>
          <ul className="space-y-2.5" role="list">
            {['Help Center', 'Shipping Info', 'Returns & Exchanges', 'Order Tracking', 'Contact Us'].map((item) => (
              <li key={item}><a href="#" className="text-white/60 no-underline text-[0.875rem] hover:text-white transition-colors duration-150">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[1.5px] text-white/40 mb-4">Stay in the Loop</h4>
          <p className="text-[0.85rem] text-white/55 mb-5">Get 10% off your first order when you subscribe.</p>
          <form className="flex border border-white/15 rounded-pill overflow-hidden mb-5 bg-white/5 transition-colors duration-150 focus-within:border-white/35" onSubmit={handleSubmit}>
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-transparent border-none px-[18px] py-[11px] text-white text-[0.875rem] font-body outline-none placeholder:text-white/30"
            />
            <button type="submit" className="bg-teal border-none px-5 text-white cursor-pointer text-base hover:bg-[#0d9488] transition-colors shrink-0" aria-label="Subscribe">
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          </form>
          <div className="flex gap-3 text-[1.7rem] text-white/30 flex-wrap" aria-label="Accepted payment methods">
            {['visa', 'mastercard', 'amex', 'paypal', 'apple-pay'].map((p) => (
              <i key={p} className={`fab fa-cc-${p}`} title={p === 'apple-pay' ? 'Apple Pay' : p.charAt(0).toUpperCase() + p.slice(1)}></i>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-content mx-auto px-7 max-[480px]:px-4 py-5 border-t border-white/8 flex justify-between items-center text-[0.78rem] text-white/35 max-lg:flex-col max-lg:gap-2.5 max-lg:text-center">
        <span>&copy; 2026 Meridian Store. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="text-white/35 no-underline hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-white/35 no-underline hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
