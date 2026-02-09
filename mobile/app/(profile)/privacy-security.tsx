import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native'
import React, { useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { ACCOUNT_SETTINGS, PRIVACY_SETTINGS, SECURITY_SETTINGS } from '@/lib/utils'

const PrivacyAndSecurityScreen = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareData, setShareData] = useState(false);

  SECURITY_SETTINGS[1].value = twoFactorEnabled;
  SECURITY_SETTINGS[2].value = biometricEnabled;
  PRIVACY_SETTINGS[1].value = pushNotifications;
  PRIVACY_SETTINGS[2].value = emailNotifications;
  PRIVACY_SETTINGS[3].value = marketingEmails;
  PRIVACY_SETTINGS[4].value = shareData;

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case "two-factor":
        setTwoFactorEnabled(value);
        break;
      case "biometric":
        setBiometricEnabled(value);
        break;
      case "push":
        setPushNotifications(value);
        break;
      case "email":
        setEmailNotifications(value);
        break;
      case "marketing":
        setMarketingEmails(value);
        break;
      case "data":
        setShareData(value);
        break;
    }
  };


  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="flex-row items-center px-6 pb-5 border-b border-surface">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-text-primary">Privacy & Security</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}
      >
        {/* SECURITY SETTINGS */}
        <View className="px-6 pt-6">
          <Text className="mb-4 text-lg font-bold text-text-primary font-lg">Security</Text>
            {SECURITY_SETTINGS.map(setting => (
              <TouchableOpacity
                key={setting.id}
                className="p-4 mb-3 bg-surface rounded-2xl"
                activeOpacity={setting.type === "toggle" ? 1 : 0.7}
              >
                <View className="flex-row items-center">
                  <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-primary/20">
                    <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-text-primary">
                      {setting.title}
                    </Text>
                    <Text className="text-sm text-text-secondary">{setting.description}</Text>
                  </View>

                  {setting.type === "toggle" ? (
                    <Switch
                      value={setting.value}
                      onValueChange={(value) => handleToggle(setting.id, value)} 
                      thumbColor="#FFFFFF"
                      trackColor={{false: "#2A2A2A", true: "#ff9300"}}
                    />
                  ):(
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* PRIVACY SETTINGS */}
        <View className="px-6 pt-4">
          <Text className="mb-4 text-lg font-bold text-text-primary">Privacy</Text>

          {PRIVACY_SETTINGS.map((setting) => (
            <View key={setting.id}>
              <View className="p-4 mb-3 bg-surface rounded-2xl">
                <View className="flex-row items-center">
                  <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-primary/20">
                    <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-text-primary">
                      {setting.title}
                    </Text>
                    <Text className="text-sm text-text-secondary">{setting.description}</Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    trackColor={{ false: "#2A2A2A", true: "#1DB954" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACCOUNT SETTINGS */}
        <View className="px-6 pt-4">
          <Text className="mb-4 text-lg font-bold text-text-primary">Account</Text>

          {ACCOUNT_SETTINGS.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="p-4 mb-3 bg-surface rounded-2xl"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-primary/20">
                  <Ionicons name={setting.icon as any} size={24} color="#1DB954" />
                </View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-bold text-text-primary">
                    {setting.title}
                  </Text>
                  <Text className="text-sm text-text-secondary">{setting.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* DELETE ACCOUNT BUTTON */}
        <View className="px-6 pt-4">
          <TouchableOpacity
            className="flex-row items-center justify-between p-5 border-2 bg-surface rounded-2xl border-red-500/20"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-12 h-12 mr-4 rounded-full bg-red-500/20">
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <View>
                <Text className="mb-1 text-base font-bold text-red-500">Delete Account</Text>
                <Text className="text-sm text-text-secondary">Permanently delete your account</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        {/* INFO ALERT */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row p-4 bg-primary/10 rounded-2xl">
            <Ionicons name="information-circle-outline" size={24} color="#1DB954" />
            <Text className="flex-1 ml-3 text-sm text-text-secondary">
              We take your privacy seriously. Your data is encrypted and stored securely. You can
              manage your privacy settings at any time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default PrivacyAndSecurityScreen