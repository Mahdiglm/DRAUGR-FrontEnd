import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'
import './flowbite-overrides.css'

// Set default scroll behavior for the entire application
document.documentElement.style.scrollBehavior = 'smooth';

// Ensure pages load at the top by default
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
}

// Add this to ensure the body has proper background color
if (typeof document !== 'undefined') {
  document.body.classList.add('theme-draugr');
  document.body.classList.add('dark');
  document.body.style.backgroundColor = '#121212';
  // Force apply critical styles directly
  document.body.style.color = 'rgba(255, 255, 255, 0.9)';
  document.body.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='40' height='40' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Crect width='100%25' height='100%25' fill='%23121212'/%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ff0000' fill-opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E\")";
}

// Components
import ErrorBoundary from './components/shared/ErrorBoundary'
import FlowbiteTest from './components/shared/FlowbiteTest'

// Layouts
import MainLayout from './components/layout/MainLayout'

// Pages
import HomePage from './components/pages/HomePage'
import ShopPage from './components/pages/ShopPage'
import CheckoutPage from './components/pages/CheckoutPage'
import ProductDetail from './components/product/ProductDetail'
import AboutPage from './components/pages/AboutPage'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'
import BlogPage from './components/pages/BlogPage';
import SingleBlogPostPage from './components/pages/SingleBlogPostPage';
import SpecialOffersPage from './components/pages/SpecialOffersPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<SingleBlogPostPage />} />
            <Route path="special-offers" element={<SpecialOffersPage />} />
            <Route path="special-offers/:id" element={<SpecialOffersPage />} />
            <Route path="flowbite-test" element={<FlowbiteTest />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
)
