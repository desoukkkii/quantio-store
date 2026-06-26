import { StoreProvider } from './context/StoreContext'
import AnnouncementBar from './components/AnnouncementBar'
import Header from './components/Header'
import Hero from './components/Hero'
import Categories from './components/Categories'
import PromoBanner from './components/PromoBanner'
import ProductGrid from './components/ProductGrid'
import FeaturesStrip from './components/FeaturesStrip'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WishlistDrawer from './components/WishlistDrawer'
import ProductModal from './components/ProductModal'
import ToastContainer from './components/Toast'

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-white text-ink font-body">
        <AnnouncementBar />
        <Header />
        <main>
          <Hero />
          <Categories />
          <PromoBanner />
          <ProductGrid />
        </main>
        <FeaturesStrip />
        <Footer />
        <CartDrawer />
        <WishlistDrawer />
        <ProductModal />
        <ToastContainer />
      </div>
    </StoreProvider>
  )
}
