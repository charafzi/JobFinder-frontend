import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EntrepriseHomeScreen from "../screens/EntrepriseHomeScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import AddJob from "../screens/AddJob";
import EntrepriseProjects from "../screens/EntrepriseProjects";
import { Color } from "../constants/Color";
import {useSelector} from "react-redux";
import SearchScreen from "../screens/SearchScreen";
import FilterScreen from "../screens/FilterScreen";
import MapScreen from "../screens/MapScreen";
import {Applications} from "../screens";

const Tab = createBottomTabNavigator();

const EntrepriseTabNavigation = () =>{
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
            <Tab.Screen
                name="home"
                component={EntrepriseHomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline"  size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="page2"
                component={EntrepriseHomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
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
                name="page4"
                component={FilterScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="page5"
                component={EntrepriseProjects}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="notifications-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const CandidatTabNavigation = () =>{
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
            <Tab.Screen
                name="home"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" size={size} color={Color.text} />
                    ),
                }}
            />
            <Tab.Screen
                name="applications"
                component={Applications}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="briefcase-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const BottomTabNavigation = () => {
    const { isCandidat} = useSelector((state) => state.auth);
    if(isCandidat){
        return <CandidatTabNavigation></CandidatTabNavigation>;
    }else{
        return <EntrepriseTabNavigation></EntrepriseTabNavigation>;
    }
};

export default BottomTabNavigation;
