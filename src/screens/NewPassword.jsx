import { Image, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { Color } from '../constants/Color';
import { newpassword } from '../../assets';
import NewPasswordForm from "../components/NewPasswordForm";

const NewPassword = ({route}) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Enter your new password. The new password must be different from the old one.</Text>
                    </View>
                    <Image source={newpassword} style={styles.image} />
                    <NewPasswordForm email={route.params.email} />
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default NewPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: Color.background,
    },
    headerContainer: {
        marginTop:70,
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
        lineHeight:20
    },
    image: {
        alignSelf: 'center',
        margin: 40,
    },
    errorText: {
        color: "red",
        marginLeft: 30,
        fontWeight: '500'
    },
})