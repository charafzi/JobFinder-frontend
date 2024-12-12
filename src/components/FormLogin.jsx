import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation} from '@react-navigation/native';

const FormLogin = () => {
    const [securePassword, setSecurePassword] = useState(true);
    const navigation = useNavigation();

    const {
        control,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm();

    const handleForgotPassword = () => {
        navigation.navigate('forgotpassword');
    }

    const submit = async (data) => {
        try {
            const response = await axios.post('/login', data);
            console.log(response.data);
            alert('Login avec succès');
        } catch (error) {
            console.error('Error sending appointment request:', error);
            alert("Erreur lors de login");
        }
    };

    return (
        <View >
            <Text style={styles.inputTitle}>Email</Text>
            <Controller
                name='email'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Brandonelouis@gmail.com '
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
                            autoComplete='new-password'
                            secureTextEntry={securePassword}
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            style={{ flex: 1 }}
                            onFocus={() => console.log("TextInput focused")}
                        />
                        <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}>
                            {securePassword ? (
                                <Feather name="eye-off" size={24} color="gray" />
                            ) : (
                                <Feather name="eye" size={24} color="gray" />
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
            <View style={styles.bottomForm}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity style={styles.remember}></TouchableOpacity>
                    <Text>Remember me</Text>
                </View>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text>Forgot Password ?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit(submit)}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            
        </View>
    )
}

export default FormLogin

const styles = StyleSheet.create({
    inputTitle: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    textInput: {
        marginVertical: 10,
        padding: 10,
        borderWidth: .2,
        borderRadius: 10,
        height: 60,
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginVertical: 10,
        borderWidth: .2,
        borderRadius: 10,
        height: 60,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: "darkblue",
        margin: 20,
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 10,
        alignSelf: 'center',
    },
    submitText: {
        paddingHorizontal: 10,
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 18
    },
    errorText: {
        color: "red"
    },
    remember: {
        backgroundColor: 'violet',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    loginButton: {
        backgroundColor: 'darkblue',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    
    bottomForm: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginVertical: 15
    },
})