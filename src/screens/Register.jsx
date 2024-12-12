import { Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import RegisterCandidat from '../components/RegisterCandidat';
import { useNavigation } from '@react-navigation/native';
import RegisterEntreprise from '../components/RegisterEntreprise';

const Register = () => {

    const [isCandidat, setIsCandidat] = useState(true);
    const navigation = useNavigation();

    const pressHandler = () => {
        navigation.navigate("login");
    }

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView>
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Create an Account</Text>
                            <View style={styles.userType}>
                                <TouchableOpacity
                                    style={[styles.userTypeButton, { backgroundColor: isCandidat ? 'blue' : 'green' }]}
                                    onPress={() => { setIsCandidat(true) }}
                                >
                                    <Text style={styles.userTypeText}>CANDIDAT</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.userTypeButton, { backgroundColor: !isCandidat ? 'blue' : 'green' }]}
                                    onPress={() => { setIsCandidat(false) }}
                                >
                                    <Text style={styles.userTypeText}>ENTREPRISE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {isCandidat ?
                            <RegisterCandidat /> :
                            <RegisterEntreprise />
                        }
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>You already have an account?</Text>
                            <TouchableOpacity onPress={pressHandler}>
                                <Text style={styles.loginLinkText}>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>

    )
}

export default Register

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
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 35,
        padding: 10,
        paddingBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
    },

    userType: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    userTypeButton: {
        borderRadius: 10,
        marginHorizontal: 10,
        width: 150,
        height: 50,
        justifyContent: "center"
    },
    userTypeText: {
        color: 'white',
        textAlign: "center",
        fontWeight: "bold",
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    loginLinkText: {
        color: 'gold',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    loginText: {
        color: 'blue',
        fontSize: 14,
        marginRight: 10,
    },

})