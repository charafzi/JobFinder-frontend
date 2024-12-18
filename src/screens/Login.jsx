import { Image, Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import FormLogin from '../components/FormLogin';
import { Color } from '../../constants/Color';



const Login = ({ navigation }) => {
    const pressHandler = () => {
        navigation.navigate("register");
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Please enter your details to sign in</Text>
                    </View>
                    <FormLogin />
                    <TouchableOpacity style={styles.googleButton}>
                        <Image source={require('../../assets/google.png')} style={styles.googleIcon} />
                        <Text style={styles.googleText}>SIGN IN WITH GOOGLE</Text>
                    </TouchableOpacity>
                    <View style={styles.signup}>
                        <Text style={styles.signupText}>You don't have an account yet?</Text>
                        <TouchableOpacity onPress={pressHandler}>
                            <Text style={styles.signupLinkText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: Color.background,
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: "center",
    },
    title: {
        textAlign:'center',
        fontWeight: '700',
        fontSize: 30,
        padding: 10,
        color: Color.text,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '400',
        textAlign: "center",
        color: Color.subtitle,
        marginBottom: 20,
    },
    signup: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    signupLinkText: {
        color: Color.link,
        textDecorationLine: 'underline',
        fontSize: 12,
        fontWeight: '600',
    },
    signupText: {
        color: Color.subtitle,
        fontSize: 12,
        fontWeight: '400',
        marginRight: 10,
    },
    googleButton: {
        flexDirection: "row",
        justifyContent: 'space-around',
        backgroundColor: Color.unselectedbutton,
        padding: 20,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    googleText: {
        fontSize: 14,
        fontWeight: '700',
        color: Color.selectedbutton,
        fontWeight: 'bold',
    },
    googleIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
})