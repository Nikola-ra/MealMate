import React, { useEffect, useState, useCallback, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StyleSheet,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useUser } from "@clerk/clerk-expo"
import LottieView from "lottie-react-native"
import ScanButton from "@/components/ScanButton"
import ErrorModal from "@/components/ErrorModal"

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
  const [refreshing, setRefreshing] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)

  const [loading, setLoading] = useState(true)

  const API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY

  const fetchProducts = useCallback(() => {
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
        setIngredients(data.recipes)
      })
      .catch(error => {
        console.error("Error fetching data:", error)
      })
  }, [id])

  const animation = useRef<LottieView>(null)
  //animation
  useEffect(() => {
    animation.current?.play()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const fetchRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setRecipes([])
      return
    }

    try {
      setLoading(true)
      // 1️⃣ Find matching recipes by ingredients
      const findRes = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?` +
          `ingredients=${encodeURIComponent(ingredients.join(","))}` +
          `&number=10&ranking=2&apiKey=${API_KEY}`
      )
      if (!findRes.ok) throw new Error(`Find error: ${findRes.status}`)
      const found = await findRes.json()

      // 2️⃣ Extract just the IDs
      const ids = found.map((r: any) => r.id)

      // 3️⃣ Fetch detailed info in bulk
      const infoRes = await fetch(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${ids.join(
          ","
        )}&apiKey=${API_KEY}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
      if (!infoRes.ok) throw new Error(`Bulk info error: ${infoRes.status}`)
      const details = await infoRes.json()

      // 4️⃣ Map into your Recipe[] shape
      const formatted: Recipe[] = details.map((r: any) => {
        const calorieInfo = r.nutrition?.nutrients?.find(
          (n: any) => n.name === "Calories"
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

      // 5️⃣ Update state
      setRecipes(formatted)
      setLoading(false)
    } catch (err) {
      setErrorModalVisible(true)
      console.error("Error fetching recipes:", err)
    }
  }, [ingredients, API_KEY])

  useEffect(() => {
    if (ingredients.length !== 0) fetchRecipes()
  }, [ingredients, fetchRecipes])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchProducts()
    // fetchProducts will update ingredients, which triggers fetchRecipes via useEffect
    setRefreshing(false)
  }, [fetchProducts])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <View className="flex-1 w-full justify-center items-center gap-5">
        <ErrorModal
          isVisible={errorModalVisible}
          onClose={() => setErrorModalVisible(false)}
          additionalText="This error is temporary and we are working on it!"
        ></ErrorModal>
        <Text className="text-2xl font-semibold">Fetching your recipes...</Text>
        <ActivityIndicator size="large" color="#008000" />
      </View>
    )
  } else {
    if (recipes.length == 0) {
      return (
        <View className="w-full flex-1 flex items-center justify-center">
          <ErrorModal
            isVisible={errorModalVisible}
            onClose={() => setErrorModalVisible(false)}
            additionalText="This error is temporary and we are working on it!"
          ></ErrorModal>
          <Text className="text-2xl font-semibold">
            No Products for your recipes yet!
          </Text>
          <LottieView
            ref={animation}
            source={require("@/assets/animations/noProducts.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      )
    }
    return (
      <View className="flex-1 bg-white">
        <ErrorModal
          isVisible={errorModalVisible}
          onClose={() => setErrorModalVisible(false)}
          additionalText="This error is temporary and we are working on it!"
        ></ErrorModal>
        <FlatList
          data={recipes}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

const { width } = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
  },
})
