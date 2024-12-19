import { Keyboard, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import RegisterCandidat from '../components/RegisterCandidat';
import RegisterEntreprise from '../components/RegisterEntreprise';
import { Color } from '../constants/Color';

const Register = ({ navigation }) => {

    const [isCandidat, setIsCandidat] = useState(true);   

    const pressHandler = () => {
        navigation.navigate("login");
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Create an Account</Text>
                        <View style={styles.userType}>
                            <TouchableOpacity
                                style={[styles.userTypeButton, { backgroundColor: isCandidat ? Color.selectedbutton : Color.unselectedbutton }]}
                                onPress={() => { setIsCandidat(true) }}
                            >
                                <Text style={styles.userTypeText}>CANDIDAT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.userTypeButton, { backgroundColor: !isCandidat ? Color.selectedbutton : Color.unselectedbutton }]}
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
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>


    )
}

export default Register

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
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 30,
        marginBottom: 20,
        color: Color.text,
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
        fontSize: 14,
        fontWeight:'700',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
    },
    loginLinkText: {
        color: Color.link,
        textDecorationLine: 'underline',
        fontSize: 12,
        fontWeight:'600',
    },
    loginText: {
        color: Color.subtitle,
        fontSize: 12,
        fontWeight:'400',
        marginRight: 10,
    },

})