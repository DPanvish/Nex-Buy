import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen'
import { UIProps } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const LoadingUI = ({screen}: UIProps) => {
  return (
    <SafeScreen>
      <View className="flex-row items-center px-6 pb-5 border-b border-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text-primary">{screen}</Text>
      </View>
      <View className="items-center justify-center flex-1 px-6">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="mt-4 text-text-secondary">Loading {screen}...</Text>
      </View>
    </SafeScreen>
  )
}

export default LoadingUI