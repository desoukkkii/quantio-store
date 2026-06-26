import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'

export default function ProductGrid() {
  const {
    loading, error, filtered, shown, hasMore, categories,
    categoryFilter, setCategoryFilter, sortValue, setSortValue,
    loadMore,
  } = useStore()

  if (loading) {
    return (
      <section className="max-w-content mx-auto px-7 max-[480px]:px-4 pb-[72px] max-lg:px-5 max-lg:pb-12" id="shop" aria-labelledby="shopHeading">
        <div className="flex flex-col items-center justify-center py-20 text-mist gap-4">
          <i className="fas fa-spinner fa-spin text-2xl text-teal" aria-hidden="true"></i>
          <span className="text-sm">Loading products…</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-content mx-auto px-7 max-[480px]:px-4 pb-[72px] max-lg:px-5 max-lg:pb-12" id="shop" aria-labelledby="shopHeading">
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface border border-border rounded-lg flex items-center justify-center text-[1.6rem] text-mist mx-auto mb-4">
            <i className="fas fa-triangle-exclamation" aria-hidden="true"></i>
          </div>
          <h3 className="text-base font-semibold text-ink mb-1.5">Something went wrong</h3>
          <p className="text-[0.85rem] text-slate">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-content mx-auto px-7 max-[480px]:px-4 pb-[72px] max-lg:px-5 max-lg:pb-12 max-lg:pt-12" id="shop" aria-labelledby="shopHeading">
      <div className="flex items-end justify-between mb-9 max-lg:flex-col max-lg:items-start max-lg:gap-3">
        <div>
          <div className="text-[0.68rem] font-bold uppercase tracking-[2px] text-gold mb-1">Catalog</div>
          <h2 id="shopHeading" className="font-display text-[clamp(1.5rem,3vw,2rem)] font-normal text-ink">All Products</h2>
        </div>
        <div className="flex gap-2.5 items-center max-lg:w-full">
          <div className="relative flex items-center max-lg:flex-1">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white text-ink border border-border-strong rounded-pill py-[9px] pl-[18px] pr-9 text-[0.82rem] font-body font-medium outline-none cursor-pointer transition-all duration-150 hover:border-ink focus:border-teal focus:shadow-[0_0_0_3px_rgba(15,118,110,0.12)] max-lg:w-full"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <i className="fas fa-chevron-down absolute right-3.5 pointer-events-none text-mist text-[0.65rem]" aria-hidden="true"></i>
          </div>
          <div className="relative flex items-center max-lg:flex-1">
            <select
              value={sortValue}
              onChange={e => setSortValue(e.target.value)}
              className="appearance-none bg-white text-ink border border-border-strong rounded-pill py-[9px] pl-[18px] pr-9 text-[0.82rem] font-body font-medium outline-none cursor-pointer transition-all duration-150 hover:border-ink focus:border-teal focus:shadow-[0_0_0_3px_rgba(15,118,110,0.12)] max-lg:w-full"
              aria-label="Sort products"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3.5 pointer-events-none text-mist text-[0.65rem]" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      {!filtered.length ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-surface border border-border rounded-lg flex items-center justify-center text-[1.6rem] text-mist mx-auto mb-4">
            <i className="fas fa-search" aria-hidden="true"></i>
          </div>
          <h3 className="text-base font-semibold text-ink mb-1.5">No products found</h3>
          <p className="text-[0.85rem] text-slate">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-[22px] max-lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-lg:gap-3.5 max-[480px]:grid-cols-2 max-[480px]:gap-2.5">
            {shown.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-3.5 mt-11">
            <span className="text-[0.8rem] text-mist order-first" aria-live="polite">Showing {shown.length} of {filtered.length} product{filtered.length !== 1 ? 's' : ''}</span>
            {hasMore && (
              <button onClick={loadMore} className="flex items-center gap-2 bg-white text-slate text-[0.85rem] font-semibold px-7 py-[11px] rounded-pill border-[1.5px] border-border-strong cursor-pointer transition-all duration-150 hover:bg-ink hover:text-white hover:border-ink hover:shadow-sm mx-auto" aria-label="Load more products">
                Load More <i className="fas fa-chevron-down" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
