import { View, Text, Alert, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { useProduct } from '@/hooks/useProduct';
import useCart from '@/hooks/useCart';
import useWishlist from '@/hooks/useWishlist';
import LoadingUI from '@/components/LoadingUI';
import ErrorUI from '@/components/ErrorUI';
import { flush } from '@sentry/react-native';
import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

const {width} = Dimensions.get("window");

const ProductDetailScreen = () => {
  const {id} = useLocalSearchParams<{id: string}>();

  const {data:product, isError, isLoading} = useProduct(id);
  const {addToCart, isAddingToCart} = useCart();
  const {isInWishlist, toggleWishlist, isAddingToWishlist, isRemovingFromWishlist} = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if(!product){
      return;
    }

    addToCart(
      {productId: product._id, quantity},
      {
        onSuccess: () => Alert.alert("Success", `${product.name} added to cart!`),
        onError: (error: any) => Alert.alert("Error", error?.response?.data?.error || "Failed to add to cart"),
      }
    );
  };

  if(isLoading){
    return <LoadingUI screen="Product" />
  }

  if(isError || !product){
    return <ErrorUI screen="Product" />
  }

  const inStock = product?.stock > 0;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-6 pt-20 pb-4">
        <TouchableOpacity
          className="items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isInWishlist(product._id) ? "bg-primary" : "bg-black/50 backdrop-blur-xl"
          }`}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
          activeOpacity={0.7}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ):(
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist(product._id) ? "#121212" : "#FFFFFF"} 
            />
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >
        {/* IMAGE SLIDER */}
        <View className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images?.map((image: string, index: number) => (
              <View key={index} style={{width}}>
                <Image
                  source={image}
                  style={{
                    width,
                    height: 400,
                  }} 
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* IMAGE INDICATORS */}
          <View className="absolute left-0 right-0 flex-row justify-center gap-2 bottom-4">
            {product.images?.map((_: any, index: number) => (
              <View key={index} className={`h-2 rounded-full ${index === selectedImageIndex ? "bg-primary w-6" : "bg-white/50 w-2"}`} />
            ))}
          </View>
        </View>

        {/* PRODUCT INFO */}
        <View className="p-6">
          {/* Category */}
          <View className="flex-row items-center mb-3">
            <View className="px-3 py-1 rounded-full bg-primary/20">
              <Text className="text-xs font-bold text-primary">{product.category}</Text>
            </View>
          </View>

          {/* Product Name */}
          <Text className="mb-3 text-3xl font-bold text-text-primary">{product.name}</Text>

          {/* Rating and Reviews */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center px-3 py-2 rounded-full bg-surface">
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text className="ml-1 mr-2 font-bold text-text-primary">{product.averageRating?.toFixed(1)}</Text>
              <Text className="text-sm text-text-secondary">
                ({product.totalReviews > 1 ? `${product.totalReviews} reviews` : `${product.totalReviews} review`})
              </Text>
            </View>
            {inStock ? (
              <View className="flex-row items-center ml-3">
                <View className="w-2 h-2 mr-2 bg-green-500 rounded-full" />
                <Text className="text-sm font-semibold text-green-500">{product.stock} in stock</Text>
              </View>
            ) : (
              <View className="flex-row items-center ml-3">
                <View className="w-2 h-2 mr-2 bg-red-500 rounded-full" />
                <Text className="text-sm font-semibold text-red-500">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View className="flex-row items-center mb-6">
            <Text className="text-4xl font-bold text-primary">${product?.price?.toFixed(2)}</Text>
          </View>

          {/* Ouantity */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-bold text-text-primary">Quantity</Text>

            <View className="flex-row items-center">
              <TouchableOpacity
                className="items-center justify-center w-12 h-12 rounded-full bg-surface"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                activeOpacity={0.7}
                disabled={!inStock}
              >
                <Ionicons name="remove" size={24} color={inStock ? "#FFFFFF" : "#666"} />
              </TouchableOpacity>

              <Text className="mx-6 text-xl font-bold text-text-primary">{quantity}</Text>

              <TouchableOpacity
                className="items-center justify-center w-12 h-12 rounded-full bg-primary"
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                activeOpacity={0.7}
                disabled={!inStock || quantity >= product.stock}
              >
                <Ionicons name="add" size={24} color={!inStock || quantity >= product.stock ? "#666" : "#121212"} />
              </TouchableOpacity>
            </View>

            {quantity >= product.stock  && inStock && (
              <Text className="mt-2 text-sm text-orange-500">Maximum stock reached</Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="mb-3 text-lg font-bold text-text-primary">Description</Text>
            <Text className="text-base leading-6 text-text-secondary">{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 pb-8 border-t bg-background/95 backdrop-blur-xl border-surface">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="mb-1 text-sm text-text-secondary">Total Price</Text>
            <Text className="text-2xl font-bold text-primary">
              ${(product?.price * quantity)?.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-2xl px-8 py-4 flex-row items-center ${
              !inStock ? "bg-surface" : "bg-primary"
            }`}
            activeOpacity={0.8}
            onPress={handleAddToCart}
            disabled={!inStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <>
                <Ionicons name="cart" size={24} color={!inStock ? "#666" : "#121212"} />
                <Text
                  className={`font-bold text-lg ml-2 ${
                    !inStock ? "text-text-secondary" : "text-background"
                  }`}
                >
                  {!inStock ? "Out of Stock" : "Add to Cart"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

export default ProductDetailScreen