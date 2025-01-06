import React, {useState} from "react";
import {View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, Dimensions, TextInput} from "react-native";
import {Color} from "../constants/Color";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Search} from "./index";
import { LinearGradient } from "expo-linear-gradient";


const TopNavBar = ({
                    title = "",
                    showBackButton = true,
                    onBackPress = () => {},
                    showProfile = true,
                    profilePicUri = "",
                    onProfilePress = () => {},
                    showNotification = true,
                    onNotificationPress = () => {},
                    showSearchBar = true
                   }) => {
    const insets = useSafeAreaInsets();
    return (
       <LinearGradient
           colors={["#38354c", "#3A317B"]}
           start={{ x: 0, y: 0 }}
           end={{ x: 1, y: 1 }}
           style={[styles.container,{paddingTop: insets.top}]}
       >
           <View style={styles.navBar}>
               {showBackButton && (
                   <TouchableOpacity onPress={onBackPress}>
                       <AntDesign
                           name="left"
                           size={24}
                           color={Color.icon}
                           style={styles.icon}
                       />
                   </TouchableOpacity>
               )}
               <Text style={styles.title}>{title}</Text>

               <View style={styles.rightIcons}>
                   {showNotification && (
                       <TouchableOpacity onPress={onNotificationPress}>
                           <AntDesign
                               name="notification"
                               size={24}
                               color={Color.icon}
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
           <View style={styles.searchBar}>
               {showSearchBar && <Search></Search>}
           </View>
       </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 100,
        flexDirection: "column",
        justifyContent: "flex-start",
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15
    },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 15,
        backgroundColor: "transparent",
        width: '100%',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        flex: 1,
        textAlign: 'center',
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
    },
    searchBar: {
        paddingHorizontal: 5,
        marginTop: 10,
        marginBottom: 20
    }
})

export default TopNavBar;
