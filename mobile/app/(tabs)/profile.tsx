import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import SafeScreen from '@/components/SafeScreen'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { MENU_ITEMS } from '@/lib/utils'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const ProfileScreen = () => {
  const {signOut} = useAuth();
  const {user} = useUser();

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if(action === "/profile"){
      return;
    }
    router.push(action);
  }

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}
      >
        {/* HEADER */}
        <View className="px-6 pb-8">
          <View className="p-6 bg-surface rounded-3xl">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                  }} 
                  transition={200}
                />

                <View className="absolute items-center justify-center border-2 rounded-full -bottom-1 -right-1 bg-primary size-7 border-surface">
                  <Ionicons name="checkmark" size={16} color="#121212" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="mb-1 text-2xl font-bold text-text-primary">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-sm text-text-secondary">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu ITEMS */}
        <View className="flex-row flex-wrap gap-2 mx-6 mb-3">
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="items-center justify-center p-6 bg-surface rounded-2xl"
              style={{width: "48%"}}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.action)}
            >
              <View 
                className="items-center justify-center w-16 h-16 mb-4 rounded-full"
                style={{backgroundColor: item.color + "20"}}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text className="text-base font-bold text-text-primary">{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOTIFICATIONS BUTTON */}
        <View className="p-4 mx-6 mb-3 bg-surface rounded-2xl">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={22} color={"#FFFFFF"} />
              <Text className="ml-3 font-semibold text-text-primary">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* PRIVACY AND SECURITY BUTTON*/}
        <View className="p-4 mx-6 mb-3 bg-surface rounded-2xl">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/privacy-security")}
          >
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
              <Text className="ml-3 font-semibold text-text-primary">Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-5 mx-6 mb-3 border-2 bg-surface rounded-2xl border-red-500/20"
          activeOpacity={0.8}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="ml-2 text-base font-bold text-red-500">Sign Out</Text>
        </TouchableOpacity>

        <Text className="mx-6 mb-3 text-xs text-center text-text-secondary">Version 1.0.0</Text>
      </ScrollView>
    </SafeScreen>
  )
}

export default ProfileScreen