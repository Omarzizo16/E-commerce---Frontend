import React, { useContext, useState } from 'react';
import { WishListContext } from '../../Context/WishListContext';
import { CartContext } from '../../Context/CartContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../Loading/Loading';

export default function WishList() {
  const { whishList, deleteProductFromWishList, WishlistButton } = useContext(WishListContext);
  const { addProductToCart } = useContext(CartContext);
  const [hoveringHeartId, setHoveringHeartId] = useState(null);

  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Remove from Wishlist?',
      text: 'You can add it again anytime!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductFromWishList(productId);
        Swal.fire('Removed!', 'Product removed from wishlist.', 'success');
      }
    });
  };

  // Calculate total value of all products in wishlist
  const calculateTotalValue = () => {
    if (!whishList?.data || whishList.data.length === 0) return 0;

    return whishList.data.reduce((total, product) => {
      // Use discounted price if available, otherwise use regular price
      const price = product.priceAfterDiscount || product.price;
      return total + price;
    }, 0);
  };

  // Custom Wishlist button with broken heart on hover
  const CustomWishlistButton = ({ productId }) => {
    const isHovering = hoveringHeartId === productId;

    return (
      <button
        className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-300"
        onClick={() => handleDelete(productId)}
        onMouseEnter={() => setHoveringHeartId(productId)}
        onMouseLeave={() => setHoveringHeartId(null)}
      >
        {isHovering ? (
          <i className="fas fa-heart-broken scale-125 text-red-500"></i>
        ) : (
          <i className="fas fa-heart text-red-500"></i>
        )}
      </button>
    );
  };

  return (
    <>
      {!whishList?.data ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Your Wishlist</h1>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <i className="fas fa-gift text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Saved Items</p>
                    <p className="font-bold text-lg">{whishList.data.length}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <i className="fas fa-tag text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="font-bold text-lg">{calculateTotalValue().toFixed(2)} EGP</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 border-b border-gray-200"></div>
          </div>

          {whishList.data.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <i className="far fa-heart text-gray-300 text-5xl mb-4"></i>
              <p className="text-center text-gray-500 text-lg">Your wishlist is empty.</p>
              <Link to="/products" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {whishList.data.map((product) => (
                <div key={product._id} className="w-full transform transition duration-500 hover:scale-105">
                  <div className="product h-full flex flex-col rounded-lg shadow-md bg-white relative overflow-hidden border border-gray-100">
                    {/* Sale badge if discounted */}
                    {product.priceAfterDiscount && (
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 z-10">
                        SALE
                      </span>
                    )}

                    {/* Custom Wishlist button with broken heart on hover */}
                    <div className="absolute top-2 right-2 z-10">
                      <CustomWishlistButton productId={product._id} />
                    </div>

                    {/* Product Image */}
                    <Link to={`/productdetails/${product._id}`} className="relative pt-4 px-4 flex-grow">
                      <div className="bg-gray-50 rounded-md flex items-center justify-center h-48 overflow-hidden">
                        <img
                          src={product.imageCover}
                          className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                          alt={product.title}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <Link to={`/productdetails/${product._id}`}>
                        <span className="text-green-600 text-sm font-medium mb-1 block">{product.category.name}</span>
                        <h3 className="font-bold text-gray-800 mb-1 h-12 overflow-hidden">
                          {product.title.length > 40 ? `${product.title.substring(0, 40)}...` : product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center mb-2">
                          <span className="text-yellow-500 flex items-center">
                            <i className="fas fa-star mr-1"></i>
                            <span className="font-medium">{product.ratingsAverage}</span>
                          </span>
                          <span className="text-xs text-gray-500 ml-1">({product.ratingsQuantity || 0} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center mb-3">
                          {product.priceAfterDiscount ?
                            <><span className="text-gray-800 font-bold text-lg">{product.priceAfterDiscount} EGP</span><span className="ml-2 text-sm text-gray-500 line-through">
                              {product.price} EGP
                            </span>
                              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {Math.round((product.price - product.priceAfterDiscount) / product.price * 100)}% OFF
                              </span>
                            </>
                            :
                            <span className="text-gray-800 font-bold text-lg">
                              {product.price} EGP
                            </span>
                          }
                        </div>
                      </Link>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addProductToCart(product._id)}
                        className="w-full mt-auto bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
                      >
                        <i className="fas fa-shopping-cart mr-2"></i> Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}