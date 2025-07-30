import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { QueryProvider } from "./providers/QueryProvider";
import { AppNavigator } from "./navigation/AppNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <QueryProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <StatusBar hidden />
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
