import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text } from "react-native";
import Login from "./src/screens/Login";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Register from "./src/screens/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ForgotPassword from "./src/screens/ForgotPassword";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="login"
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="forgotpassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
});
