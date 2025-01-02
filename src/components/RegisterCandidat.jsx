import { StyleSheet, Text, TextInput, TouchableOpacity, View , Alert} from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import Feather from '@expo/vector-icons/Feather';
import { Color } from '../constants/Color';
import axiosInstance from '../config/axiosConfig';
import {showToast} from "../utils/showToast";

const RegisterCandidat = () => {
    const [securePassword, setSecurePassword] = useState(true);
    const {
        control,
        handleSubmit,
        watch,
        formState: {
            errors
        }
    } = useForm();

    const submit = async (data) => {
        const apiRegisterCandidat = "/api/auth/registerCandidat";
        console.log(data);
        axiosInstance.post(apiRegisterCandidat, data)
        .then(response => {
            console.log("Status Code:", response.status);
            showToast('success',"Your account was registered successfully. Login to access your account.");
        })
        .catch(error => {
            showToast('error',"Register Error","Error during registering your account. Please try again.");
            console.log("Status Code:", response.status);
        });
    };
    return (
        <View>
            <Text style={styles.inputTitle}>First Name</Text>
            <Controller
                name='firstName'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Brandone'
                        placeholderTextColor={Color.placeholderText}
                        value={value}
                        style={[styles.textInput, value && { fontWeight: "600" }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                    />
                )}
                rules={{ required: true, minLength: 2 }}
            />
            {errors?.firstName?.type === "required" && <Text style={styles.errorText}>Veuillez saisir votre prenom complet</Text>}
            {errors?.firstName?.type === "minLength" && <Text style={styles.errorText}>Votre prenom pas correct</Text>}

            <Text style={styles.inputTitle}>Last Name</Text>
            <Controller
                name='lastName'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Louis'
                        placeholderTextColor={Color.placeholderText}
                        value={value}
                        style={[styles.textInput, value && { fontWeight: "600" }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                    />
                )}
                rules={{ required: true, minLength: 3 }}
            />
            {errors?.lastName?.type === "required" && <Text style={styles.errorText}>Veuillez saisir votre nom complet</Text>}
            {errors?.lastName?.type === "minLength" && <Text style={styles.errorText}>Votre nom pas correct</Text>}

            <Text style={styles.inputTitle}>Phone Number</Text>
            <Controller
                name='phoneNumber'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='+2126 55 55 11 22'
                        placeholderTextColor={Color.placeholderText}
                        value={value}
                        style={[styles.textInput, value && { fontWeight: "600" }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType='number-pad'
                    />
                )}
                rules={{ required: true, pattern: { value: /^((\+212|0)[\s]?[6|7][\s]?\d{2}[\s]?\d{2}[\s]?\d{2}[\s]?\d{2})$/, message: "Entrer un numéro de téléphone valide" } }}
            />
            {errors?.phoneNumber?.type === "required" && <Text style={styles.errorText}>Veuillez saisir Votre téléphone</Text>}
            {errors?.phoneNumber?.type === "pattern" && <Text style={styles.errorText}>Entrer un numéro de téléphone valide</Text>}

            <Text style={styles.inputTitle}>Email</Text>
            <Controller
                name='email'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Brandonelouis@gmail.com '
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
                <Text style={styles.submitText}>SIGN UP</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RegisterCandidat

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
        marginVertical: 10,
        backgroundColor:'#FFFFFF',
        borderRadius: 10,
        height: 60,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: Color.selectedbutton,
        margin: 20,
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 10,
    },
    submitText: {
        paddingHorizontal: 60,
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14
    },
    errorText: {
        color: "red",
        fontWeight:'700',
        paddingBottom:10,
        fontSize : 12,
    },
})