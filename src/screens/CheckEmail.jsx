import {Image, Keyboard, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color } from '../constants/Color'
import { OtpInput } from 'react-native-otp-entry'
import { Controller, useForm } from 'react-hook-form'
import { checkyouremail } from '../../assets'
import {showToast} from "../utils/showToast";
import LoadingIndicator from "../components/LoadingIndicator";
import {useDispatch, useSelector} from "react-redux";
import {forgotPassword} from "../redux/actions/forgotPasswordAction";
import {checkEmail} from "../redux/actions/checkMailAction";

const CheckEmail = ({ navigation, route }) => {
    const {isLoading, otpIsValid, error} = useSelector((state)=> state.checkEmail);
    const [submittedEmail, setSubmittedEmail] = useState("");
    const dispatch = useDispatch();
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

    useEffect(() => {
        if(error){
            showToast('error',"Error during sending OTP code", error);
        }
    }, [error]);

    useEffect(() => {
        if(otpIsValid){
            navigation.navigate('newPassword', {email : submittedEmail});
        }
    }, [otpIsValid,submittedEmail, navigation]);

    const onSubmit = async (data) => {
        dispatch(checkEmail({email : route.params.email, otp: data.otp}))
        setSubmittedEmail(route.params.email);
    };

    const resendHandler = async () => {
        /*const apiResend = '/reset-password';
        try {
            const response = await axios.post(apiResend, data);
            console.log(response.data);
            alert('reset code sent successfully!');
        } catch (error) {
            console.error('Error sending appointment request:', error);
            alert("Erreur lors de reset password");
        }*/
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Check Your Email</Text>
                        <Text style={styles.subtitle}>We have sent the OTP code to the email address</Text>
                        <Text style={[styles.subtitle, { fontWeight: 'bold' }]}>{route.params?.email}</Text>
                    </View>
                    <Image source={checkyouremail} style={styles.image} />
                    <Controller
                        name='otp'
                        control={control}
                        rules={{
                            required: 'OTP is required',
                            pattern: {
                                value: /^\d{6}$/,
                                message: 'OTP must be a 6-digit number',
                            },
                            minLength: {
                                value: 6,
                                message: 'OTP must be 6 digits',
                            },
                            maxLength: {
                                value: 6,
                                message: 'OTP must be 6 digits',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <OtpInput
                                focusColor={Color.link}
                                onFocus={() => console.log("Focused")}
                                onBlur={onBlur}
                                onTextChange={onChange}
                                onFilled={(text) => {
                                    console.log(`OTP is ${text}`)
                                }}
                                theme={{
                                    containerStyle: styles.OTPcontainer,
                                    pinCodeContainerStyle: styles.OTPpinCodeContainer,
                                    pinCodeTextStyle: styles.OTPpinCodeText,
                                }}
                            />
                        )}
                    />
                    {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}
                    <TouchableOpacity style={styles.confirmCodeButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
                        <View style={styles.buttonContent}>
                            {!isLoading && <Text style={styles.confirmCodeText}>CONFIRM CODE</Text>}
                            <LoadingIndicator isLoading={isLoading} />
                        </View>
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
    confirmCodeButton: {
        backgroundColor: Color.selectedbutton,
        margin: 20,
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 10,
        height: 60, // Fixed height
        justifyContent: 'center', // Center content vertically
    },
    confirmCodeText: {
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
    OTPcontainer: {
        margin: 10,
        padding: 20,
    },
    OTPpinCodeContainer: {
        width: 50,
        height: 60,
    },
    OTPpinCodeText: {
        color: Color.link,
    },
    errorText: {
        color: "red",
        marginLeft: 30,
        fontWeight: '500'
    },
})