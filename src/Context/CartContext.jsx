import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem('userToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('userToken');
      if (newToken !== token) {
        setToken(newToken);
      }
    };

    const handleLogout = () => {
      setToken(null);
      queryClient.setQueryData(['cart'], null);
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
      return { isAuthenticated: false, message: 'Please login first to continue to Cart' };
    }
    return { isAuthenticated: true };
  };

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!token) return null;
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/cart`, { headers });
      return data;
    },
    enabled: !!token,
  });

  const addProductMutation = useMutation({
    mutationFn: (productId) =>
      axios.post(
        `https://ecommerce.routemisr.com/api/v1/cart`,
        { productId },
        { headers }
      ),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return { data: { products: [{ product: { id: productId }, count: 1 }] } };
        return {
          ...old,
          data: {
            ...old.data,
            products: [...old.data.products, { product: { id: productId }, count: 1 }],
          },
        };
      });
      return { previousCart };
    },
    onError: (error, productId, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(error.response?.data?.message || 'Failed to add product', {
        position: 'top-center',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['cart']);
      toast.success(data.data.message, { position: 'top-center' });
    },
  });

  const updateProductCountMutation = useMutation({
    mutationFn: ({ productId, count }) =>
      axios.put(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        { count },
        { headers }
      ),
    onMutate: async ({ productId, count }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            products: old.data.products.map((item) =>
              item.product.id === productId ? { ...item, count } : item
            ),
          },
        };
      });
      return { previousCart };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(error.response?.data?.message || 'Failed to update count', {
        position: 'top-center',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Product count updated', { position: 'top-center' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId) =>
      axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { headers }),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            products: old.data.products.filter((item) => item.product.id !== productId),
          },
        };
      });
      return { previousCart };
    },
    onError: (error, productId, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(error.response?.data?.message || 'Failed to remove product', {
        position: 'top-center',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Product removed from cart', { position: 'top-center' });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => axios.delete(`https://ecommerce.routemisr.com/api/v1/cart`, { headers }),
    onMutate: async () => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], null);
      return { previousCart };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
      toast.error(error.response?.data?.message || 'Failed to clear cart', {
        position: 'top-center',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Cart cleared successfully', { position: 'top-center' });
    },
  });

  const addProductToCart = (productId) => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    addProductMutation.mutate(productId);
  };

  const updateProductCountToCart = (productId, count) => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) {
      toast.error(authCheck.message, { position: 'top-center' });
      return;
    }
    updateProductCountMutation.mutate({ productId, count });
  };

  const deleteProductFromCart = (productId) => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) {
      toast.error(authCheck.message, { position: 'top-center' });
      return;
    }
    deleteProductMutation.mutate(productId);
  };

  const clearCart = () => {
    const authCheck = checkAuthAndProceed();
    if (!authCheck.isAuthenticated) {
      toast.error(authCheck.message, { position: 'top-center' });
      return;
    }
    clearCartMutation.mutate();
  };

  return (
    <CartContext.Provider
      value={{ addProductToCart, cart, updateProductCountToCart, deleteProductFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}