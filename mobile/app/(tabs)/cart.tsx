import { View, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import useCart from '@/hooks/useCart'
import { useApi } from '@/lib/api'
import { useAddresses } from '@/hooks/useAddresses'
// import { useStripe } from '@stripe/stripe-react-native'
import { Address } from '@/types'
import LoadingUI from '@/components/LoadingUI'
import ErrorUI from '@/components/ErrorUI'
import { Ionicons } from '@expo/vector-icons'
import CartItemCard from '@/components/CartItemCard'
import OrderSummary from '@/components/OrderSummary'
import AddressSelectionModal from '@/components/AddressSelectionModal'

const EmptyUI = () => {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-3xl font-bold text-text-primary tracking-light">Cart</Text>
      </View>
      <View className="items-center justify-center flex-1 px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="mt-4 text-xl font-semibold text-text-primary">Your cart is empty</Text>
        <Text className="mt-2 text-center text-text-secondary">Add some products to get started</Text>
      </View>
    </View>
  )
}

const CartScreen = () => {
  const api = useApi();
  const {addToCart, isAddingToCart, cart, cartTotal, cartItemCount, clearCart, isClearing, isError, isLoading, isRemoving, isUpdating, removeFromCart, updateQuantity} = useCart();
  const {addresses} = useAddresses();
  // const {initPaymentSheet, presentPaymentSheet} = useStripe();
  
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if(newQuantity < 1){
      return;
    }

    updateQuantity({productId, quantity: newQuantity});
  }

  const handleRemoveItem = (product: string, productName: string) => {
    Alert.alert("Remove Item", `Are you sure you want to remove ${productName} from your cart?`, [
      {text: "Cancel", style: "cancel"},
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          removeFromCart(product);
        }
      },
    ]);
  }

  const handleCheckout = () => {
    if(cartItems.length === 0){
      return;
    }

    if(!addresses || addresses.length === 0){
      Alert.alert(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [{text: "Ok"}]
      );

      return;
    }

    setAddressModalVisible(true);
  }

  const handleProceedWithPayment = async(selectedAddress: Address) => {}

  if(isLoading){
    return <LoadingUI screen="Cart"/>;
  }

  if(isError){
    return <ErrorUI screen="Cart"/>;
  }

  if(cartItems.length === 0){
    return <EmptyUI />;
  }
 
  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-3xl font-bold tracking-tight text-text-primary">Cart</Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 240}}
      >
        <View className="gap-2 px-6">
          {cartItems.map((item, index) => (
            <CartItemCard 
              key={item._id} 
              item={item}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              isUpdating={isUpdating}
              isRemoving={isRemoving}
            />
          ))}
        </View>

        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-32 border-t bg-background/95 backdrop-blur-xl border-surface">
        {/* Quick Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#ff9300" />
            <Text className="ml-2 text-text-secondary">{cartItemCount}{cartItemCount === 1 ? " item" : " items"}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-text-primary">${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          className="overflow-hidden bg-primary rounded-2xl"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="flex-row items-center justify-center py-5">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#121212" />
            ):(
              <>
                <Text className="mr-2 text-lg font-bold text-background">Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <AddressSelectionModal 
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  )
}

export default CartScreen