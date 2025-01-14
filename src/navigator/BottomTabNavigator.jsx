import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EntrepriseHomeScreen from "../screens/EntrepriseHomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import AddJob from "../screens/AddJob";
import EntrepriseProjects from "../screens/EntrepriseProjects";
import { Color } from "../constants/Color";

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: Color.text,
        tabBarInactiveTintColor: Color.tabBarInactiveTintColor,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { position: 'absolute' },
      }}
    >
      <Tab.Screen
        name="home"
        component={EntrepriseHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="addJob"
        component={AddJob}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" size={size} color={Color.text} />
          ),
        }}
      />
      <Tab.Screen
        name="entrepriseProjects"
        component={EntrepriseProjects}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="briefcase" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
