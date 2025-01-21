import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AddJob from "../screens/AddJob";
import EntrepriseHomeScreen from "../screens/EntrepriseHomeScreen";
import EntrepriseProjects from "../screens/EntrepriseProjects";
import { Color } from "../constants/Color";
import { useSelector } from "react-redux";
import SearchScreen from "../screens/SearchScreen";
import MapScreen from "../screens/MapScreen";
import {Applications} from "../screens";
import { MyTabBar } from "../components/MyTabBar";

const Tab = createBottomTabNavigator();

const EntrepriseTabNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName="home"
            backBehavior="history"
            screenOptions={{
                headerShown: false,
            }}
            tabBar={props => <MyTabBar {...props} />}
        >
            <Tab.Screen
                name="home"
                component={EntrepriseHomeScreen}
                options={{
                    tabBarIcon: (props) => (
                        <Ionicons name="home-outline" {...props} />
                    ),
                    tabBarLabel: "Home",
                }}
            />
            <Tab.Screen
                name="addJob"
                component={AddJob}
                options={{
                    tabBarIcon: (props) => (
                        <AntDesign name="pluscircle" {...props} />
                    ),
                    tabBarLabel: "Add Job",
                }}
            />
            <Tab.Screen
            
                name="entrepriseProjects"
                component={EntrepriseProjects}
                options={{
                    tabBarIcon: (props) => (
                        <Ionicons name="briefcase-outline" {...props} />
                    ),
                    tabBarLabel: "Projects",
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
                headerShown: false,
                tabBarShowLabel: false,
            }}
            tabBar={props => <MyTabBar {...props} />}
        >
            <Tab.Screen
                name="home"
                component={SearchScreen}
                options={{
                    tabBarIcon: (props) => (
                        <Ionicons name="home-outline" {...props} />
                    ),
                    tabBarLabel: "Home",
                }}
            />
            <Tab.Screen
                name="map"
                component={MapScreen}
                options={{
                    tabBarIcon: (props) => (
                        <Ionicons name="map" {...props} />
                    ),
                    tabBarLabel: "Map",
                }}
            />
            <Tab.Screen
                name="applications"
                component={Applications}
                options={{
                    tabBarIcon: (props) => (
                        <Ionicons name="briefcase-outline" {...props} />
                    ),
                    tabBarLabel: "Candidatures",
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
