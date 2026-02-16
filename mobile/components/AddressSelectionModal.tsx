import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Address, AddressSelectionModalProps } from '@/types'
import { useAddresses } from '@/hooks/useAddresses';
import { Ionicons } from '@expo/vector-icons';

const AddressSelectionModal = ({visible, onClose, onProceed, isProcessing} : AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const {addresses, isLoading: addressesLoading} = useAddresses();

  useEffect(() => {
    if(visible){
      setSelectedAddress(null);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="justify-end flex-1 bg-black/50">
        <View className="bg-background rounded-t-3xl h-1/2">
          {/* MODAL HEADER */}
          <View className="flex-row items-center justify-between p-6 border-b border-surface">
            <Text className="text-2xl font-bold text-text-primary">Select Address</Text>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full bg-surface">
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* ADDRESSES LIST */}
          <ScrollView className="flex-1 p-6" contentContainerStyle={{paddingBottom: 50}}>
            {addressesLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#00D9FF" />
              </View>
            ):(
              <View className="gap-4">
                {addresses.map((address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-surface rounded-3xl p-6 border-2 ${
                      selectedAddress?._id === address._id ? "border-primary" : "border-background-lighter"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="mr-2 text-lg font-bold text-primary">{address.label}</Text>
                          {address.isDefault && (
                            <View className="px-3 py-1 rounded-full bg-primary/20">
                              <Text className="text-sm font-semibold text-primary">Default</Text>
                            </View>
                          )}
                        </View>
                        <Text className="mb-2 text-lg font-semibold text-text-primary">{address.fullName}</Text>
                        <Text className="mb-1 text-base leading-6 text-text-secondary">{address.streetAddress}</Text>
                        <Text className="mb-2 text-base text-text-secondary">{address.city}, {address.state}, {address.zipCode}</Text>
                        <Text className="text-base text-text-secondary">{address.phoneNumber}</Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="p-2 ml-3 rounded-full bg-primary">
                          <Ionicons name="checkmark" size={24} color="#121212" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="p-6 border-t border-surface">
            <TouchableOpacity
              className="py-5 bg-primary rounded-2xl"
              activeOpacity={0.9}
              onPress={() => {
                if(selectedAddress){
                  onProceed(selectedAddress)
                }
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#121212" />
                ):(
                  <>
                    <Text className="mr-2 text-lg font-bold text-background">Continue to Payment</Text>
                    <Ionicons name="arrow-forward" size={20} color="#121212" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AddressSelectionModal