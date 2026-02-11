import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { AddressFormModalProps } from '@/types'
import SafeScreen from './SafeScreen'
import { Ionicons } from '@expo/vector-icons'

const AddressFormModal = ({addressForm, isAddingAddress, isUpdatingAddress, onClose, onSave, onFormChange, visible, isEditing}: AddressFormModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SafeScreen>
          {/* HEADER */}
          <View className="flex-row items-center justify-between px-6 py-5 border-b border-surface">
            <Text className="text-2xl font-bold text-text-primary">
              {isEditing ? "Edit Address" : "Add Address"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL INPUT */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">Label</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="e.g., Home, Work, Office"
                  placeholderTextColor="#666"
                  value={addressForm.label}
                  onChangeText={(text) => onFormChange({...addressForm, label: text})}
                />
              </View>

              {/* NAME INPUT */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">Full Name</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="Enter your full name"
                  placeholderTextColor="#666"
                  value={addressForm.fullName}
                  onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
                />
              </View>

              {/* Address Input */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">Street Address</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="Street address, apt/suite number"
                  placeholderTextColor="#666"
                  value={addressForm.streetAddress}
                  onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
                  multiline
                />
              </View>

              {/* City Input */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">City</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="e.g., New York"
                  placeholderTextColor="#666"
                  value={addressForm.city}
                  onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
                />
              </View>

              {/* State Input */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">State</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="e.g., NY"
                  placeholderTextColor="#666"
                  value={addressForm.state}
                  onChangeText={(text) => onFormChange({ ...addressForm, state: text })}
                />
              </View>

              {/* ZIP Code Input */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">ZIP Code</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="e.g., 10001"
                  placeholderTextColor="#666"
                  value={addressForm.zipCode}
                  onChangeText={(text) => onFormChange({ ...addressForm, zipCode: text })}
                  keyboardType="numeric"
                />
              </View>

              {/* Phone Input */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-text-primary">Phone Number</Text>
                <TextInput
                  className="px-4 py-4 text-base bg-surface text-text-primary rounded-2xl"
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="#666"
                  value={addressForm.phoneNumber}
                  onChangeText={(text) => onFormChange({ ...addressForm, phoneNumber: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Default Address Toggle */}
              <View className="flex-row items-center justify-between p-4 mb-6 bg-surface rounded-2xl">
                <Text className="font-semibold text-text-primary">Set as default address</Text>
                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
                  thumbColor="white"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                  className="items-center py-5 bg-primary rounded-2xl"
                  activeOpacity={0.8}
                  onPress={onSave}
                  disabled={isAddingAddress || isUpdatingAddress}
                >
                  {isAddingAddress || isUpdatingAddress ? (
                    <ActivityIndicator size="small" color="#121212" />
                  ) : (
                    <Text className="text-lg font-bold text-background">
                      {isEditing ? "Save Changes" : "Add Address"}
                    </Text>
                  )}
                </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default AddressFormModal