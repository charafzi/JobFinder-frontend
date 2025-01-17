import React, {useState} from "react";
import {
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    StyleSheet, 
    ImageBackground, 
    Dimensions, 
    TextInput
} from "react-native";
import {Color} from "../constants/Color";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Search} from "./index";
import {useNavigation} from "@react-navigation/native";

const NAVBAR_THEMES = {
    purple: {
        backgroundColor: "#3A317B",
        titleColor: "#fff",
        iconColor: Color.icon
    },
    default: {
        backgroundColor: Color.background,
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
    showSearchBar = false,
    theme = "default"
}) => {
    const insets = useSafeAreaInsets();
    const colorConfig = NAVBAR_THEMES[theme] || NAVBAR_THEMES.default;
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: colorConfig.backgroundColor, paddingTop: insets.top }
        ]}>
            <View style={styles.navBar}>
                {showBackButton && (
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <AntDesign name="left" size={24} color={colorConfig.iconColor} />
                    </TouchableOpacity>
                )}
                
                <Text style={[styles.title, { color: colorConfig.titleColor }]}>{title}</Text>

                <View style={styles.rightIcons}>
                    {showNotification && (
                        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
                            <AntDesign name="notification" size={24} color={colorConfig.iconColor} />
                        </TouchableOpacity>
                    )}
                    
                    {showProfile && (
                        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
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
        </View>
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
    iconButton: {
        padding: 4,
    },
    profileButton: {
        padding: 4,
        marginLeft: 8,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchBar: {
        paddingHorizontal: 5,
        marginTop: 10,
        marginBottom: 20
    }
});

export default TopNavBar;
