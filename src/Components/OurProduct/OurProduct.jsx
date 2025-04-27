import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories, useBrands } from '../../Hooks/shared-queries';
import ReactPaginate from 'react-paginate';
import Loading from '../Loading/Loading';
import { CartContext } from '../../Context/CartContext';
import { WishListContext } from '../../Context/WishListContext';

export default function RecentProducts() {
  // State variables
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // Increased items per page for better grid layout
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [currentPriceRange, setCurrentPriceRange] = useState([0, 50000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get context values
  let { addProductToCart } = useContext(CartContext);
  let { WishlistButton } = useContext(WishListContext);

  // Use shared queries
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  // Set price range and initial filtered products when products data is available
  useEffect(() => {
    if (productsData) {
      const maxPrice = Math.max(...productsData.map(product => product.price));
      setPriceRange([0, maxPrice]);
      setCurrentPriceRange([0, maxPrice]);
      setFilteredProducts(productsData);
      setPageCount(Math.ceil(productsData.length / itemsPerPage));
    }
  }, [productsData]);

  // Apply filters when filter criteria change
  useEffect(() => {
    if (productsData) {
      applyFilters();
    }
  }, [selectedCategories, selectedBrands, selectedRating, currentPriceRange, productsData]);

  // Apply all filters
  const applyFilters = () => {
    if (!productsData) return;

    let result = [...productsData];

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category.name)
      );
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter(product =>
        product.brand && selectedBrands.includes(product.brand.name)
      );
    }

    // Filter by rating
    if (selectedRating > 0) {
      result = result.filter(product =>
        product.ratingsAverage >= selectedRating
      );
    }

    // Filter by price range
    result = result.filter(product =>
      product.price >= currentPriceRange[0] &&
      product.price <= currentPriceRange[1]
    );

    setFilteredProducts(result);
    setPageCount(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(0); // Reset to first page
  };

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newRange = [...currentPriceRange];
    newRange[index] = parseInt(e.target.value);
    setCurrentPriceRange(newRange);
  };

  // Toggle category selection
  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(cat => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  // Toggle brand selection
  const toggleBrand = (brandName) => {
    setSelectedBrands(prev => {
      if (prev.includes(brandName)) {
        return prev.filter(brand => brand !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
  };

  // Function to get current products for pagination
  const getCurrentProducts = () => {
    const startIndex = currentPage * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handle pagination page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top on page change
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRating(0);
    setCurrentPriceRange(priceRange);
  };

  // Create star rating display component
  const RatingStars = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fas fa-star text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <>
      {productsLoading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header with title and mobile filter toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Discover Products
            </h1>

            <div className="flex gap-4 items-center">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="font-medium text-gray-700">{filteredProducts.length}</span>
                <span className="text-gray-500 ml-1">products found</span>
              </div>

              <button
                className="md:hidden bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-sliders-h'}`}></i>
                <span>{isSidebarOpen ? 'Hide' : 'Filters'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile overlay for filters */}
            {isSidebarOpen && (
              <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Sidebar for filters - slide in from left on mobile */}
            <div className={`md:w-1/4 fixed md:static top-0 left-0 bottom-0 z-50 md:z-auto bg-white md:rounded-2xl shadow-lg md:shadow-md p-6 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} w-4/5 md:w-1/4 md:max-w-xs`}>
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Filters</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={resetFilters}
                      className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                    >
                      <i className="fas fa-redo-alt text-xs"></i> Reset
                    </button>
                    <button 
                      className="md:hidden" 
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
                    </button>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-200 my-4"></div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-tags text-green-500"></i> Price Range
                  </h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">{currentPriceRange[0]} EGP</span>
                    <span className="font-medium">{currentPriceRange[1]} EGP</span>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={currentPriceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={currentPriceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-star text-yellow-400"></i> Rating
                  </h3>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className={`flex items-center mb-2 p-2 rounded-lg cursor-pointer transition-all ${selectedRating === rating ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedRating(rating === selectedRating ? 0 : rating)}
                    >
                      <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${selectedRating === rating ? 'bg-green-500' : 'border border-gray-300'}`}>
                        {selectedRating === rating && (
                          <i className="fas fa-check text-white text-xs"></i>
                        )}
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <RatingStars rating={rating} />
                        <span className="ml-2 text-sm text-gray-600">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Categories Filter */}
                <div className="mb-8">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-th-large text-green-500"></i> Categories
                  </h3>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                    {categoriesData && categoriesData.map((category) => (
                      <div
                        key={category._id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${selectedCategories.includes(category.name) ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleCategory(category.name)}
                      >
                        <div className={`w-4 h-4 rounded-md mr-3 flex items-center justify-center ${selectedCategories.includes(category.name) ? 'bg-green-500' : 'border border-gray-300'}`}>
                          {selectedCategories.includes(category.name) && (
                            <i className="fas fa-check text-white text-xs"></i>
                          )}
                        </div>
                        <label className="text-sm text-gray-700 cursor-pointer flex-1">
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands Filter */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-building text-green-500"></i> Brands
                  </h3>
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-1">
                    {brandsData && brandsData.map((brand) => (
                      <div
                        key={brand._id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${selectedBrands.includes(brand.name) ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleBrand(brand.name)}
                      >
                        <div className={`w-4 h-4 rounded-md mr-3 flex items-center justify-center ${selectedBrands.includes(brand.name) ? 'bg-green-500' : 'border border-gray-300'}`}>
                          {selectedBrands.includes(brand.name) && (
                            <i className="fas fa-check text-white text-xs"></i>
                          )}
                        </div>
                        <label className="text-sm text-gray-700 cursor-pointer flex-1">
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1">
              {/* Show "No products found" if filters return empty */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <div className="text-6xl text-gray-200 mb-4">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filter criteria</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300 shadow-sm flex items-center gap-2 mx-auto"
                  >
                    <i className="fas fa-redo-alt"></i> Reset Filters
                  </button>
                </div>
              ) : (
                /* Product grid - Responsive layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentProducts().map((product) => (
                    <div key={product.id} className="group w-full transition-all duration-300 hover:-translate-y-1">
                      <div className="h-full flex flex-col rounded-2xl shadow-sm hover:shadow-md bg-white overflow-hidden relative border border-gray-100">
                        {/* Sale badge if discounted */}
                        {product.priceAfterDiscount && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                              SALE
                            </span>
                          </div>
                        )}

                        {/* Wishlist button */}
                        <div className="absolute top-4 right-4 z-10 transition-transform group-hover:scale-110">
                          <WishlistButton productId={product.id} />
                        </div>

                        {/* Product Image */}
                        <Link to={`/productdetails/${product.id}`} className="relative pt-6 px-6">
                          <div className="bg-gray-50 rounded-xl flex items-center justify-center h-52 overflow-hidden">
                            <img
                              src={product.imageCover}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                              alt={product.title}
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="p-6 flex flex-col flex-grow">
                          <Link to={`/productdetails/${product.id}`} className="flex flex-col h-full">
                            <span className="inline-block text-green-600 text-xs font-medium px-2.5 py-1 rounded-md bg-green-50 mb-2 self-start">
                              {product.category.name}
                            </span>
                            
                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 h-14">
                              {product.title}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center mb-3">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fas fa-star ${i < Math.floor(product.ratingsAverage) ? '' : 'text-gray-200'}`}></i>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-2">
                                ({product.ratingsQuantity || 0})
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center mb-4 mt-auto">
                              {product.priceAfterDiscount ? (
                                <>
                                  <span className="text-gray-800 font-bold text-xl">
                                    {product.priceAfterDiscount} EGP
                                  </span>
                                  <span className="ml-2 text-sm text-gray-400 line-through">
                                    {product.price} EGP
                                  </span>
                                  <span className="ml-2 bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
                                    {Math.round((product.price - product.priceAfterDiscount) / product.price * 100)}% OFF
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-800 font-bold text-xl">
                                  {product.price} EGP
                                </span>
                              )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={(e) => { 
                                e.preventDefault();
                                addProductToCart(product.id);
                              }}
                              className="w-full mt-auto bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
                            >
                              <i className="fas fa-shopping-cart mr-2"></i> Add To Cart
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination - Modern Design */}
              {filteredProducts.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <ReactPaginate
                    previousLabel={<i className="fas fa-chevron-left"></i>}
                    nextLabel={<i className="fas fa-chevron-right"></i>}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={'flex items-center gap-2'}
                    previousClassName={'w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors'}
                    nextClassName={'w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors'}
                    pageClassName={'w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium'}
                    breakClassName={'px-2 text-gray-400'}
                    activeClassName={'!bg-green-600 !border-green-600 text-white shadow-sm'}
                    disabledClassName={'opacity-50 cursor-not-allowed'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}