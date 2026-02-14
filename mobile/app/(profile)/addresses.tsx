import { View, Text, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import { useAddresses } from '@/hooks/useAddresses'
import { Ionicons } from '@expo/vector-icons';
import AddressesHeader from '@/components/AddressesHeader';
import { Address } from '@/types';
import AddressFormModal from '@/components/AddressFormModal';
import AddressCard from '@/components/AddressCard';
import LoadingUI from '@/components/LoadingUI';
import ErrorUI from '@/components/ErrorUI';

const AddressesScreen = () => {

  const {addAddress, addresses, isLoading, isError, deleteAddress, isDeletingAddress, isAddingAddress, isUpdatingAddress, updateAddress} = useAddresses();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false
  });

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
  };
  
  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert("Delete Address", `Are you sure you want to delete this address ${label}?`, [
      {text: "Cancel", style: "cancel"},
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAddress(addressId),
      },
    ]);
  };

  const handleSaveAddress = () => {
    if(!addressForm.label || !addressForm.fullName || !addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.zipCode || !addressForm.phoneNumber){
      Alert.alert("Error", "Please fill out all fields");
      return;
    }

    if(editingAddressId){
      // Update address
      updateAddress({
        addressId: editingAddressId,
        addressData: addressForm,
      },{
        onSuccess: () => {
          setShowAddressForm(false);
          setEditingAddressId(null);
          Alert.alert("Success", "Address updated successfully");
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to update address");
        },
      })
    }else{
      // Create new address
      addAddress(addressForm, {
        onSuccess: () => {
          setShowAddressForm(false);
          Alert.alert("Success", "Address added successfully");
        },
        onError: (error: any) => {
          Alert.alert("Error", error?.response?.data?.error || "Failed to add address");
        }
      });
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  if(isLoading){
    return <LoadingUI screen="addresses"/>;
  }

  if(isError){
    return <ErrorUI screen="addresses" />;
  }

  return (
    <SafeScreen>
      <AddressesHeader />

      {addresses.length === 0 ? (
        <View className="items-center justify-center flex-1 px-6">
          <Ionicons name="location-outline" size={80} color="#666" />
          <Text className="mt-4 text-xl font-semibold text-text-primary">No addresses yet</Text>
          <Text className="mt-2 text-center text-text-secondary">Add your first address</Text>
          <TouchableOpacity
            className="px-8 py-4 mt-6 bg-primary rounded-2xl"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-base font-bold text-background">Add Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        >
          <View className="px-6 py-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isUpdatingAddress={isUpdatingAddress}
                isDeletingAddress={isDeletingAddress} 
              />
            ))}

            <TouchableOpacity
              className="items-center py-4 mt-2 bg-primary rounded-2xl"
              activeOpacity={0.8}
              onPress={handleAddAddress}
            >
              <View className="flex-row items-start">
                <Ionicons name="add-circle-outline" size={24} color="#121212" />
                <Text className="ml-2 text-base font-bold text-background">Add New Address</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal 
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />
    </SafeScreen>
  )
}

export default AddressesScreen