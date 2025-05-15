import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useUser } from "@clerk/clerk-expo"

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
  const { user } = useUser()
  if (user == null) return null
  const id = user.id

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<number[]>([])

  const [ingredients, setIngredients] = useState([])

  const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY

  function fetchProducts() {
    if (!id) return
    fetch(`http://${process.env.EXPO_PUBLIC_SOCKET}/recipes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log(data.recipes)
        setIngredients(data.recipes)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [id])

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
            ingredients.join(",")
          )}&number=10&ranking=2&apiKey=${API_KEY}`
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

    if (ingredients.length !== 0) fetchRecipes()
    else return
  }, [ingredients])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  if (recipes.length == 0) {
    return (
      <>
        <View className="h-screen w-full items-center justify-center">
          <ActivityIndicator size="large" color="00ff00" />
        </View>
      </>
    )
  } else {
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
}
