import { Stack } from "expo-router"

const layout = () => {
    return <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="[Cali]" options={{ headerShown: false, animation: 'simple_push', animationDuration: 100 }} />
          <Stack.Screen name="modal" options={{ headerShown: false, presentation: 'fullScreenModal', animation: "slide_from_right", animationDuration: 100, gestureEnabled: true, gestureDirection: 'horizontal' }} />
        </Stack>
}

export default layout;