import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ForgotPassword from "./src/screens/ForgotPassword";
import Welcome from "./src/screens/Welcome";
import LogoScreen from "./src/screens/LogoScreen";
import CheckEmail from "./src/screens/CheckEmail";
import ResetSuccessfully from "./src/screens/ResetSuccessfully";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="logoscreen"
      >
        <Stack.Screen name="logoscreen" component={LogoScreen} />
        <Stack.Screen name="welcome" component={Welcome} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="forgotpassword" component={ForgotPassword} />
        <Stack.Screen name="checkEmail" component={CheckEmail} />
        <Stack.Screen name="resetSuccessfully" component={ResetSuccessfully} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

