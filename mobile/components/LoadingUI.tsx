import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen'
import AddressesHeader from './AddressesHeader'
import { UIProps } from '@/types'

const LoadingUI = ({screen}: UIProps) => {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="items-center justify-center flex-1 px-6">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="mt-4 text-text-secondary">Loading {screen}...</Text>
      </View>
    </SafeScreen>
  )
}

export default LoadingUI