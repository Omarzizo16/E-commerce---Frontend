import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import Home from './Components/Home/Home.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import Cart from './Components/Cart/Cart.jsx'
import Categories from './Components/Categories/Categories.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'
import UserContextProvider from './Context/UserContext.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import ProductDetails from './Components/ProductDetails/ProductDetails.jsx'
import CartContextProvider from './Context/CartContext.jsx'
import { ToastContainer } from 'react-toastify'
import CheckOut from './Components/CheckOut/CheckOut.jsx'
import AllOrders from './Components/AllOrders/AllOrders.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AllBrands from './Components/AllBrands/AllBrands.jsx'
import Brands from './Components/Brands/Brands.jsx'
import CategoryProducts from './Components/CategoryProducts/CategoryProducts.jsx'
import WishListContextProvider from './Context/WishListContext.jsx'
import WishList from './Components/WishList/WishList.jsx'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword.jsx'
import Verifycode from './Components/Verifycode/Verifycode.jsx'
import ResetPassword from './Components/ResetPassword/ResetPassword.jsx'
import './App.css'
import OurProduct from './Components/OurProduct/OurProduct.jsx'
import ThemeContextProvider from './Context/ThemeContext.jsx'

const routers = createBrowserRouter([{
  path: '', element: <Layout />, children: [
    { index: true, element: <Home /> },
    // Home
    { path: 'https://omarzizo16.github.io/E-commerce---Frontend/', element: <Home /> },

    // Login
    { path: 'login', element: <Login /> },

    // Register
    { path: 'register', element: <Register /> },

    // Cart
    { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },

    // Wishlist
    { path: 'wishlist', element: <ProtectedRoute><WishList /></ProtectedRoute> },

    // Checkout
    { path: 'checkout', element: <CheckOut /> },

    // Order
    { path: 'allorders', element: <AllOrders /> },

    // OurProduct
    { path: 'ourproduct', element: <OurProduct /> },

    // Brands
    { path: 'brands', element: <AllBrands /> },
    { path: 'brands/:id', element: <Brands /> },

    // Categories
    { path: 'categories', element: <Categories /> },
    { path: 'categories/:id', element: <CategoryProducts /> },

    // Product details
    { path: 'productdetails/:id', element: <ProductDetails /> },

    {path: 'forgetPassword' , element: <ForgetPassword/>},
    {path: 'verifycode' , element: <Verifycode/>},
    {path: 'resetPassword' , element: <ResetPassword/>},

    // Notfound page
    { path: '*', element: <NotFound /> },
  ]
}])

// Query
const query = new QueryClient();

function App() {
  return <>
  <ThemeContextProvider>

    {/* QueryProvider */}
    <QueryClientProvider client={query}>
      
      {/* UserProvider */}
      <UserContextProvider>

        {/* CartProvider */}
        <CartContextProvider>

          {/* WishlistProvider */}
          <WishListContextProvider>


            <RouterProvider router={routers}></RouterProvider>

            {/* QueryTools */}
            <ReactQueryDevtools />

            {/* Toaster */}
            <ToastContainer />

          </WishListContextProvider>
        </CartContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </ThemeContextProvider>
  </>
}

export default App
