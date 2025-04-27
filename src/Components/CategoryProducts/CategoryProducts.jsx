import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Loading from '../Loading/Loading';
import { CartContext } from '../../Context/CartContext';
import { WishListContext } from '../../Context/WishListContext';
import { useCategoriesProduct } from '../../Hooks/shared-queries';

export default function CategoryProducts() {
  const { addProductToCart } = useContext(CartContext);
  let { WishlistButton } = useContext(WishListContext);
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // Number of items per page

  // Function to fetch category products
  const { data: products, isLoading, isError, refetch } = useCategoriesProduct(categoryId);

  // Get current products for pagination
  const getCurrentProducts = () => {
    if (!products) return [];
    const startIndex = currentPage * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handle pagination page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  // Calculate page count
  const pageCount = products ? Math.ceil(products.length / itemsPerPage) : 0;

  // Get category name for display
  const categoryName = products?.[0]?.category?.name || 'Products';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
      {categoryName}</h1>
        {products && (
          <p className="text-gray-600">
            {products.length} products found
          </p>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-lg">Error loading products. Please try again later.</p>
          <button 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4 text-gray-400">
            <i className="fas fa-search fa-3x"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">We couldn't find any products in this category.</p>
          <button 
            onClick={() => navigate('/categories')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Product grid - Responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {getCurrentProducts().map((product) => (
              <div key={product._id} className="w-full transform transition duration-500 hover:scale-105">
                <div className="product h-full flex flex-col rounded-lg shadow-md bg-white relative overflow-hidden border border-gray-100">
                  {/* Sale badge if discounted */}
                  {product.priceAfterDiscount && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 z-10">
                      SALE
                    </span>
                  )}
                  
                  {/* Wishlist button */}
                  <div className="absolute top-2 right-2 z-10">
                    <WishlistButton productId={product._id} />
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

          {/* Pagination - Only show if more than one page */}
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={'flex gap-2 my-8 items-center flex-wrap'}
              previousClassName={'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'}
              nextClassName={'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'}
              pageClassName={'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'}
              activeClassName={'!bg-green-600 text-white'}
              disabledClassName={'opacity-50 cursor-not-allowed'}
            />
          )}
        </div>
      )}
    </div>
  );
}