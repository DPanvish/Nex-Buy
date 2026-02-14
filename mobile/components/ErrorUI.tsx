import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import { UIProps } from '@/types'
import { router } from 'expo-router'


const ErrorUI = ({screen}: UIProps) => {
  return (
    <SafeScreen>
      <View className="flex-row items-center px-6 pb-5 border-b border-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text-primary">{screen}</Text>
      </View>
      <View className="items-center justify-center flex-1 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="mt-4 text-xl font-semibold text-text-primary">
          Failed to load {screen}
        </Text>
        <Text className="mt-2 text-center text-text-secondary">
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  )
}

export default ErrorUI