import { Image, Keyboard, Linking, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color } from '../constants/Color'

const CheckEmail = ({ navigation, route }) => {
    const { data } = route.params;

    const handleBackToLogin = () => {
        navigation.navigate('login');
    }

    const handleOpenEmeil = () => {
        Linking.openURL('mailto:').catch(() => {
            console.error('Impossible d’ouvrir l’application de messagerie');
          });
    };

    const resendHandler = async () => {
        try {
            const response = await axios.post('/reset-password', data);
            console.log(response.data);
            alert('reset code sent successfully!');
        } catch (error) {
            console.error('Error sending appointment request:', error);
            alert("Erreur lors de reset password");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Check Your Email</Text>
                        <Text style={styles.subtitle}>We have sent the reset password to the email address</Text>
                        <Text style={[styles.subtitle, { fontWeight: 'bold' }]}>{ data.email }</Text>
                    </View>
                    <Image source={require('../../assets/checkyouremail.png')} style={styles.image} />
                    <TouchableOpacity style={styles.openEmailButton} onPress={handleOpenEmeil}>
                        <Text style={styles.openEmailText}>OPEN YOUR EMAIL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backLoginButton} onPress={handleBackToLogin}>
                        <Text style={styles.backLoginText}>BACK TO LOGIN</Text>
                    </TouchableOpacity>
                    <View style={styles.reset}>
                        <Text style={styles.resetText}>You have not received the email?</Text>
                        <TouchableOpacity onPress={resendHandler}>
                            <Text style={styles.resetLinkText}>Resend</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default CheckEmail

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
    openEmailButton: {
        backgroundColor: Color.selectedbutton,
        margin: 20,
        paddingVertical: 20,
        borderRadius: 10,
    },
    openEmailText: {
        textAlign: 'center',
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14
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
    reset: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    resetLinkText: {
        color: Color.link,
        textDecorationLine: 'underline',
        fontSize: 12,
        fontWeight: '600',
    },
    resetText: {
        color: Color.subtitle,
        fontSize: 12,
        fontWeight: '400',
        marginRight: 10,
    },
})