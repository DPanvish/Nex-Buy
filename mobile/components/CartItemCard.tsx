import { View, Text, Touchable, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { CartItem } from '@/types'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'

const CartItemCard = ({item, handleQuantityChange, handleRemoveItem, isUpdating, isRemoving}: {
  item: CartItem, 
  handleQuantityChange: (productId: string, currentQuantity: number, change: number) => void, 
  handleRemoveItem: (product: string, productName: string) => void,
  isUpdating: boolean,
  isRemoving: boolean
}) => {
  return (
    <View key={item._id} className="overflow-hidden bg-surface rounded-3xl">
      <View className="flex-row p-4">
        {/* Product Image */}
        <View className="relative">
          <Image
            source={item.product.images[0]}
            className="bg-background-lighter"
            contentFit="cover"
            style={{width: 112, height: 112, borderRadius: 16}} 
          />

          <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
            <Text className="text-xs font-bold text-background">x{item.quantity}</Text>
          </View>
        </View>

        <View className="justify-between flex-1 ml-4">
          <View>
            <Text className="text-lg font-bold leading-tight text-text-primary" numberOfLines={2}>{item.product.name}</Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-2xl font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</Text>
              <Text className="ml-2 text-sm text-text-secondary">${item.product.price.toFixed(2)} each</Text>
            </View>
          </View>

          <View className="flex-row items-center mt-3">
            <TouchableOpacity
              className="items-center justify-center rounded-full bg-background-lighter w-9 h-9"
              activeOpacity={0.7}
              onPress={() => handleQuantityChange(item.product._id, item.quantity, -1)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="remove" size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <View className="mx-4 min-w-[32px] items-center">
              <Text className="text-lg font-bold text-text-primary">{item.quantity}</Text>
            </View>

            <TouchableOpacity
              className="items-center justify-center rounded-full bg-primary w-9 h-9"
              activeOpacity={0.7}
              onPress={() => handleQuantityChange(item.product._id, item.quantity, 1)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="add" size={18} color="#121212" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center ml-auto rounded-full bg-red-500/10 w-9 h-9"
              activeOpacity={0.7}
              onPress={() => handleRemoveItem(item.product._id, item.product.name)}
              disabled={isRemoving}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CartItemCard