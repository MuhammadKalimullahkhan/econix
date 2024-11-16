import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPurchase,
  createReview,
  createUserAccount,
  getCategories,
  getCurrentUser,
  getCurrentUserOrders,
  getInfiniteProducts,
  getPaymentMethods,
  getProductById,
  getReviewsByProductId,
  searchProduct,
  signInAccount,
  signOutAccount,
} from "@/lib/appwrite/api";
import { QUERY_KEYS } from "@/lib/react-query/query-keys";
import { INewUser, Reviews } from "@/types";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// ============================================================
// CATEGORIES QUERIES
// ============================================================

export const useGetCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CATEGORIES],
    queryFn: getCategories,
  });
};

// PURCHASE
export const useGetPaymentMethods = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PAYMENT_METHODS],
    queryFn: getPaymentMethods,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPurchase,
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
    },
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetProducts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_PRODUCTS],
    queryFn: getInfiniteProducts,
    getNextPageParam: (lastPage) => {
      // Ensure lastPage and its documents exist
      if (!lastPage || lastPage.documents.length === 0) {
        return null; // Return null to indicate there are no more pages
      }
      // Get the $id of the last document in the current page
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId; // Use this $id as the cursor for the next page
    },
  });
};

export const useSearchProduct = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_PRODUCTS, searchTerm],
    queryFn: () => searchProduct(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetReviews = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REVIEWS_BY_PRODUCT_ID, productId],
    queryFn: () => getReviewsByProductId(productId),
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewObj: Reviews) => createReview(reviewObj),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REVIEWS_BY_PRODUCT_ID, data?.products.$id],
      });
    },
  });
};

export const useGetProductById = (productId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};

// ORDERS
export const useGetCurrentUserOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER_ORDERS],
    queryFn: getCurrentUserOrders,
  });
};

// export const useCreatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (product: Product) => createProduct(product),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_PRODUCTS],
//       });
//     },
//   });
// };
// export const useGetUserPosts = (userId?: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_PRODUCTS, userId],
//     queryFn: () => getUserPosts(userId),
//     enabled: !!userId,
//   });
// };

// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: Product) => updatePost(post),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//     },
//   });
// };

// export const useDeletePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
//       deletePost(postId, imageId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_PRODUCTS],
//       });
//     },
//   });
// };

// export const useLikePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       postId,
//       likesArray,
//     }: {
//       postId: string;
//       likesArray: string[];
//     }) => likePost(postId, likesArray),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_PRODUCTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_PRODUCTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useSavePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
//       savePost(userId, postId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_PRODUCTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_PRODUCTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useDeleteSavedPost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_PRODUCTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_PRODUCTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

// export const useGetUsers = (limit?: number) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USERS],
//     queryFn: () => getUsers(limit),
//   });
// };

// export const useGetUserById = (userId: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
//     queryFn: () => getUserById(userId),
//     enabled: !!userId,
//   });
// };

// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (user: IUpdateUser) => updateUser(user),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
//       });
//     },
//   });
// };
