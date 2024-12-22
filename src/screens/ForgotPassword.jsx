import { Image, Keyboard, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color } from '../constants/Color'
import { Controller, useForm } from 'react-hook-form'
import { forgotpassword } from '../../assets'

const ForgotPassword = ({ navigation }) => {

    const {
        control,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm();

    const handleBackToLogin = () => {
        navigation.navigate('login');
    }

    const submit = async (data) => {
        try {
            const response = await axios.post('/reset-password', data);
            navigation.navigate('checkEmail', {data});
            console.log(response.data);
            alert('reset code sent');
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
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={[styles.subtitle, {lineHeight:20}]}>To reset your password, you need your email or mobile number that can be authenticated</Text>
                    </View>
                    <Image source={forgotpassword} style={styles.image}/>
                    <Text style={styles.inputTitle}>Email</Text>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                placeholder='Brandonelouis@gmail.com'
                                placeholderTextColor={Color.placeholderText}
                                value={value}
                                style={[styles.textInput, value && { fontWeight: "600" }]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType='email-address'
                                autoComplete='email'
                            />
                        )}
                        rules={{
                            required: true, pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Votre email pas correct"
                            }
                        }}
                    />
                    {errors?.email?.type === "required" && <Text style={styles.errorText}>Veuillez saisir votre email</Text>}
                    {errors?.email?.type === "pattern" && <Text style={styles.errorText}>{errors?.email?.message}</Text>}

                    <TouchableOpacity style={styles.resetButton} onPress={handleSubmit(submit)}>
                        <Text style={styles.resetText}>RESET PASSWORD</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backLoginButton} onPress={handleBackToLogin}>
                        <Text style={styles.backLoginText}>BACK TO LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ForgotPassword

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
    inputTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Color.text,
    },
    textInput: {
        marginVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        height: 50,
    },
    errorText: {
        color: "red"
    },
    resetButton: {
        backgroundColor: Color.selectedbutton,
        margin: 20,
        paddingVertical: 20,
        borderRadius: 10,
    },
    resetText: {
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
        alignSelf:'center',
        padding:10,
        margin:60,
    },
})