import { useState, useRef, useEffect } from 'react'
import { useStore } from '../context/StoreContext'

export default function Header() {
  const {
    searchTerm, setSearchTerm, categoryFilter, setCategoryFilter,
    sortValue, setSortValue, headerScrolled,
    cartCount, wishlist, setCartOpen, setWishlistOpen,
  } = useStore()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 300)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!mobileNavOpen) return
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target) && !e.target.closest('#mobileMenuBtn')) {
        setMobileNavOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [mobileNavOpen])

  return (
    <header
      className={`sticky top-0 z-[100] bg-white/92 backdrop-blur-md border-b border-border transition-all duration-250 ${headerScrolled ? 'shadow-md' : ''}`}
    >
      <div className="max-w-content mx-auto px-7 max-[480px]:px-4 flex items-center justify-between h-[68px] max-[480px]:h-[60px] gap-6">
        <button
          className="lg:hidden bg-none border-none text-lg text-ink p-1 rounded-sm"
          id="mobileMenuBtn"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileNavOpen}
        >
          <i className="fas fa-bars" aria-hidden="true"></i>
        </button>

        <a href="#" className="font-display text-[1.45rem] max-[480px]:text-[1.2rem] font-normal text-ink no-underline tracking-[3px] shrink-0 flex items-center gap-2">
          <span className="text-gold text-[0.8em] animate-pulse-star" aria-hidden="true">✦</span>
          MERIDIAN
        </a>

        <nav
          ref={navRef}
          className={`lg:flex max-lg:fixed max-lg:top-0 max-lg:z-[300] max-lg:h-full max-lg:bg-white max-lg:shadow-xl max-lg:border-r max-lg:border-border max-lg:transition-transform max-lg:duration-[0.4s] max-lg:ease-[cubic-bezier(0.22,1,0.36,1)] max-lg:w-[280px] max-lg:p-6 ${mobileNavOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <button
            className="lg:hidden flex items-center justify-center bg-surface border border-border rounded-sm w-9 h-9 text-base text-ink cursor-pointer mb-6 hover:bg-border transition-colors"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-xmark" aria-hidden="true"></i>
          </button>
          <ul className="flex max-lg:flex-col max-lg:gap-0.5" role="list">
            {['Home', 'Shop', 'New Arrivals', 'Sale', 'Brands'].map((item) => (
              <li key={item}>
                <a
                  href={item === 'Shop' ? '#shop' : item === 'Sale' ? '#deals' : '#'}
                  className={`relative block px-3.5 py-2 text-sm font-medium rounded-sm transition-colors duration-150 nav-underline ${item === 'Home' ? 'active text-ink bg-surface' : 'text-slate hover:text-ink hover:bg-surface'}`}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-1">
          <button
            className="relative bg-none border-none rounded-pill w-[42px] h-[42px] flex items-center justify-center text-slate text-base transition-colors duration-150 hover:bg-surface hover:text-ink"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <i className="fas fa-search" aria-hidden="true"></i>
          </button>
          <button
            className="relative bg-none border-none rounded-pill w-[42px] h-[42px] flex items-center justify-center text-slate text-base transition-colors duration-150 hover:bg-surface hover:text-ink"
            onClick={() => { setWishlistOpen(true); setCartOpen(false) }}
            aria-label="Open wishlist"
          >
            <i className="fas fa-heart" aria-hidden="true"></i>
            <span className="absolute top-1 right-1 bg-ink text-white text-[0.58rem] font-bold min-w-[16px] h-4 rounded-pill flex items-center justify-center px-0.5 border-2 border-white transition-transform duration-150" aria-live="polite">{wishlist.length}</span>
          </button>
          <button
            className="relative bg-none border-none rounded-pill w-[42px] h-[42px] flex items-center justify-center text-slate text-base transition-colors duration-150 hover:bg-surface hover:text-ink hover:text-gold"
            onClick={() => { setCartOpen(true); setWishlistOpen(false) }}
            aria-label="Open cart"
          >
            <i className="fas fa-bag-shopping" aria-hidden="true"></i>
            <span className="absolute top-1 right-1 bg-ink text-white text-[0.58rem] font-bold min-w-[16px] h-4 rounded-pill flex items-center justify-center px-0.5 border-2 border-white transition-transform duration-150" aria-live="polite">{cartCount}</span>
          </button>
        </div>
      </div>

      <div
        className={`border-t border-border bg-white overflow-hidden transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] ${searchOpen ? 'max-h-20 py-2.5' : 'max-h-0'}`}
        role="search"
        aria-hidden={!searchOpen}
      >
        <div className="max-w-content mx-auto px-7 flex items-center gap-3 bg-surface rounded-pill border border-border">
          <i className="fas fa-search text-mist text-[0.9rem]" aria-hidden="true"></i>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search products, categories, brands…"
            className="flex-1 border-none bg-transparent py-2.5 text-[0.9rem] text-ink outline-none placeholder:text-mist"
            aria-label="Search products"
          />
          <button
            onClick={() => { setSearchOpen(false); setSearchTerm('') }}
            className="bg-none border-none text-slate text-base p-1.5 rounded-sm hover:text-ink transition-colors"
            aria-label="Close search"
          >
            <i className="fas fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </header>
  )
}
