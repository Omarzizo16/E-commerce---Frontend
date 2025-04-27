import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loading from '../Loading/Loading';
import { Link } from 'react-router-dom';

export default function AllOrders() {
  const [expandedOrder, setExpandedOrder] = useState(null);

  function getAllOrders() {
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    return axios.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${decoded.id}`);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderOfProducts'],
    queryFn: getAllOrders,
  });

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate order total
  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.count), 0);
  };

  if (isLoading) return <Loading />;
  
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-md p-8">
        <div className="text-5xl text-red-400 mb-4">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">Error Loading Orders</h3>
        <p className="text-gray-500 mb-6">We couldn't load your order history. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
        >
          <i className="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-md p-8">
        <div className="text-6xl text-gray-200 mb-4">
          <i className="fas fa-shopping-bag"></i>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Orders Found</h3>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <Link 
          to="/products" 
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 flex items-center gap-2"
        >
          <i className="fas fa-shopping-cart"></i> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
        Your Order History
      </h2>
      
      <div className="space-y-6">
        {data.data.map((order, index) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            {/* Order Header */}
            <div 
              className="flex flex-wrap items-center justify-between p-4 md:p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleOrderExpansion(order._id)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-medium py-1 px-2 rounded-full bg-green-100 text-green-800">
                    Order #{order._id.slice(-6)}
                  </span>
                  {order.isDelivered ? (
                    <span className="text-xs md:text-sm font-medium py-1 px-2 rounded-full bg-green-100 text-green-700">
                      Delivered
                    </span>
                  ) : (
                    <span className="text-xs md:text-sm font-medium py-1 px-2 rounded-full bg-yellow-100 text-yellow-700">
                      In Progress
                    </span>
                  )}
                </div>
                
                <span className="text-sm text-gray-500">
                  {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <div className="font-medium text-green-500">
                  ${calculateOrderTotal(order.cartItems).toFixed(2)}
                </div>
                
                <div className={`text-gray-400 transition-transform duration-300 ${expandedOrder === order._id ? 'rotate-180' : ''}`}>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
            
            {/* Order Details - Expanded View */}
            {expandedOrder === order._id && (
              <div className="overflow-x-auto">
                <div className="p-4 md:p-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h4>
                      <p className="text-gray-700">
                        {order.shippingAddress?.details || 'N/A'}, {order.shippingAddress?.city || ''}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
                      <div className="flex items-center">
                        <i className="fas fa-credit-card text-gray-400 mr-2"></i>
                        <span className="text-gray-700 capitalize">{order.paymentMethodType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-700 mb-3">Items in this order</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.cartItems.map((item) => (
                      <Link 
                        to={`/productdetails/${item.product.id}`} 
                        key={item._id}
                        className="flex bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <div className="w-24 h-24 flex-shrink-0 bg-white">
                          <img
                            src={item.product.imageCover}
                            alt={item.product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <div className="flex-1 p-3 overflow-hidden">
                          <h5 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                            {item.product.title}
                          </h5>
                          
                          <div className="flex justify-between items-center mt-auto">
                            <div className="text-xs text-gray-500">
                              Qty: {item.count}
                            </div>
                            <div className="font-medium text-green-500">
                              ${(item.price * item.count).toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star text-xs ${i < Math.floor(item.product.ratingsAverage) ? '' : 'text-gray-200'}`}></i>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.product.ratingsQuantity || 0})
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}