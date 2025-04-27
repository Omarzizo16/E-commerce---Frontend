import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Base URL for API calls
const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

// Shared query for all products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/products`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Shared query for all categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/categories`);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Query for products by categories
export function useCategoriesProduct(categoryId) {
  return useQuery({
    queryKey: ['categoryProducts', categoryId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/products?category[in]=${categoryId}`);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryId, // Prevents running if categoryId is not provided
  });
}

// Shared query for all brands
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/brands`);
      // Return just the data array directly
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Query for products by brand
export function useProductsByBrand(brandId) {
  return useQuery({
    queryKey: ['brandProducts', brandId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/products?brand=${brandId}`);
      return response.data; // Return the full response
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!brandId, // Only run if brandId exists
  });
}


// Query for single product details
export function useProductDetails(productId) {
  return useQuery({
    queryKey: ['productDetails', productId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/products/${productId}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId, // Only run if productId exists
  });
}

// Query for related products
export function useRelatedProducts(categoryId, currentProductId) {
  return useQuery({
    queryKey: ['relatedProducts', categoryId, currentProductId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/products?category[in][]=${categoryId}&limit=12`);
      // Filter out the current product and limit to 8 related products
      return response.data.data
        .filter(product => product.id !== currentProductId)
        .slice(0, 8);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!categoryId && !!currentProductId, // Only run if both IDs exist
    // Don't refetch on window focus to prevent unnecessary requests
    refetchOnWindowFocus: false,
  });
}

// Query for product reviews
export function useProductReviews(productId) {
  return useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/products/${productId}/reviews`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId, // Only run if productId exists
  });
}

// Query for featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      // You can adjust this query as needed to get "featured" products
      // For example, products with high ratings or certain flag
      const response = await axios.get(`${BASE_URL}/products?sort=-ratingsAverage&limit=8`);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}