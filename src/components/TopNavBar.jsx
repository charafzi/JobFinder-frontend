import React, { useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import {Color} from "../constants/Color";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { CANDIDAT_IMAGE_URL, ENTREPRISE_IMAGE_URL } from "../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUnreadNotificationsCount } from "../redux/slices/notifications/notificationsThunks";

const NAVBAR_THEMES = {
    purple: {
        colors: ['#3A317B', '#2D2665'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
        titleColor: "#fff",
        iconColor: Color.icon
    },
    default: {
        colors: [Color.background, Color.background],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
        titleColor: Color.text,
        iconColor: Color.text
    },
};

const TopNavBar = React.memo(({
    title = "",
    showBackButton = true,
    showWelcome = false,
    onBackPress,
    showProfile = true,
    showNotification = true,
    borderRadius = true,
    theme = "default"
}) => {
    const { isCandidat, id, email, entreprise } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const colorConfig = NAVBAR_THEMES[theme] || NAVBAR_THEMES.default;
    const navigation = useNavigation();

    useEffect(() => {
        if (id && showNotification) {
            dispatch(getUnreadNotificationsCount(id));
        }
    }, [id, showNotification]);

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }

    }

    const onProfilePress = () => {
        if (isCandidat) {
            navigation.navigate('candidat');
        } else {
            navigation.navigate('company');
        }
    }

    const handleNotificationPress = () => {
        navigation.navigate('notifications');
    }

    return (
        <LinearGradient
            colors={colorConfig.colors}
            start={colorConfig.start}
            end={colorConfig.end}
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    borderBottomRightRadius: borderRadius ? 15 : 0,
                    borderBottomLeftRadius: borderRadius ? 15 : 0,
                }
            ]}
        >
            <View style={[styles.navBar]}>
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
                {showWelcome &&
                    <View style={styles.headerContainer}>
                        <Text style={styles.name}>Welcome Back</Text>
                        <Text style={[styles.name, { color: '#BEAFFE' }]}>{entreprise.name}</Text>
                        <Text style={styles.name}>!</Text>
                    </View>
                }
                <Text style={[styles.title, colorConfig.titleColor]}>{title}</Text>

                <View style={styles.rightIcons}>
                    {showNotification && (
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={handleNotificationPress}
                        >
                            <Ionicons name="notifications-outline" size={24} color={colorConfig.iconColor} />
                            {unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    {showProfile && (
                        <TouchableOpacity onPress={onProfilePress}>
                            {id ? (
                                <Image
                                    source={{ uri: isCandidat ? CANDIDAT_IMAGE_URL + id : ENTREPRISE_IMAGE_URL + id }}
                                    style={styles.profilePic}
                                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                                />
                            ) : (
                                <View style={[styles.profilePic, styles.defaultAvatarContainer]}>
                                    <MaterialCommunityIcons name="account-circle" size={40} color={Color.text} />
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
});

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
    iconButton: {
        padding: 4,
        position: 'relative',
    },
    profileButton: {
        padding: 4,
        marginLeft: 8,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    defaultAvatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    headerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "left",
        color: Color.background,
    },
    badge: {
        position: 'absolute',
        right: -3,
        top: -2,
        backgroundColor: Color.secondary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    }
});

export default TopNavBar;
