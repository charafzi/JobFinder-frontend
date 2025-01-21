import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Feather from "@expo/vector-icons/Feather";
import { Color } from "../constants/Color";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/showToast";
import { resetAuthState, setTemporaryCredentials } from "../redux/slices/register/registerSlice";
import { getAllSecteurs, registerEntreprise } from "../redux/slices/register/registerEntrepriseThunk";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import LoadingIndicator from "./LoadingIndicator";
import { useNavigation } from "@react-navigation/native";

const RegisterEntreprise = () => {
  const navigation = useNavigation();
  const [securePassword, setSecurePassword] = useState(true);
  const [selected, setSelected] = React.useState("");
  const dispatch = useDispatch();
  const { loading, error, success, secteurs, secteursLoading, secteursError } = useSelector((state) => state.register);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getAllSecteurs());
  }, [dispatch]);


  const formattedSecteurs = secteurs ? secteurs.map((secteur) => ({
    key: secteur.id,
    value: secteur.nom,
  })) : [];

  useEffect(() => {
    if (success) {
      showToast(
        "success",
        "Your account was registered successfully. Login to access your account."
      );
      dispatch(resetAuthState()); // Réinitialiser l'état après affichage du toast
    }
    if (error) {
      showToast("error", "Register Error", error);
      dispatch(resetAuthState()); // Réinitialiser l'état après affichage du toast
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    if (secteursError) {
      showToast("error", "Register Error", secteursError);
      console.log(secteursError);
    }
  }, [secteursError]);

  const submit = async (data) => {
    try {
      await dispatch(registerEntreprise(data)).unwrap(); // Attend que l'action soit réussie
      showToast(
        "success",
        "Your account was registered successfully. Login to access your account."
      );
      dispatch(setTemporaryCredentials({ email: data.email, password: data.password })); // Stockez les informations temporaires
      navigation.navigate("login"); // Naviguez uniquement si l'inscription est réussie
    } catch (error) {
      showToast("error", "Erreur d'inscription", error || "Une erreur s'est produite");
    }
  };
  return (
    <View>
      <Text style={styles.inputTitle}>Entreprise Name</Text>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Google"
            placeholderTextColor={Color.placeholderText}
            value={value}
            style={[styles.textInput, value && { fontWeight: "600" }]}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{ required: true, minLength: 2 }}
      />
      {errors?.name?.type === "required" && (
        <Text style={styles.errorText}>
          Veuillez saisir votre nom d'entreprise complet
        </Text>
      )}
      {errors?.name?.type === "minLength" && (
        <Text style={styles.errorText}>Votre nom d'entreprise pas correct</Text>
      )}

      <Text style={styles.inputTitle}>City</Text>
      <Controller
        name="city"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="New York"
            placeholderTextColor={Color.placeholderText}
            value={value}
            style={[styles.textInput, value && { fontWeight: "600" }]}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          required: "Veuillez saisir votre ville",
          minLength: {
            value: 2,
            message: "Votre ville est trop courte",
          },
        }}
      />
      {errors?.city && (
        <Text style={styles.errorText}>{errors.city.message}</Text>
      )}

      <Text style={styles.inputTitle}>Adress</Text>
      <Controller
        name="adress"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="12, California Street"
            placeholderTextColor={Color.placeholderText}
            value={value}
            style={[styles.textInput, value && { fontWeight: "600" }]}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          required: "Veuillez saisir votre adresse d'entreprise complete",
          minLength: {
            value: 2,
            message: "Votre adresse d'entreprise est trop court",
          },
        }}
      />
      {errors?.adress && (
        <Text style={styles.errorText}>{errors.adress.message}</Text>
      )}

      <Text style={styles.inputTitle}>Phone Number</Text>
      <Controller
        name="phoneNumber"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="+212 6 55 55 11 22"
            placeholderTextColor={Color.placeholderText}
            value={value}
            style={[styles.textInput, value && { fontWeight: "600" }]}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="phone-pad"
          />
        )}
        rules={{
          required: true,
          pattern: {
            value:
              /^((\+212|0)[\s]?[6|7][\s]?\d{2}[\s]?\d{2}[\s]?\d{2}[\s]?\d{2})$/,
            message: "Entrer un numéro de téléphone valide",
          },
        }}
      />
      {errors?.phoneNumber?.type === "required" && (
        <Text style={styles.errorText}>Veuillez saisir Votre téléphone</Text>
      )}
      {errors?.phoneNumber?.type === "pattern" && (
        <Text style={styles.errorText}>
          Entrer un numéro de téléphone valide
        </Text>
      )}

      <Text style={styles.inputTitle}>Secteurs d'activités</Text>
      <Controller
        name="secteursActivites"
        control={control}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <MultipleSelectList
            setSelected={
              (val) => {
                setSelected(val)
                onChange(val);
              }}
            onSelect={() => {
              setValue("secteursActivites", selected);
            }}
            data={formattedSecteurs}
            save="key"
            placeholder="Sélectionnez vos secteurs"
            selectedValues={value}
            searchPlaceholder="Rechercher..."
            selected={selected}
            boxStyles={[styles.list, { borderColor: Color.text, backgroundColor: Color.unselectedbutton }]}
            dropdownStyles={[styles.list]}
            checkBoxStyles={styles.checkBox}
            badgeStyles={styles.badge}
            labelStyles={{ color: Color.text }}
          />
        )}
        rules={{
          required: "Veuillez sélectionner au moins un secteur d'activité"
        }}
      />
      {errors?.secteursActivites && (
        <Text style={styles.errorText}>{errors.secteursActivites.message}</Text>
      )}



      <Text style={styles.inputTitle}>Email</Text>
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Brandonelouis@gmail.com "
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
            message: "Votre email n'est pas correct",
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
              style={{ flex: 1 }}
              onChangeText={onChange}
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

      <Text style={styles.inputTitle}>Confirm Password</Text>
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.textInputContainer]}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={Color.placeholderText}
              autoComplete="new-password"
              secureTextEntry={securePassword}
              value={value}
              onBlur={onBlur}
              style={{ flex: 1 }}
              onChangeText={(text) => {
                onChange(text); // Mettre à jour la valeur
              }}
              onSubmitEditing={handleSubmit(submit)}
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
          required: "Veuillez confirmer votre mot de passe",
          validate: (value) =>
            value === watch("password") ||
            "Les mots de passe ne correspondent pas",
        }}
      />
      {errors?.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(submit)}
        disabled={loading}
      >
        {loading ? (
          <LoadingIndicator isLoading={loading} />
        ) : (
          <Text style={styles.submitText}>
            SIGN UP
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RegisterEntreprise;

const styles = StyleSheet.create({
  inputTitle: {
    fontWeight: "700",
    fontSize: 12,
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
    fontSize: 14,
    textAlign: "center"
  },
  errorText: {
    color: "red",
    fontWeight: "700",
    fontSize: 12,
    paddingBottom: 10,
  },
  checkBox: {
    borderColor: Color.secondary,

  },
  badge: {
    backgroundColor: Color.selectedbutton,
  },
  list: {
    marginVertical: 10,
  },
});
