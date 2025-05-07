import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"

type Recipe = {
  id: number
  title: string
  image: string
  url: string
  source: string
  diets: string[]
  calories: number | string
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

  const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY // replace with your Spoonacular API key
  const ingredients = ["chicken", "tomato", "cheese"]

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(
            ","
          )}&number=10&ranking=1&apiKey=${API_KEY}`
        )
        const data = await res.json()

        const detailPromises = data.map((recipe: any) =>
          fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=${API_KEY}`
          ).then(res => res.json())
        )

        const details = await Promise.all(detailPromises)

        const formatted: Recipe[] = details.map((r: any) => {
          const calorieInfo = r.nutrition?.nutrients?.find(
            (n: any) => n.title === "Calories"
          )
          return {
            id: r.id,
            title: r.title,
            image: r.image,
            url: r.sourceUrl,
            source: new URL(r.sourceUrl).hostname.replace("www.", ""),
            diets: r.diets,
            calories: calorieInfo ? Math.round(calorieInfo.amount) : "N/A",
          }
        })

        setRecipes(formatted)
      } catch (err) {
        console.error("Error fetching recipes:", err)
      }
    }

    fetchRecipes()
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={recipes}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.url)}
            className="bg-white mx-4 mb-4 p-3 rounded-2xl shadow flex-row items-center"
          >
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-xl mr-3"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-black">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500">{item.source}</Text>
              <Text className="text-xs text-gray-400 mt-1">
                {item.diets.length > 0
                  ? item.diets.join(", ")
                  : "Nessuna etichetta"}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">
                Calorie: {item.calories}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <FontAwesome
                name={favorites.includes(item.id) ? "heart" : "heart-o"}
                size={20}
                color={favorites.includes(item.id) ? "#ef4444" : "#9ca3af"}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}
