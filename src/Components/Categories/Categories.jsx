import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useCategories } from '../../Hooks/shared-queries';

export default function Categories() {
  // State for search/filter
  const [searchTerm, setSearchTerm] = useState('');

  // Using custom hook to fetch categories
  const { data: categories, isLoading, isError, refetch } = useCategories();

  // Filter categories based on search term
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Shop By Category</h1>
        <p className="text-gray-600 mb-6">Explore our wide range of product categories</p>

        {/* Search Box */}
        <div className="max-w-md mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search categories..."
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

      {/* Categories Grid */}
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-lg">Error loading categories. Please try again later.</p>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredCategories.map((category) => (
            <Link to={`${category._id}`} key={category._id} className="block">
              <div className="category-card bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Category Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-0 transition-all"></div>
                </div>

                {/* Category Info */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {!isLoading && !isError && filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No categories found matching your search.</p>
        </div>
      )}
    </div>
  );
}
