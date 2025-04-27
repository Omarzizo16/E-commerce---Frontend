import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useBrands } from '../../Hooks/shared-queries';

export default function AllBrands() {
  // State for search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Using custom hook to fetch brands
  const { data: brands, isLoading, isError, refetch } = useBrands();

  // Filter brands based on search term
  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Shop By Brand</h1>
        <p className="text-gray-600 mb-6">Discover products from your favorite brands</p>

        {/* Search Box */}
        <div className="max-w-md mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search brands..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 text-gray-500">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-lg">Error loading brands. Please try again later.</p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredBrands.map((brand) => (
            <Link to={`/brands/${brand._id}`} key={brand._id} className="block">
              <div className="brand-card bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="p-4 flex flex-col items-center">
                  <div className="h-28 flex items-center justify-center mb-3 p-2">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-center font-semibold text-green-600">{brand.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {brand.slug && brand.slug.split('-').join(' ')}
                  </p>
                </div>
                <div className="bg-gray-50 py-2 px-4 text-center">
                  <span className="text-sm text-gray-700 hover:text-green-600 transition-colors">
                    View Products <i className="fas fa-chevron-right text-xs ml-1"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {!isLoading && !isError && filteredBrands.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No brands found matching your search.</p>
        </div>
      )}
    </div>
  );
}
