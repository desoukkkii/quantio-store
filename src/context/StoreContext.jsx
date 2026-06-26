import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const StoreContext = createContext()
const PAGE_SIZE = 12

const categoryIcons = {
  electronics: 'fa-microchip', fragrances: 'fa-spray-can-sparkles',
  groceries: 'fa-apple-whole', home: 'fa-house',
  furniture: 'fa-couch', clothing: 'fa-shirt',
  accessories: 'fa-clock', beauty: 'fa-wand-magic-sparkles',
  skincare: 'fa-hand-sparkles', sports: 'fa-bicycle',
  automotive: 'fa-car', vehicle: 'fa-car',
  tools: 'fa-screwdriver-wrench', books: 'fa-book',
  jewelry: 'fa-gem', food: 'fa-utensils',
  default: 'fa-tag',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem('meridian_' + key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, data) {
  try { localStorage.setItem('meridian_' + key, JSON.stringify(data)) } catch { }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [toasts, setToasts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortValue, setSortValue] = useState('default')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState(null)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  useEffect(() => {
    setCart(load('cart', []))
    setWishlist(load('wishlist', []))
  }, [])

  useEffect(() => { save('cart', cart) }, [cart])
  useEffect(() => { save('wishlist', wishlist) }, [wishlist])

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://dummyjson.com/products?limit=60')
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const data = await res.json()
        setProducts(data.products)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const applyFilters = useCallback(() => {
    const term = searchTerm.toLowerCase().trim()
    const cat = categoryFilter
    const sort = sortValue

    let result = products.filter(p => {
      const matchSearch = !term ||
        p.title.toLowerCase().includes(term) ||
        (p.brand || '').toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      const matchCat = cat === 'all' || p.category === cat
      return matchSearch && matchCat
    })

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break
      case 'discount': result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)); break
    }

    setFiltered(result)
    setDisplayCount(PAGE_SIZE)
  }, [products, searchTerm, categoryFilter, sortValue])

  useEffect(() => {
    if (products.length) applyFilters()
  }, [products, applyFilters])

  const addToast = (msg, icon = 'fa-circle-check', type = '') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, icon, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2900)
  }

  const addToCart = (id) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    setCart(prev => {
      const existing = prev.find(i => i.id === id)
      if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: p.id, title: p.title, price: p.price, image: p.thumbnail, qty: 1 }]
    })
    addToast(`Added to cart: ${p.title.slice(0, 36)}${p.title.length > 36 ? '…' : ''}`)
  }

  const updateQty = (id, delta) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === id)
      if (idx === -1) return prev
      if (prev[idx].qty + delta <= 0) return prev.filter(i => i.id !== id)
      return prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
    })
  }

  const removeFromCart = (id) => {
    const item = cart.find(i => i.id === id)
    setCart(prev => prev.filter(i => i.id !== id))
    if (item) addToast(`Removed: ${item.title.slice(0, 30)}…`, 'fa-trash-can')
  }

  const toggleWishlist = (id) => {
    const p = products.find(x => x.id === id)
    setWishlist(prev => {
      const idx = prev.indexOf(id)
      if (idx > -1) {
        if (p) addToast(`Removed: ${p.title.slice(0, 30)}`, 'fa-heart-crack')
        return prev.filter(x => x !== id)
      } else {
        if (p) addToast(`Saved: ${p.title.slice(0, 32)}`, 'fa-heart')
        return [...prev, id]
      }
    })
  }

  const handleCheckout = () => {
    if (!cart.length) { addToast('Your cart is empty', 'fa-bag-shopping', 'error'); return }
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const shipping = subtotal >= 50 ? 0 : 5.99
    const total = subtotal + shipping
    const msg = shipping === 0
      ? `Order placed! Total: $${total.toFixed(2)} — free shipping applied`
      : `Order placed! Total: $${total.toFixed(2)} (incl. $${shipping.toFixed(2)} shipping)`
    setCart([])
    setCartOpen(false)
    addToast(msg, 'fa-circle-check')
  }

  const showDiscounted = () => {
    setCategoryFilter('all')
    setSearchTerm('')
    setSortValue('discount')
  }

  const loadMore = () => setDisplayCount(prev => prev + PAGE_SIZE)

  const categories = [...new Set(products.map(p => p.category))]
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const shown = filtered.slice(0, displayCount)
  const hasMore = displayCount < filtered.length

  const catIcon = (cat) => {
    const key = Object.keys(categoryIcons).find(k => cat.toLowerCase().includes(k))
    return categoryIcons[key] || categoryIcons.default
  }

  const fmt = (n) => '$' + Number(n).toFixed(2)

  const getBadge = (p) => {
    if (p.discountPercentage > 20) return { text: `-${Math.round(p.discountPercentage)}%`, type: 'sale' }
    if (p.discountPercentage > 0) return { text: 'Sale', type: 'sale' }
    if (p.rating >= 4.8) return { text: 'Best Seller', type: 'bestseller' }
    if (p.stock > 0 && p.stock < 5) return { text: 'Low Stock', type: 'new' }
    return null
  }

  return (
    <StoreContext.Provider value={{
      products, filtered, cart, wishlist, toasts, loading, error,
      searchTerm, setSearchTerm, categoryFilter, setCategoryFilter,
      sortValue, setSortValue, displayCount, headerScrolled,
      cartOpen, setCartOpen, wishlistOpen, setWishlistOpen,
      modalProduct, setModalProduct,
      cartCount, shown, hasMore, categories,
      catIcon, fmt, getBadge,
      addToCart, updateQty, removeFromCart, toggleWishlist,
      handleCheckout, showDiscounted, loadMore, addToast,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
