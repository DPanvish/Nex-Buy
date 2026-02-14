import { View, Text } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen'
import AddressesHeader from './AddressesHeader'
import { Ionicons } from '@expo/vector-icons'
import { UIProps } from '@/types'


const ErrorUI = ({screen}: UIProps) => {
  return (
    <SafeScreen>
      <AddressesHeader />
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