import { OrderSummaryProps } from "@/types";
import { View, Text } from "react-native";

export default function OrderSummary({ subtotal, shipping, tax, total }: OrderSummaryProps) {
  return (
    <View className="px-6 mt-6">
      <View className="p-5 bg-surface rounded-3xl">
        <Text className="mb-4 text-xl font-bold text-text-primary">Summary</Text>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-text-secondary">Subtotal</Text>
            <Text className="text-base font-semibold text-text-primary">
              ${subtotal.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-text-secondary">Shipping</Text>
            <Text className="text-base font-semibold text-text-primary">
              ${shipping.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-text-secondary">Tax</Text>
            <Text className="text-base font-semibold text-text-primary">${tax.toFixed(2)}</Text>
          </View>

          {/* Divider */}
          <View className="pt-3 mt-1 border-t border-background-lighter" />

          {/* Total */}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-text-primary">Total</Text>
            <Text className="text-2xl font-bold text-primary">${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}