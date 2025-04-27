import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Loading from '../Loading/Loading';
import { CartContext } from '../../Context/CartContext';
import { WishListContext } from '../../Context/WishListContext';
import { useProducts } from '../../Hooks/shared-queries';

export default function RecentProducts() {
  // State variables
  const [pageCount, setPageCount] = useState(0); // Total number of pages
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const itemsPerPage = 10; // Number of items per page

  // Get context values
  let { addProductToCart } = useContext(CartContext);
  let { WishlistButton } = useContext(WishListContext);

  // Use shared query for products
  const { data: products, isLoading } = useProducts();

  // Calculate page count when products data is available
  useEffect(() => {
    if (products) {
      setPageCount(Math.ceil(products.length / itemsPerPage));
    }
  }, [products]);

  // Function to get current products for pagination
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

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center mt-10">
          {/* Product grid - Responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getCurrentProducts().map((product) => (
              <div key={product.id} className="w-full transform transition duration-500 hover:scale-105">
                <div className="product h-full flex flex-col rounded-lg shadow-md bg-white relative overflow-hidden border border-gray-100">
                  {/* Sale badge if discounted */}
                  {product.priceAfterDiscount && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 z-10">
                      SALE
                    </span>
                  )}

                  {/* Wishlist button */}
                  <div className="absolute top-2 right-2 z-10">
                    <WishlistButton productId={product.id} />
                  </div>

                  {/* Product Image */}
                  <Link to={`/productdetails/${product.id}`} className="relative pt-4 px-4 flex-grow">
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
                    <Link to={`/productdetails/${product.id}`}>
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
                        <span className="text-xs text-gray-500 ml-1">({product.ratingsQuantity} reviews)</span>
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
                      onClick={() => addProductToCart(product.id)}
                      className="w-full mt-auto bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i> Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Responsive */}
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={'flex gap-2 my-4 items-center flex-wrap'}
            previousClassName={'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'}
            nextClassName={'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'}
            pageClassName={'px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition'}
            activeClassName={'!bg-green-600 text-white'}
            disabledClassName={'opacity-50 cursor-not-allowed'}
          />
        </div>
      )}
    </>
  );
}
