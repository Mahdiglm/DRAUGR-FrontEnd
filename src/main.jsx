import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'

// Components
import ErrorBoundary from './components/shared/ErrorBoundary'

// Layouts
import MainLayout from './components/layout/MainLayout'

// Pages
import HomePage from './components/pages/HomePage'
import ProductDetail from './components/product/ProductDetail'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
)
