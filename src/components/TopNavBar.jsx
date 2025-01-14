import React, {useState} from "react";
import {View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, Dimensions, TextInput} from "react-native";
import {Color} from "../constants/Color";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Search} from "./index";
import { LinearGradient } from "expo-linear-gradient";
import {useNavigation} from "@react-navigation/native";

const NAVBAR_THEMES = {
    purple: {
        colors: ["#38354c", "#3A317B"],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        titleColor: "#fff",
        iconColor: Color.icon
    },
    default: {
        colors: [Color.background, Color.background],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        titleColor: Color.text,
        iconColor: Color.text
    },
};

const TopNavBar = ({
                    title = "",
                    showBackButton = true,
                    onBackPress,
                    showProfile = true,
                    profilePicUri = "",
                    onProfilePress = () => {},
                    showNotification = true,
                    onNotificationPress = () => {},
                    theme = "default"
                   }) => {
    const insets = useSafeAreaInsets();
    const colorConfig = NAVBAR_THEMES[theme] || NAVBAR_THEMES.default;
    const navigation = useNavigation();

    const handleBackPress =() =>{
        if (onBackPress) {
            // If custom onBackPress is provided, use it
            onBackPress();
        } else {
            navigation.goBack();
        }

    }

    return (
       <LinearGradient
           colors={colorConfig.colors}
           start={colorConfig.start}
           end={colorConfig.end}
           style={[styles.container,{paddingTop: insets.top}]}
       >
           <View style={[styles.navBar] }>
               {showBackButton && (
                   <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                       <AntDesign
                           name="left"
                           size={24}
                           color={colorConfig.iconColor}
                           style={styles.icon}
                       />
                   </TouchableOpacity>
               )}
               <Text style={[styles.title, colorConfig.titleColor]}>{title}</Text>

               <View style={styles.rightIcons}>
                   {showNotification && (
                       <TouchableOpacity onPress={onNotificationPress}>
                           <AntDesign
                               name="notification"
                               size={24}
                               color={colorConfig.iconColor}
                               style={styles.icon}
                           />
                       </TouchableOpacity>
                   )}

                   {showProfile && (
                       <TouchableOpacity onPress={onProfilePress}>
                           <Image
                               source={{
                                   uri: profilePicUri || "https://via.placeholder.com/40",
                               }}
                               style={styles.profilePic}
                           />
                       </TouchableOpacity>
                   )}
               </View>
           </View>
       </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 40,
        flexDirection: "column",
        justifyContent: "flex-start",
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "transparent",
        width: '100%',
        height: 80
    },
    backButton: {
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    rightIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    icon: {
        padding: 4,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 8,
    }
})

export default TopNavBar;
