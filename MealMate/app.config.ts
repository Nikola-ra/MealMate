import "dotenv/config" // Load .env variables

export default {
  expo: {
    name: "MealMate",
    slug: "mealmate",
    version: "1.0.0",
    extra: {
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      EXPO_PUBLIC_CLERK_WEBHOOK_SECRET:
        process.env.EXPO_PUBLIC_CLERK_WEBHOOK_SECRET,
      EXPO_PUBLIC_MONGO_URI: process.env.EXPO_PUBLIC_MONGO_URI,
      EXPO_PUBLIC_NODE_ENV: process.env.EXPO_PUBLIC_NODE_ENV,
      EXPO_PUBLIC_PORT: process.env.EXPO_PUBLIC_PORT,
    },
  },
}
