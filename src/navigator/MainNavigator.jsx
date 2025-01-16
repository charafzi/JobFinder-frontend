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
    Map, Search, Filter,
    EntrepriseHomeScreen,
} from "../screens";
import { TabNavigator } from ".";
import CompanyProfile from "../screens/CompanyProfile";
import CandidatProfile from '../screens/CandidatProfile';
import UploadCV from '../screens/UploadCV';
import UploadCVSuccess from '../screens/UploadCVSuccess';
import EditProfileCandidat from '../screens/EditProfileCandidat';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="candidat">
      <Stack.Screen name="UploadCV" component={UploadCV} />
      <Stack.Screen name="UploadCVSuccess" component={UploadCVSuccess} />
      <Stack.Screen name="EditProfileCandidat" component={EditProfileCandidat} />
      <Stack.Screen name="logoscreen" component={LogoScreen} />
      <Stack.Screen name="welcome" component={Welcome} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="forgotpassword" component={ForgotPassword} />
      <Stack.Screen name="checkEmail" component={CheckEmail} />
      <Stack.Screen name="newPassword" component={NewPassword} />
      <Stack.Screen name="resetSuccessfully" component={ResetSuccessfully} />
      <Stack.Screen name="tabNavigator" component={TabNavigator} />
      <Stack.Screen name={"Map"} component={Map}/>
      <Stack.Screen name={"Search"} component={Search}></Stack.Screen>
      <Stack.Screen name={"Filter"} component={Filter}></Stack.Screen>
      <Stack.Screen name={"entreprise"} component={EntrepriseHomeScreen}></Stack.Screen>
      <Stack.Screen name={"company"} component={CompanyProfile}></Stack.Screen>
      <Stack.Screen name={"candidat"} component={CandidatProfile}></Stack.Screen>
    </Stack.Navigator>
  );
};
export default StackNavigator;
