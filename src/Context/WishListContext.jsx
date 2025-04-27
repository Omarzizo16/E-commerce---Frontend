import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const WishListContext = createContext();

export default function WishListContextProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem('userToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('userToken');
      if (newToken !== token) {
        setToken(newToken);
        queryClient.invalidateQueries(['wishlist']);
      }
    };
    const handleLogout = () => {
      setToken(null);
      queryClient.setQueryData(['wishlist'], { data: [] });
      queryClient.invalidateQueries(['wishlist']);
    };
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('login', handleStorageChange);
    document.addEventListener('logout', handleLogout);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('login', handleStorageChange);
      document.removeEventListener('logout', handleLogout);
    };
  }, [token, queryClient]);

  const headers = { token };

  const checkAuthAndProceed = () => {
    if (!token) {
      return { isAuthenticated: false, message: 'Please login first to continue to Wish List' };
    }
    return { isAuthenticated: true };
  };

  const { data: whishList } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!token) return { data: [] };
      const response = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, { headers });
      return response.data;
    },
    enabled: !!token,
  });

  const isProductInWishlist = (productId) => {
    return whishList?.data?.some((item) => item._id === productId);
  };

  const addProductMutation = useMutation({
    mutationFn: (productId) =>
      axios.post(
        `https://ecommerce.routemisr.com/api/v1/wishlist`,
        { productId },
        { headers }
      ),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['wishlist']);
      const previousWishlist = queryClient.getQueryData(['wishlist']);
      queryClient.setQueryData(['wishlist'], (old) => {
        if (!old) return { data: [{ _id: productId }] };
        return {
          ...old,
          data: [...old.data, { _id: productId }],
        };
      });
      return { previousWishlist };
    },
    onError: (error, productId, context) => {
      queryClient.setQueryData(['wishlist'], context.previousWishlist);
      toast.error(error.response?.data?.message || 'Failed to add to wishlist', {
        position: 'top-center',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['wishlist']);
      toast.success(data.data.message, { position: 'top-center' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId) =>
      axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, { headers }),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['wishlist']);
      const previousWishlist = queryClient.getQueryData(['wishlist']);
      queryClient.setQueryData(['wishlist'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((item) => item._id !== productId),
        };
      });
      return { previousWishlist };
    },
    onError: (error, productId, context) => {
      queryClient.setQueryData(['wishlist'], context.previousWishlist);
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist', {
        position: 'top-center',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlist']);
      toast.success('Product removed from wishlist', { position: 'top-center' });
    },
  });

  const addProductToWishList = (productId) => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) return;
    addProductMutation.mutate(productId);
  };

  const deleteProductFromWishList = (productId) => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) return;
    deleteProductMutation.mutate(productId);
  };

  const toggleWishlistItem = (productId) => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) {
      toast.error(
        <div>
          {authCheck.message}
          <button
            onClick={() => (window.location.href = '/login')}
            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
          >
            Login
          </button>
        </div>,
        {
          position: 'top-center',
          autoClose: 5000,
          closeOnClick: true,
        }
      );
      return;
    }
    if (isProductInWishlist(productId)) {
      deleteProductMutation.mutate(productId);
    } else {
      addProductMutation.mutate(productId);
    }
  };

  const WishlistButton = ({ productId, className }) => {
    return (
      <button
        onClick={() => toggleWishlistItem(productId)}
        className={`${className || 'absolute top-2 right-2'} p-2 rounded bg-white shadow-md hover:bg-gray-100`}
      >
        <i
          className={`fa-heart ${
            isProductInWishlist(productId) ? 'fas text-red-500' : 'far text-gray-700'
          }`}
        ></i>
      </button>
    );
  };

  return (
    <WishListContext.Provider
      value={{
        whishList,
        addProductToWishList,
        deleteProductFromWishList,
        isProductInWishlist,
        toggleWishlistItem,
        WishlistButton,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}