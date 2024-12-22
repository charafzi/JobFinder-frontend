import { StyleSheet, Text, TextInput, TouchableOpacity, View , Alert} from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import Feather from '@expo/vector-icons/Feather';
import { Color } from '../constants/Color';
import axiosInstance from '../config/axiosConfig';
import { useNavigation } from 'expo-router';

const NewPasswordForm = () => {
    const [securePassword, setSecurePassword] = useState(true);
    const navigation = useNavigation();
    const {
        control,
        handleSubmit,
        watch,
        formState: {
            errors
        }
    } = useForm();

    const submit = async (data) => {
        const apiUpdatePassword = "/UpdatePassword";
        console.log(data);
        axiosInstance.post(apiUpdatePassword, data)
        .then(response => {
            navigation.navigate('resetSuccessfully');
            console.log("Status Code:", response.status);
            Alert.alert("Update Password Success", "Your password was updated successfully. Login to access your account.");
        })
        .catch(error => {
            Alert.alert("Update Password Error", "Error during updating your password. Please try again.");
            console.log("Status Code:", response.status);
        });
    };
    return (
        <View>
            <Text style={styles.inputTitle}>Password</Text>
            <Controller
                name='password'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[styles.textInputContainer]}>
                        <TextInput
                            placeholder='Enter Password'
                            placeholderTextColor={Color.placeholderText}
                            autoComplete='new-password'
                            secureTextEntry={securePassword}
                            value={value}
                            onBlur={onBlur}
                            style={{ flex: 1 }}
                            onChangeText={onChange}
                        />
                        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
                            {securePassword ? (
                                <Feather name="eye-off" size={24} color="#60778C" />
                            ) : (
                                <Feather name="eye" size={24} color="#60778C" />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
                rules={{
                    required: 'Veuillez saisir votre mot de passe',
                    minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' },
                }}
            />
            {errors?.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

            <Text style={styles.inputTitle}>Confirm Password</Text>
            <Controller
                name='confirmPassword'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[styles.textInputContainer]}>
                        <TextInput
                            placeholder='Confirm Password'
                            placeholderTextColor={Color.placeholderText}
                            autoComplete='new-password'
                            secureTextEntry={securePassword}
                            value={value}
                            onBlur={onBlur}
                            style={{ flex: 1 }}
                            onChangeText={(text) => {
                                onChange(text); // Mettre à jour la valeur
                            }}
                        />
                        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
                            {securePassword ? (
                                <Feather name="eye-off" size={24} color="#60778C" />
                            ) : (
                                <Feather name="eye" size={24} color="#60778C" />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
                rules={{
                    required: 'Veuillez confirmer votre mot de passe',
                    validate: value =>
                        value === watch('password') || 'Les mots de passe ne correspondent pas',
                }}
            />
            {errors?.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
            )}

            <TouchableOpacity style={styles.submitButton}
                onPress={handleSubmit(submit)}
            >
                <Text style={styles.submitText}>RESET PASSWORD</Text>
            </TouchableOpacity>
        </View>
  )
}

export default NewPasswordForm

const styles = StyleSheet.create({
    inputTitle: {
        fontWeight: '700',
        fontSize: 12,
        color: Color.text,
    },
    textInput: {
        marginVertical: 10,
        paddingHorizontal:20,
        backgroundColor:'#FFFFFF',
        borderRadius: 10,
        height: 50,
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 10,
        marginBottom:30,
        backgroundColor:'#FFFFFF',
        borderRadius: 10,
        height: 60,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: Color.selectedbutton,
        marginHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
    },
    submitText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
        textAlign: 'center',
    },
    errorText: {
        color: "red",
        fontWeight:'500',
        paddingBottom:10,
    },
})