import { Button } from "@/components/Button"
import { View, Text, StyleSheet } from "react-native"

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab [Home|Settings]</Text>
      <Button>Aimen</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
