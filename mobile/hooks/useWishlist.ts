import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

const useWishlist = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {data:wishlist, isLoading, isError} = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const {data} = await api.get<{wishlist: Product[]}>("/wishlist");
      return data?.wishlist ?? [];
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const {data} = await api.post<{wishlist: string[]}>("/users/wishlist", {productId});
      return data.wishlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"]
      })
    }
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async(productId: string) => {
      const {data} = await api.delete<{wishlist: string[]}>(`/users/wishlist/${productId}`);
      return data.wishlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"]
      })
    }
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.some((product: any) => {
      if (typeof product === "string") return product === productId;
      return product._id === productId;
    }) ?? false;
  };

  const toggleWishlist = async (productId: string) => {
    if(isInWishlist(productId)){
      removeFromWishlistMutation.mutate(productId);
    }else{
      addToWishlistMutation.mutate(productId);
    }
  };



  return {
    wishlist,
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};

export default useWishlist;