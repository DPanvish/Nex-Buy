import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/SafeScreen'
import useWishlist from '@/hooks/useWishlist'
import useCart from '@/hooks/useCart'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import LoadingUI from '@/components/LoadingUI'
import ErrorUI from '@/components/ErrorUI'


const WishlistScreen = () => {
  const {wishlist, isLoading, isError, removeFromWishlist, isRemovingFromWishlist} = useWishlist();
  const {addToCart, isAddingToCart} = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert("Remove from wishlist", `Remove ${productName} from your wishlist?`, [
      {text: "Cancel", style: "cancel"},
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          removeFromWishlist(productId);
        }
      },
    ]);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart({productId, quantity: 1}, {
      onSuccess: () => Alert.alert("Success", `${productName} added to cart!`),
      onError: (error: any) => {
        Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart");
      },
    });
  };

  if(isLoading){
    return <LoadingUI screen="wishlist" />
  }

  if(isError){
    return <ErrorUI screen="wishlist" />
  }

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="flex-row items-center px-6 pb-5 border-b border-surface">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text-primary">Wishlist</Text>
        <Text className="ml-auto text-sm text-text-secondary">{wishlist?.length} {wishlist?.length === 1 ? "item" : "items"}</Text>
      </View>

      {wishlist?.length === 0 ? (
        <View className="items-center justify-center flex-1 px-6">
          <Ionicons name="heart-outline" size={80} color="#666" />
          <Text className="mt-4 text-xl font-semibold text-text-primary">Your wishlist is empty</Text>
          <Text className="mt-2 text-center text-text-secondary">Start adding products you love!</Text>
          <TouchableOpacity
            className="px-8 py-4 mt-6 bg-primary rounded-2xl"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-base font-bold text-background">Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        >
          <View className="px-6 py-4">
            {wishlist?.map((product) => (
              <TouchableOpacity
                key={product._id}
                className="mb-3 overflow-hidden bg-surface rounded-3xl"
                activeOpacity={0.8}
                // onPress={() => router.push(`/product/${product._id}`)}
              >
                <View className="flex-row p-4">
                  <Image
                    source={product.images[0]}
                    className="rounded-2xl bg-background-lighter"
                    style={{width: 96, height: 96, borderRadius: 10}}
                  />

                  <View className="flex-1 ml-4">
                    <Text className="mb-2 text-base font-bold text-text-primary" numberOfLines={2}>{product.name}</Text>
                    <Text className="mb-2 text-xl font-bold text-primary">${product.price.toFixed(2)}</Text>

                    {product.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 mr-2 bg-green-500 rounded-full" />
                        <Text className="text-sm font-semibold text-green-500">{product.stock} in stock</Text>
                      </View>
                    ) : (
                      <View className="flex-row item-center">
                        <View className="w-2 h-2 mr-2 bg-red-500 rounded-full" />
                        <Text className="text-sm font-semibold text-red-500">Out of stock</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    className="self-start p-2 rounded-full bg-red-500/20"
                    activeOpacity={0.7}
                    onPress={() => handleRemoveFromWishlist(product._id, product.name)}
                    disabled={isRemovingFromWishlist}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                {product.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="items-center py-3 bg-primary rounded-xl"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(product._id, product.name)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color="#121212" />
                      ) : (
                        <Text className="font-bold text-background">Add to Cart</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  )
}

export default WishlistScreen