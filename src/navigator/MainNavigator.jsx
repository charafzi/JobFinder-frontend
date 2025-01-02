import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  CheckEmail,
  ForgotPassword,
  Login,
  LogoScreen,
  NewPassword,
  Register,
  ResetSuccessfully,
  Welcome,
} from "../screens";
import { TabNavigator } from ".";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="logoscreen" component={LogoScreen} />
      <Stack.Screen name="welcome" component={Welcome} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="forgotpassword" component={ForgotPassword} />
      <Stack.Screen name="checkEmail" component={CheckEmail} />
      <Stack.Screen name="newPassword" component={NewPassword} />
      <Stack.Screen name="resetSuccessfully" component={ResetSuccessfully} />
      <Stack.Screen name="tabNavigator" component={TabNavigator} />
      <Stack.Screen name="resetSuccessfully" component={ResetSuccessfully} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
