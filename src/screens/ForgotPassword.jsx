import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const ForgotPassword = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>To reset your password, you need your email or mobile number that can be authenticated</Text>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    headerContainer: {
        paddingVertical: 30,
        alignItems: "center",
    },
    title: {
        fontWeight: '700',
        fontSize: 35,
        padding: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
    },
})