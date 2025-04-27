import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loading from '../Loading/Loading';
import { CartContext } from '../../Context/CartContext';
import { useProductDetails, useRelatedProducts } from '../../Hooks/shared-queries';
import { WishListContext } from '../../Context/WishListContext';

export default function ProductDetails() {
  const [activeImage, setActiveImage] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const mainSliderRef = useRef(null);

  // Reset user interaction and restart slider after inactivity
  useEffect(() => {
    if (isUserInteracting) {
      const timer = setTimeout(() => {
        setIsUserInteracting(false);
        if (mainSliderRef.current) {
          mainSliderRef.current.slickPlay(); // Explicitly restart autoplay
        }
      }, 10000); // Reset after 10 seconds of inactivity
      return () => clearTimeout(timer);
    }
  }, [isUserInteracting]);

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    arrows: false,
    autoplay: true, // Always true; we'll control it manually with ref methods
    autoplaySpeed: 3000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    initialSlide: activeImage,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    afterChange: (current) => setActiveImage(current),
  };

  const relatedSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  let { id } = useParams();
  let { addProductToCart } = useContext(CartContext);
  let { WishlistButton } = useContext(WishListContext);

  const { data: product, isLoading: productLoading, isError: productError } = useProductDetails(id);
  const { data: relatedProducts, isLoading: relatedLoading } = useRelatedProducts(product?.category?._id, id);

  // Handle manual navigation between slides
  const goToSlide = (index) => {
    setActiveImage(index);
    setIsUserInteracting(true);
    if (mainSliderRef.current) {
      mainSliderRef.current.slickGoTo(index);
      mainSliderRef.current.slickPause(); // Pause autoplay on interaction
    }
  };

  // Handle arrow button clicks
  const handlePrev = () => {
    setIsUserInteracting(true);
    if (mainSliderRef.current) {
      mainSliderRef.current.slickPrev();
      mainSliderRef.current.slickPause();
    }
  };

  const handleNext = () => {
    setIsUserInteracting(true);
    if (mainSliderRef.current) {
      mainSliderRef.current.slickNext();
      mainSliderRef.current.slickPause();
    }
  };

  // Start autoplay when component mounts or product changes
  useEffect(() => {
    if (mainSliderRef.current && product?.images && !isUserInteracting) {
      mainSliderRef.current.slickPlay();
    }
  }, [product]);

  if (productLoading) return <Loading />;
  if (productError) return <div className="text-center py-12"><p className="text-red-500 text-xl">Error loading product details</p></div>;

  // Calculate review percentages (unchanged)
  const ratingsQuantity = product?.ratingsQuantity || 0;
  const actualRating = Math.round(product?.ratingsAverage || 0);
  let reviewDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  if (ratingsQuantity > 0) {
    switch (actualRating) {
      case 5:
        reviewDistribution = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };
        break;
      case 4:
        reviewDistribution = { 5: 35, 4: 45, 3: 15, 2: 3, 1: 2 };
        break;
      case 3:
        reviewDistribution = { 5: 15, 4: 25, 3: 40, 2: 15, 1: 5 };
        break;
      case 2:
        reviewDistribution = { 5: 5, 4: 15, 3: 20, 2: 45, 1: 15 };
        break;
      case 1:
        reviewDistribution = { 5: 2, 4: 3, 3: 10, 2: 25, 1: 60 };
        break;
      default:
        reviewDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }
  }

  const reviewPercentages = reviewDistribution;

  return (
    <div className="container mx-auto px-4 py-8 font-sans bg-gray-50">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/ourproduct" className="hover:text-green-600 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product?.title}</span>
      </nav>

      {/* Product Details Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Gallery with Sidebar */}
          <div className="flex flex-col gap-6 relative">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-6 relative">
              {/* Thumbnails Sidebar */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 no-scrollbar">
                {product?.images?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform ${
                      index === activeImage
                        ? 'border-2 border-green-500 scale-105 shadow-md'
                        : 'border border-gray-200 hover:border-green-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Main Image Slider */}
              <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative">
                  <Slider ref={mainSliderRef} {...mainSliderSettings}>
                    {product?.images?.map((image, index) => (
                      <div key={index} className="outline-none">
                        <div className="aspect-w-4 aspect-h-3 bg-white flex items-center justify-center p-4 min-h-[400px] lg:min-h-[450px]">
                          <img
                            src={image}
                            className="max-h-[450px] object-contain mx-auto hover:scale-105 transition-transform duration-500"
                            alt={`${product.title} - Image ${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>

                  {/* Image slider controls */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md z-10 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Auto-slide indicator */}
                  {!isUserInteracting && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs py-1 px-2 rounded-full flex items-center gap-1">
                      <span className="animate-pulse">●</span> Auto-sliding
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rating & Reviews Progress */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product?.ratingsAverage || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-800">{product?.ratingsAverage}</span>
                <span className="mx-2 h-4 w-px bg-gray-300"></span>
                <span className="text-sm text-gray-600 underline cursor-pointer hover:text-green-600 transition-colors">
                  {product?.ratingsQuantity || 0} reviews
                </span>
              </div>

              {/* Dynamic Reviews Progress Bar */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-12">{star} stars</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 flex-1">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${reviewPercentages[star]}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{reviewPercentages[star]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col p-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">{product?.category?.name}</span>
                {product?.brand && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">{product.brand.name}</span>
                )}
              </div>
              <div className="flex items-center gap-2 relative">
                <span className="text-xs text-gray-500">{product?.sold || 0} sold</span>
                <WishlistButton className="relative top-0 right-0" productId={product.id} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product?.title}</h1>

            {/* Price */}
            <div className="mb-6">
              {product?.priceAfterDiscount ? (
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">{product.priceAfterDiscount} EGP</span>
                  <span className="text-lg text-gray-500 line-through">{product.price} EGP</span>
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
                    {Math.round((product.price - product.priceAfterDiscount) / product.price * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">{product?.price} EGP</span>
              )}

              {/* Shipping & Availability Info */}
              <div className="flex flex-wrap gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  In Stock
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Free Shipping
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
              <div className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p>{product?.description}</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-auto flex flex-col md:flex-row gap-4">
              <button
                onClick={() => addProductToCart(product.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              <button className="flex-1 md:flex-none md:w-auto border border-gray-300 hover:border-gray-400 bg-white text-gray-800 font-medium py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center hover:shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts?.length > 0 && (
        <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-green-500 w-2 h-8 mr-3 rounded"></span>
          You May Also Like
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <Slider {...relatedSliderSettings} className="related-products-slider">
            {relatedProducts.map((relProduct) => (
              <div key={relProduct.id} className="px-3 py-2">
                <Link to={`/productdetails/${relProduct.id}`} className="block">
                  <div className="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 transform hover:shadow-lg hover:-translate-y-2 bg-white h-full flex flex-col">
                    <div className="relative group">
                      <div className="aspect-w-4 aspect-h-3 bg-gray-50">
                        <img src={relProduct.imageCover} className="w-full h-48 object-contain p-4" alt={relProduct.title} />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <span className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="mb-2 flex-grow">
                        <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-green-600 transition-colors">
                          {relProduct.title}
                        </h4>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          {relProduct.priceAfterDiscount ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{relProduct.priceAfterDiscount} EGP</span>
                              <span className="text-sm text-gray-500 line-through">{relProduct.price} EGP</span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-900">{relProduct.price} EGP</span>
                          )}
                        </div>
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600 ml-1">{relProduct.ratingsAverage}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      )}
    </div>
  );
}