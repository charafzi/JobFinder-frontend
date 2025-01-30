import {
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color } from "../constants/Color";
import { Controller, useForm } from "react-hook-form";
import { forgotpassword } from "../../assets";
import showToast from "../utils/showToast";
import LoadingIndicator from "../components/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/actions/forgotPasswordAction";

const ForgotPassword = ({ navigation }) => {
  const { isLoading, mailIsSent, error } = useSelector(
    (state) => state.forgotPassword,
  );
  const [submittedEmail, setSubmittedEmail] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleBackToLogin = () => {
    navigation.navigate("login");
  };

  useEffect(() => {
    if (error) {
      showToast("error", "Error during sending OTP code", error);
    }
  }, [error]);

  useEffect(() => {
    if (mailIsSent) {
      navigation.navigate("checkEmail", { email: submittedEmail });
    }
  }, [mailIsSent, submittedEmail, navigation]);

  const submit = async (data) => {
    setSubmittedEmail(data.email);
    dispatch(forgotPassword(data.email));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              To reset your password, you need your email or mobile number that can be authenticated
            </Text>
          </View>
          <Image source={forgotpassword} style={styles.image} />
          <View style={styles.formContainer}>
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
                  message: "Invalid email format",
                },
              }}
            />
            {errors?.email?.type === "required" && (
              <Text style={styles.errorText}>Please enter your email</Text>
            )}
            {errors?.email?.type === "pattern" && (
              <Text style={styles.errorText}>{errors?.email?.message}</Text>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleSubmit(submit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingIndicator isLoading={isLoading}/>
              ) : (
                <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.backButtonText}>BACK TO LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.background,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 50,
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 30,
    padding: 10,
    color: Color.text,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: Color.subtitle,
    marginHorizontal: 40,
    lineHeight: 18,
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Color.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 14,
    color: Color.text,
  },
  errorText: {
    color: Color.error,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: Color.selectedbutton,
    paddingVertical: 18,
    borderRadius: 10,
    minWidth : 300,
    alignItems: "center",
    marginTop: 10,
    height: 60, // Fixed height
    maxHeight : 60,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: Color.unselectedbutton,
    paddingVertical: 18,
    borderRadius: 10,
    minWidth : 300,
    alignItems: "center",
    marginTop: 10,
    height: 60, // Fixed height
    maxHeight : 60,
  },
  backButtonText: {
    color: Color.selectedbutton,
    fontSize: 14,
    fontWeight: "600",
  },
});
