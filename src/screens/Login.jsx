import { Image, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import FormLogin from '../components/FormLogin';



const Login = () => {
    const navigation = useNavigation();
    const pressHandler = () => {
        navigation.navigate("register");
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Lorem ipsum dolor sit amet</Text>
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
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>



    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical:10,
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
    signup: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    signupLinkText: {
        color: 'gold',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    signupText: {
        color: 'blue',
        fontSize: 14,
        marginRight: 10,
    },
    googleButton: {
        flexDirection: "row",
        justifyContent: 'space-around',
        backgroundColor: 'lightblue',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    googleText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    googleIcon: {
        width: 30,
        height: 30,
    },
})