import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EntrepriseHomeScreen from "../screens/EntrepriseHomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EntrepriseUsersScreen from "../screens/EntrepriseUsersScreen";
import AddJob from "../screens/AddJob";
import EntrepriseMessages from "../screens/EntrepriseMessages";
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
      }}
    >
      {/* Hidden tabs */}
      {/* {
                [
                    { name: "jobPreview", component: Job },
                ].map(screen => (
                    <Tab.Screen
                        key={screen.name}
                        name={screen.name}
                        component={screen.component}
                        options={{ tabBarButton: () => null }}
                    />
                ))
            } */}

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
        name="users"
        component={EntrepriseUsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
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
        name="Projects"
        component={EntrepriseProjects}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="messages"
        component={EntrepriseMessages}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="chat" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
