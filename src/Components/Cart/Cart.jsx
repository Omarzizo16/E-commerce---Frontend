import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../Context/CartContext';
import Loading from '../Loading/Loading';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cart() {
  let { cart, updateProductCountToCart, deleteProductFromCart, clearCart } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Check if user has used the coupon before
  useEffect(() => {
    // Check localStorage for used coupons
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || {};
    const userId = localStorage.getItem('userId') || 'guest'; // Get user ID or use 'guest' for non-logged in users
    
    // If user has active coupon in localStorage, restore it
    const activeCoupon = localStorage.getItem(`activeCoupon_${userId}`);
    if (activeCoupon) {
      const couponData = JSON.parse(activeCoupon);
      setAppliedCoupon(couponData.code);
      setDiscount(couponData.discountPercent);
    }
  }, []);

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Swal.fire('Error', 'Please enter a coupon code', 'error');
      return;
    }
    
    setIsApplyingCoupon(true);
    
    // Get user ID from localStorage or use 'guest' for non-logged in users
    const userId = localStorage.getItem('userId') || 'guest';
    
    // Check if user has used this coupon before
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || {};
    const userCoupons = usedCoupons[userId] || [];
    
    setTimeout(() => {
      setIsApplyingCoupon(false);
      
      // Validate coupon code
      if (couponCode.toLowerCase() === 'welcome10') {
        // Check if user has used this coupon before
        if (userCoupons.includes('welcome10')) {
          Swal.fire('Already Used', 'You have already used this coupon code before.', 'warning');
        } else {
          // Apply the coupon
          setAppliedCoupon('welcome10');
          setDiscount(10); // 10% discount
          
          // Save to localStorage that user has used this coupon
          userCoupons.push('welcome10');
          usedCoupons[userId] = userCoupons;
          localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));
          
          // Save active coupon for this user
          localStorage.setItem(`activeCoupon_${userId}`, JSON.stringify({
            code: 'welcome10',
            discountPercent: 10
          }));
          
          Swal.fire('Success', 'Coupon applied successfully! 10% discount added.', 'success');
        }
      } else {
        Swal.fire('Invalid Coupon', 'The coupon code you entered is invalid or expired.', 'error');
      }
    }, 800);
  };

  // Handle removing coupon
  const handleRemoveCoupon = () => {
    const userId = localStorage.getItem('userId') || 'guest';
    
    setAppliedCoupon(null);
    setDiscount(0);
    localStorage.removeItem(`activeCoupon_${userId}`);
    
    Swal.fire('Removed', 'Coupon has been removed', 'success');
  };

  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Remove from Cart?',
      text: 'Are you sure you want to remove this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductFromCart(productId);
        Swal.fire('Removed!', 'Product removed from cart.', 'success');
      }
    });
  };

  // Calculate order summary
  const calculateSummary = () => {
    if (!cart || !cart.data) return { subtotal: 0, shipping: 0, discountAmount: 0, total: 0 };
    
    const subtotal = cart.data.totalCartPrice || 0;
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 EGP
    
    let discountAmount = 0;
    if (appliedCoupon && discount > 0) {
      discountAmount = (subtotal * discount) / 100;
    }
    
    const total = subtotal + shipping - discountAmount;
    
    return { subtotal, shipping, discountAmount, total };
  };

  const { subtotal, shipping, discountAmount, total } = calculateSummary();

  // Product count container animation
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  // Empty cart animation
  const emptyCartVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Handle cart clearing
  const handleClearCart = () => {
    Swal.fire({
      title: 'Clear Cart',
      text: 'Are you sure you want to remove all items?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear cart'
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement clear cart functionality here
        clearCart();
        
        // Also remove applied coupon when cart is cleared
        if (appliedCoupon) {
          handleRemoveCoupon();
        }
        
        Swal.fire('Cleared!', 'Your cart has been cleared.', 'success');
      }
    });
  };

  return (
    <>
      {!cart ? (
        <Loading />
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl text-center md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent p-5">
              Your Shopping Cart</h1>

            {!cart.data || !cart.data.products || cart.data.products.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                variants={emptyCartVariants}
                initial="initial"
                animate="animate"
              >
                <div className="mb-6">
                  <i className="fas fa-shopping-cart text-gray-300 text-6xl"></i>
                </div>
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
                <Link 
                  to="/products" 
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="w-full lg:w-2/3">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-semibold">Cart Items ({cart.data.products.length})</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {cart.data.products.map((item, index) => (
                        <motion.div 
                          key={index} 
                          className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {/* Product Image & Info */}
                          <Link to={`/productdetails/${item.product.id}`} className="flex flex-1 items-center space-x-4">
                            <div className="relative">
                              <img 
                                src={item.product.imageCover} 
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg" 
                                alt={item.product.title} 
                              />
                              {item.product.discount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  -{item.product.discount}%
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.product.title}</h3>
                              <div className="flex items-center mt-1">
                                <p className="text-gray-600 text-sm">{item.price} EGP</p>
                                {item.product.originalPrice && (
                                  <p className="text-gray-400 text-xs line-through ml-2">{item.product.originalPrice} EGP</p>
                                )}
                              </div>
                              {item.product.brand && (
                                <p className="text-gray-500 text-xs mt-1">Brand: {item.product.brand?.name || 'Unknown'}</p>
                              )}
                            </div>
                          </Link>

                          {/* Quantity Controls & Delete */}
                          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                disabled={item.count <= 1}
                                onClick={() => updateProductCountToCart(item.product.id, item.count - 1)}
                                className={`w-8 h-8 flex items-center justify-center text-gray-600 ${
                                  item.count <= 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                              >
                                <i className="fas fa-minus text-xs"></i>
                              </motion.button>

                              <span className="w-10 text-center font-medium text-gray-800">{item.count}</span>

                              <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => updateProductCountToCart(item.product.id, item.count + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                              >
                                <i className="fas fa-plus text-xs"></i>
                              </motion.button>
                            </div>

                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => handleDelete(item.product.id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove item"
                            >
                              <i className="fas fa-trash"></i>
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                    <Link 
                      to="/ourproduct" 
                      className="flex items-center justify-center text-indigo-600 font-medium hover:text-indigo-800 transition"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Continue Shopping
                    </Link>
                    
                    <button 
                      onClick={handleClearCart}
                      className="flex items-center justify-center text-red-500 font-medium hover:text-red-700 transition"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{subtotal} EGP</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `${shipping} EGP`}</span>
                      </div>
                      {shipping === 0 && (
                        <div className="flex justify-between text-green-600 text-sm font-medium bg-green-50 p-2 rounded">
                          <span>Free Shipping Applied</span>
                          <span>-50 EGP</span>
                        </div>
                      )}
                      
                      {/* Show discount when coupon is applied */}
                      {appliedCoupon && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex justify-between text-green-600 text-sm font-medium bg-green-50 p-2 rounded"
                        >
                          <div className="flex items-center">
                            <span>Coupon Applied ({appliedCoupon.toUpperCase()})</span>
                            <button 
                              onClick={handleRemoveCoupon}
                              className="ml-2 text-gray-500 hover:text-red-500"
                              aria-label="Remove coupon"
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          </div>
                          <span>-{discountAmount.toFixed(2)} EGP</span>
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mb-6">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{total.toFixed(2)} EGP</span>
                      </div>
                    </div>
                    
                    {/* Coupon Code - Only show if no coupon is applied */}
                    {!appliedCoupon && (
                      <div className="mb-6">
                        <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                          Apply Coupon
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            id="coupon"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                          >
                            {isApplyingCoupon ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              'Apply'
                            )}
                          </motion.button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Try "WELCOME10" for 10% off your first order</p>
                      </div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        to="/checkout" 
                        className="w-full mt-auto bg-green-600 text-white py-2 rounded-md hover:text-white hover:scale-105 transition duration-300 flex items-center justify-center"
                      >
                        Proceed to Checkout
                      </Link>
                    </motion.div>
                    
                    {/* Payment methods */}
                    <div className="mt-6">
                      <p className="text-sm text-gray-500 mb-2 text-center">Secure Payment Methods</p>
                      <div className="flex justify-center space-x-3">
                        <i className="fab fa-cc-visa text-blue-800 text-2xl"></i>
                        <i className="fab fa-cc-mastercard text-red-600 text-2xl"></i>
                        <i className="fab fa-cc-paypal text-blue-600 text-2xl"></i>
                        <i className="fas fa-money-bill-wave text-green-600 text-2xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}