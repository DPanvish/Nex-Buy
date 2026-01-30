import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useMemo, useState } from 'react'
import SafeScreen from '../../components/SafeScreen'
import { Ionicons } from '@expo/vector-icons'
import { CATEGORIES } from '@/lib/utils'
import ProductsGrid from '@/components/ProductsGrid'
import useProducts from '@/hooks/useProducts'

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {data: products, isLoading, isError} = useProducts();

  const filteredProducts = useMemo(() => {
    if(!products){
      return [];
    }

    let filtered = Array.isArray(products) ? products : (products as any).products || [];

    // Filtering by category
    if(selectedCategory !== "All"){
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filtering by search query
    if(searchQuery.trim()){
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;

  }, [products, selectedCategory, searchQuery]);

  console.log(filteredProducts.length);

  return (
    <SafeScreen>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-3xl font-bold tracking-tight text-text-primary">Shop</Text>
              <Text className="mt-1 text-sm text-text-secondary">Browse all products</Text>
            </View>

            <TouchableOpacity 
              className="p-3 rounded-full bg-surface/50"
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={22} color={"#fff"} />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="flex-row items-center px-5 py-2 bg-surface rounded-2xl">
            <Ionicons name="search" size={22} color={"#666"} />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={"#666"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery} 
            />
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 20}}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;
              
              return (
                <TouchableOpacity 
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`}
                >
                  {category.icon ? (
                    <Ionicons name={category.icon} size={36} color={isSelected ? "#121212" : "#fff"} />
                  ) : (
                    <Image
                      source={category.image}
                      className="size-12"
                      resizeMode="contain" 
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-text-primary">Products</Text>
            <Text className="text-sm text-text-secondary">{filteredProducts.length} items</Text>
          </View>

          {/* PRODUCTS GRID */}
          <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default HomeScreen