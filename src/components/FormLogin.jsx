import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Color } from "../constants/Color";
import { showToast } from "../utils/showToast";
import LoadingIndicator from "./LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authAction";

const FormLogin = () => {
  const [securePassword, setSecurePassword] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, isLoggedIn, error } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isLoggedIn) {
      showToast("success", "Login Successful", "Welcome back !");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (error) {
      showToast("error", "Login failed", error);
    }
  }, [error]);

  const handleForgotPassword = () => {
    navigation.navigate("forgotpassword");
  };

  const submit = async (data) => {
    dispatch(login(data));
  };

  return (
    <View>
      <Text style={styles.inputTitle}>Email</Text>
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Brandonelouis@gmail.com"
            placeholderTextColor={Color.placeholderText}
            value={value}
            style={[styles.textInput, value && { fontWeight: "600" }]}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="email-address"
            autoComplete="email"
          />
        )}
        rules={{
          required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Votre email pas correct",
          },
        }}
      />
      {errors?.email?.type === "required" && (
        <Text style={styles.errorText}>Veuillez saisir votre email</Text>
      )}
      {errors?.email?.type === "pattern" && (
        <Text style={styles.errorText}>{errors?.email?.message}</Text>
      )}

      <Text style={styles.inputTitle}>Password</Text>
      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.textInputContainer]}>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor={Color.placeholderText}
              autoComplete="new-password"
              secureTextEntry={securePassword}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => setSecurePassword(!securePassword)}
            >
              {securePassword ? (
                <Feather name="eye-off" size={24} color="#60778C" />
              ) : (
                <Feather name="eye" size={24} color="#60778C" />
              )}
            </TouchableOpacity>
          </View>
        )}
        rules={{
          required: "Veuillez saisir votre mot de passe",
          minLength: {
            value: 6,
            message: "Le mot de passe doit contenir au moins 6 caractères",
          },
        }}
      />
      {errors?.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}
      <View style={styles.bottomForm}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={styles.remember}></TouchableOpacity>
          <Text style={[{ color: "#AAA6B9" }, styles.rememberText]}>
            Remember me
          </Text>
        </View>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[{ color: Color.text }, styles.rememberText]}>
            Forgot Password ?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(submit)}
        disabled={isLoading}
      >
        <View style={styles.buttonContent}>
          {!isLoading && <Text style={styles.loginText}>LOGIN</Text>}
          <LoadingIndicator isLoading={isLoading} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FormLogin;

const styles = StyleSheet.create({
  inputTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Color.text,
  },
  textInput: {
    marginVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 50,
  },
  textInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 60,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontWeight: "700",
    fontSize: 12,
    paddingBottom: 10,
  },
  remember: {
    backgroundColor: Color.remeberMe,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  rememberText: {
    fontSize: 12,
    fontWeight: "400",
  },
  loginButton: {
    backgroundColor: Color.selectedbutton,
    margin: 20,
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 10,
    height: 60, // Fixed height
    justifyContent: "center", // Center content vertically
  },
  loginText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  bottomForm: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  spinner: {
    paddingHorizontal: 60,
    color: "#ffffff",
    fontSize: 14,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
  },
});
