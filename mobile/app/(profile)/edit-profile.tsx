import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import { useUser } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const EditProfileScreen = () => {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const queryClient = useQueryClient();

  if (!isLoaded) {
    return (
      <SafeScreen>
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#ff9300" />
        </View>
      </SafeScreen>
    );
  }

  const editProfileMutation = useMutation({
    mutationFn: async() => {
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    },
    onSuccess: () => {
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      Alert.alert("Error", error.errors?.[0]?.message || "Failed to update profile.");
    }
  })

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First name and last name are required.");
      return;
    }
    editProfileMutation.mutate();
  };

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="flex-row items-center px-6 pb-5 border-b border-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text-primary">Edit Profile</Text>
      </View>

      <View className="p-6">
        <View className="mb-4">
          <Text className="mb-2 text-base font-bold text-text-secondary">First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            className="p-4 text-base rounded-2xl bg-surface text-text-primary"
            placeholder="Enter your first name"
            placeholderTextColor="#666"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-base font-bold text-text-secondary">Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            className="p-4 text-base rounded-2xl bg-surface text-text-primary"
            placeholder="Enter your last name"
            placeholderTextColor="#666"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={editProfileMutation.isPending}
          className={`items-center justify-center py-4 rounded-2xl ${editProfileMutation.isPending ? "bg-primary/50" : "bg-primary"}`}
          activeOpacity={0.8}
        >
          {editProfileMutation.isPending ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text className="text-base font-bold text-background">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default EditProfileScreen
