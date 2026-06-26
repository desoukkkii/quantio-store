# Meridian — Premium Store

A realistic e-commerce storefront built with **React**, **Vite**, and **Tailwind CSS**. Designed to look and feel like a production online store.

## Features

- **Announcement bar** with infinite marquee animation
- **Sticky header** with logo, navigation, search, wishlist, and cart
- **Hero banner** with animated visual, promotional CTA, and trust badges
- **Category cards** with product counts — click to filter
- **Promotional banner** — "Up to 40% Off" with dedicated sale view
- **Product grid** with lazy loading, badges (Sale / Best Seller / Low Stock), ratings, discount strikethrough
- **Load More** pagination (12 per page)
- **Sort** by price, name, rating, biggest discount
- **Search** (desktop + mobile search bar)
- **Quick view modal** with brand, SKU, stock, weight, discount %, description
- **Cart drawer** with quantity controls, subtotal, shipping note, checkout flow
- **Wishlist drawer** with add-to-cart and remove
- **Toast notifications** for all actions
- **Features strip** (shipping, returns, security, support)
- **Full footer** with links, newsletter signup, payment icons, social links
- **Mobile responsive** with hamburger menu and mobile search
- **localStorage** persistence for cart and wishlist

## Tech Stack

- **React** — Component-based UI
- **Vite** — Fast dev server and build tool
- **Tailwind CSS** — Utility-first styling
- **Font Awesome 6** — Icon library
- **DM Serif Display / Inter / DM Sans** — Typography

## Usage

```bash
npm install
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

Products load from [DummyJSON](https://dummyjson.com/products).

```
meridian-store/
├── index.html               # Vite entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg          # Brand favicon
├── src/
│   ├── main.jsx             # React entry
│   ├── index.css            # Tailwind imports + custom CSS
│   ├── App.jsx              # Root component
│   ├── context/
│   │   └── StoreContext.jsx  # Global state (cart, wishlist, products)
│   └── components/
│       ├── AnnouncementBar.jsx
│       ├── Header.jsx
│       ├── Hero.jsx
│       ├── Categories.jsx
│       ├── PromoBanner.jsx
│       ├── ProductGrid.jsx
│       ├── ProductCard.jsx
│       ├── FeaturesStrip.jsx
│       ├── Footer.jsx
│       ├── CartDrawer.jsx
│       ├── WishlistDrawer.jsx
│       ├── ProductModal.jsx
│       └── Toast.jsx
```

## License

MIT
