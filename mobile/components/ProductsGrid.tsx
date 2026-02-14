import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import { Product, ProductGridProps } from '@/types';
import useWishlist from '@/hooks/useWishlist';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useCart from '@/hooks/useCart';

const NoProductsFound = () => {
  return (
    <View className="items-center justify-center py-20">
      <Ionicons name="search-outline" size={48} color={"#666"} />
      <Text className="mt-4 font-semibold text-text-primary">No products found</Text>
      <Text className="mt-2 text-sm text-text-secondary">Try adjusting your filters</Text>
    </View>
  )
}

const ProductsGrid = ({products, isLoading, isError}: ProductGridProps) => {
  const {isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist} = useWishlist();
  const {isAddingToCart, addToCart} = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart({productId, quantity:1}, {
      onSuccess: () => {
        Alert.alert("Success", `${productId} added to cart!`);
      },
      onError: (error) => {
        Alert.alert("Error", error?.message || "Failed to add product to cart!");
      }
    });
  }


  const renderProduct = ({item: product}: {item: Product}) => (
    <TouchableOpacity
      className="mb-3 overflow-hidden bg-surface rounded-3xl"
      style={{width: '48%'}}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${product._id}`)}
    >
      <View className="relative">
        {product.images?.[0] ? (
          <Image
            source={{uri: product.images[0]}}
            className="w-full h-44 bg-background-lighter"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center justify-center w-full h-44 bg-background-lighter">
            <Ionicons name="image-outline" size={28} color="#666" />
          </View>
        )}

        <TouchableOpacity
          className="absolute p-2 rounded-full top-3 right-3 bg-black/30 backdrop-blur-xl"
          activeOpacity={0.7}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ): (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishlist(product._id) ? "#FF6B6B" : "#FFFFFF"} 
            />
          )}
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="mb-1 text-xs text-text-secondary">{product.category}</Text>
        <Text className="mb-2 text-sm font-bold text-text-primary" numberOfLines={2}>{product.name}</Text>
        
        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="ml-1 text-xs font-semibold text-text-primary">{product.averageRating.toFixed(1)}</Text>
          <Text className="ml-1 text-xs text-text-secondary">({product.totalReviews})</Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-primary">${product.price.toFixed(2)}</Text>
          <TouchableOpacity
            className="items-center justify-center w-8 h-8 rounded-full bg-primary"
            activeOpacity={0.7}
            onPress={() => handleAddToCart(product._id, product.name)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <Ionicons name="add" size={18} color="#121212" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
  
  if(isLoading){
    return (
      <View className="items-center justify-center py-20">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="mt-4 text-text-secondary">Loading Products...</Text>
      </View>
    );
  }

  if(isError){
    return (
      <View className="items-center justify-center py-20">
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text className="mt-4 font-semibold text-text-primary">Failed to load products</Text>
        <Text className="mt-2 text-sm text-text-secondary">Please try again later</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={item => item._id}
      numColumns={2}
      columnWrapperStyle={{justifyContent: "space-between"}}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
    />
  )
}

export default ProductsGrid;