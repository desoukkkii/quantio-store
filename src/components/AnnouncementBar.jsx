export default function AnnouncementBar() {
  const items = [
    'Free shipping on orders over $50',
    '30-day easy returns',
    'Pay in 4 with Afterpay',
  ]
  return (
    <div className="bg-ink text-white/85 text-[0.72rem] font-medium tracking-[0.4px] overflow-hidden h-[34px] flex items-center" role="banner">
      <div className="flex items-center gap-5 whitespace-nowrap animate-marquee will-change-transform">
        {[...Array(2)].map((_, outer) =>
          items.map((item, i) => (
            <span key={`${outer}-${i}`} className="flex items-center gap-5">
              <span>{item}</span>
              {i < items.length - 1 && (
                <span className="opacity-30 text-[0.6rem]" aria-hidden="true">·</span>
              )}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
