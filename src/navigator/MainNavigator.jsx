import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  CheckEmail,
  ForgotPassword,
  JobPreview,
  Login,
  LogoScreen,
  NewPassword,
  Register,
  ResetSuccessfully,
  Welcome,
  EntrepriseHomeScreen, ApplicationApply, ApplicationDetails, Applications,
  Filter,
} from "../screens";
import TabNavigator from "./BottomTabNavigator";
import CompanyProfile from "../screens/CompanyProfile";
import CandidatProfile from '../screens/CandidatProfile';
import UploadCV from '../screens/UploadCV';
import UploadCVSuccess from '../screens/UploadCVSuccess';
import EditProfileCandidat from '../screens/EditProfileCandidat';
import EditCompanyProfile from '../screens/EditCompanyProfile';
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? "tabNavigator" : "login"} >
      <Stack.Screen name="tabNavigator" component={TabNavigator} />
      <Stack.Screen name="logoscreen" component={LogoScreen} />
      <Stack.Screen name="welcome" component={Welcome} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
      <Stack.Screen name="forgotpassword" component={ForgotPassword} />
      <Stack.Screen name="checkEmail" component={CheckEmail} />
      <Stack.Screen name="newPassword" component={NewPassword} />
      <Stack.Screen name="resetSuccessfully" component={ResetSuccessfully} />
      <Stack.Screen name="jobPreview" component={JobPreview} />
      <Stack.Screen name="applications" component={Applications} />
      <Stack.Screen name="applicationDetails" component={ApplicationDetails} />
      <Stack.Screen name="applicationApply" component={ApplicationApply} />
      <Stack.Screen name="UploadCV" component={UploadCV} />
      <Stack.Screen name="UploadCVSuccess" component={UploadCVSuccess} />
      <Stack.Screen name="EditProfileCandidat" component={EditProfileCandidat} />
      <Stack.Screen name="EditCompanyProfile" component={EditCompanyProfile} />
      <Stack.Screen name="entreprise" component={EntrepriseHomeScreen} />
      <Stack.Screen name="company" component={CompanyProfile} />
      <Stack.Screen name="candidat" component={CandidatProfile} />
      <Stack.Screen name="Filter" component={Filter} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
