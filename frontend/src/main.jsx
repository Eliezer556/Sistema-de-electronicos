import App from './App.jsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './features/auth/context/authContext.jsx'
import { ProductProvider } from './features/products/context/ProductContext.jsx'
import { WishlistProvider } from './features/wishlist/context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>,
)
