import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddressCardProps } from "@/types";



export default function AddressCard({address, onEdit, onDelete, isUpdatingAddress, isDeletingAddress}: AddressCardProps) {
  return (
    <View className="p-5 mb-3 bg-surface rounded-3xl">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-primary/20">
            <Ionicons name="location" size={24} color="#1DB954" />
          </View>
          <Text className="text-lg font-bold text-text-primary">{address.label}</Text>
        </View>
        {address.isDefault && (
          <View className="px-3 py-1 rounded-full bg-primary">
            <Text className="text-xs font-bold text-background">Default</Text>
          </View>
        )}
      </View>
      <View className="ml-15">
        <Text className="mb-1 font-semibold text-text-primary">{address.fullName}</Text>
        <Text className="mb-1 text-sm text-text-secondary">{address.streetAddress}</Text>
        <Text className="mb-2 text-sm text-text-secondary">
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text className="text-sm text-text-secondary">{address.phoneNumber}</Text>
      </View>
      <View className="flex-row gap-2 mt-4">
        <TouchableOpacity
          className="items-center flex-1 py-3 bg-primary/20 rounded-xl"
          activeOpacity={0.7}
          onPress={() => onEdit(address)}
          disabled={isUpdatingAddress}
        >
          <Text className="font-bold text-primary">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center flex-1 py-3 bg-red-500/20 rounded-xl"
          activeOpacity={0.7}
          onPress={() => onDelete(address._id, address.label)}
          disabled={isDeletingAddress}
        >
          <Text className="font-bold text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}