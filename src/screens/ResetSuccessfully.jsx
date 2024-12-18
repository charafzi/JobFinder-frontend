import { Image, Keyboard, Linking, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color } from '../../constants/Color'

const ResetSuccessfully = ({ navigation }) => {

    const handleBackToLogin = () => {
        navigation.navigate('login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Successfully</Text>
                        <Text style={[styles.subtitle, {lineHeight:20}]}>Your password has been updated, please change your password regularly to avoid this happening</Text>
                    </View>
                    <Image source={require('../../assets/resetsuccessfully.png')} style={styles.image} />
                    <TouchableOpacity style={styles.backLoginButton} onPress={handleBackToLogin}>
                        <Text style={styles.backLoginText}>BACK TO LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ResetSuccessfully

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.background,
    },
    headerContainer: {
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontWeight: '700',
        fontSize: 30,
        padding: 20,
        color: Color.text,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '400',
        textAlign: "center",
        color: Color.subtitle,
    },
    backLoginButton: {
        backgroundColor: Color.unselectedbutton,
        marginHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
    },
    backLoginText: {
        textAlign: 'center',
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14
    },
    image: {
        alignSelf: 'center',
        padding: 10,
        margin: 60,
    },
})