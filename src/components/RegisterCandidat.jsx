import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import Feather from '@expo/vector-icons/Feather';

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
        try {
            const response = await axios.post('/register-candidat', data);
            console.log(response.data);
            alert('Register candidat avec succès');
        } catch (error) {
            console.error('Error sending appointment request:', error);
            alert("Erreur lors de register candidat");
        }
    };
    return (
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text style={styles.inputTitle}>First Name</Text>
            <Controller
                name='FirstName'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Brandone'
                        value={value}
                        style={[styles.textInput, value && { fontWeight: "600" }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                    />
                )}
                rules={{ required: true, minLength: 2 }}
            />
            {errors?.FirstName?.type === "required" && <Text style={styles.errorText}>Veuillez saisir votre prenom complet</Text>}
            {errors?.FirstName?.type === "minLength" && <Text style={styles.errorText}>Votre prenom pas correct</Text>}

            <Text style={styles.inputTitle}>Last Name</Text>
            <Controller
                name='LastName'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='Louis'
                        value={value}
                        style={[styles.textInput, value && { fontWeight: "600" }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                    />
                )}
                rules={{ required: true, minLength: 3 }}
            />
            {errors?.LastName?.type === "required" && <Text style={styles.errorText}>Veuillez saisir votre nom complet</Text>}
            {errors?.LastName?.type === "minLength" && <Text style={styles.errorText}>Votre nom pas correct</Text>}

            <Text style={styles.inputTitle}>Phone Number</Text>
            <Controller
                name='PhoneNumber'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        placeholder='+2126 55 55 11 22'
                        value={value}
                        style={[styles.textInput, value && { fontWeight: "600" }]}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType='number-pad'
                    />
                )}
                rules={{ required: true, pattern: { value: /^(6|7)\d{8}$/, message: "Entrer un numéro de téléphone valide" } }}
            />
            {errors?.PhoneNumber?.type === "required" && <Text style={styles.errorText}>Veuillez saisir Votre téléphone</Text>}
            {errors?.PhoneNumber?.type === "pattern" && <Text style={styles.errorText}>Entrer un numéro de téléphone valide</Text>}

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
                            style={{ flex: 1 }}
                            onChangeText={onChange}
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

            <Text style={styles.inputTitle}>Confirm Password</Text>
            <Controller
                name='confirmPassword'
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View style={[styles.textInputContainer]}>
                        <TextInput
                            placeholder='Confirm Password'
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
                                <Feather name="eye-off" size={24} color="gray" />
                            ) : (
                                <Feather name="eye" size={24} color="gray" />
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
                <Text style={styles.submitText}>Sign up</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RegisterCandidat

const styles = StyleSheet.create({
    inputTitle: {
        fontWeight: 'bold',
        fontSize: 15,
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
})