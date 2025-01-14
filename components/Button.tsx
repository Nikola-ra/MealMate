import { ReactNode } from "react"
import { Text, View } from "react-native"

export function Button({ children }: { children: ReactNode }) {
  return (
    <View>
      <Text>{children}</Text>
    </View>
  )
}
