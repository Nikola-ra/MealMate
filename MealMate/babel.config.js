module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // …any other custom plugins you have…
      "react-native-reanimated/plugin", // ← MUST be last :contentReference[oaicite:0]{index=0}
    ],
  }
}
