import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Feather from "@expo/vector-icons/Feather";
import { Color } from "../constants/Color";
import dayjs from "dayjs";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  ContractTypeModal,
  DateModal,
  ExigencesModal,
  FormField, LocationChoiceModal,
  LocationMapModal,
} from "../components";
import { useScrollToTop } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useHasSavedLocation } from "../hooks/useHasSavedLocation";

const AddJob = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const ref = useRef(null);
  const adress = useSelector((state) => state.auth.entreprise);
  useScrollToTop(ref);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      titre: "",
      description: "",
      poste: "",
      exigences: [],
      typeContrat: "",
      salaire: "",
      dateLimite: "",
      address: "",
      city: "",
      longitude: "",
      latitude: "",
      question: "",
    },
    resolver: (data) => {
      const errors = {};

      // Validation du titre
      if (!data.titre) {
        errors.titre = { message: "Le titre est requis" };
      } else if (data.titre.trim().length < 5) {
        errors.titre = {
          message: "Le titre doit contenir au moins 5 caractères",
        };
      }

      // Validation de la description
      if (!data.description) {
        errors.description = { message: "La description est requise" };
      } else if (data.description.trim().length < 10) {
        errors.description = {
          message: "La description doit contenir au moins 10 caractères",
        };
      }

      // Validation du poste
      if (!data.poste) {
        errors.poste = { message: "Le poste est requis" };
      } else if (data.poste.trim().length < 3) {
        errors.poste = {
          message: "Le poste doit contenir au moins 3 caractères",
        };
      }

      // Validation du type de contrat
      if (!data.typeContrat) {
        errors.typeContrat = { message: "Le type de contrat est requis" };
      } else if (
        !["CDD", "CDI", "Stage", "Freelance"].includes(data.typeContrat)
      ) {
        errors.typeContrat = {
          message:
            "Le type de contrat doit être valide (CDD, CDI, Stage, Freelance)",
        };
      }

      // Validation du salaire
      if (!data.salaire) {
        errors.salaire = { message: "Le salaire est requis" };
      } else if (isNaN(data.salaire)) {
        errors.salaire = { message: "Le salaire doit être un nombre" };
      } else if (parseFloat(data.salaire) <= 0) {
        errors.salaire = {
          message: "Le salaire doit être un montant positif supérieur à zéro",
        };
      }

      // Validation de la date limite
      if (!data.dateLimite) {
        errors.dateLimite = { message: "La date limite est requise" };
      } else if (isNaN(Date.parse(data.dateLimite))) {
        errors.dateLimite = {
          message: "La date limite doit être une date valide",
        };
      } else if (new Date(data.dateLimite) <= new Date()) {
        errors.dateLimite = {
          message: "La date limite doit être une date future",
        };
      }

      // Validation des exigences
      if (!data.exigences || data.exigences.length === 0) {
        errors.exigences = { message: "Au moins une exigence est requise" };
      } else if (data.exigences.some((exigence) => exigence.trim() === "")) {
        errors.exigences = {
          message: "Chaque exigence doit contenir du texte valide",
        };
      }

      // Validation de l'adresse
      if (!data.address) {
        errors.address = { message: "L'adresse est requise" };
      } else if (data.address.trim().length < 5) {
        errors.address = {
          message: "L'adresse doit contenir au moins 5 caractères",
        };
      }

      if (!data.city) {
        errors.city = { message: "La ville est requise" };
      }
      if (!data.longitude || !data.latitude) {
        errors.location = { message: "La localisation est requise" };
      }

      if (data.question.trim().length < 10) {
        errors.question = {
          message: "La question doit contenir au moins 10 caractères",
        };
      }

      return {
        values: data,
        errors: Object.keys(errors).length > 0 ? errors : {},
      };
    },
  });

  const [showContractModal, setShowContractModal] = useState(false);
  const [showExigencesModal, setShowExigencesModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLocationChoiceModal, setShowLocationChoiceModal] = useState(false);
  const hasSavedLocation = useHasSavedLocation();

  const handleUseSavedLocation = useCallback(() => {
    if (hasSavedLocation) {
      setValue("address", adress.adress);
      setValue("city", adress.city);
      setValue("longitude", adress.longitude.toString());
      setValue("latitude", adress.latitude.toString());
    } else {
      navigation.navigate("EditCompanyProfile");
    }
    setShowLocationChoiceModal(false);
  }, [adress, setValue, navigation]);


  const renderLocationField = useCallback(() => (
    <Controller
      control={control}
      name="longitude"
      render={({ field: { value: longitudeValue } }) => (
        <Controller
          control={control}
          name="latitude"
          render={({ field: { value: latitudeValue } }) => (
            <View style={styles.card}>
              <View style={styles.fieldHeader}>
                <Text style={styles.text}>Localisation</Text>
                <TouchableOpacity onPress={() => setShowLocationChoiceModal(true)}>
                  <Feather
                    name={!longitudeValue ? "plus" : "edit-2"}
                    size={!longitudeValue ? 24 : 20}
                    color={Color.link}
                  />
                </TouchableOpacity>
              </View>
              {(!longitudeValue || !latitudeValue) && errors.location && (
                <Text style={styles.errorText}>{errors.location.message}</Text>
              )}
            </View>
          )}
        />
      )}
    />
  ), [control, errors.location, setShowLocationChoiceModal]);


  const handleSetLocation = (location) => {
    setValue('longitude', location.longitude.toString());
    setValue('latitude', location.latitude.toString());
  }
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    navigation.navigate("jobPreview", data);
  };

  const onError = (errors) => {
    console.log("Form Errors:", errors);
  };

  const renderFormField = useCallback(
    (name, placeholder, props = {}) => (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label={name.charAt(0).toUpperCase() + name.slice(1)}
            value={value}
            isEditing={editingField === name}
            onEdit={() => setEditingField(editingField === name ? null : name)}
            error={errors[name]}
          >
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...props}
            />
          </FormField>
        )}
      />
    ),
    [control, editingField, errors],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView ref={ref} contentContainerStyle={{ paddingBottom: tabBarHeight + 50, marginBottom: tabBarHeight }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Feather name="x" size={24} color={Color.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit(onSubmit, onError)}>
              <Text style={styles.submitText}>Suivant</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Add a Job</Text>
          </View>
          <View style={styles.formContainer}>
            {renderFormField("titre", "Enter titre")}
            {renderFormField("description", "Enter description")}
            {renderFormField("poste", "Enter poste")}
            {renderFormField("city", "Enter city")}
            {renderFormField("address", "Enter address")}
            {renderLocationField()}
            {/* <Controller
              control={control}
              name="longitude"
              render={({ field: { value: longitudeValue } }) => (
                <Controller
                  control={control}
                  name="latitude"
                  render={({ field: { value: latitudeValue } }) => (
                    <View style={styles.card}>
                      <View style={styles.fieldHeader}>
                        <Text style={styles.text}>Localisation</Text>
                        <TouchableOpacity onPress={() => setShowLocationModal(true)}>
                          <Feather
                            name={!longitudeValue ? "plus" : "edit-2"}
                            size={!longitudeValue ? 24 : 20}
                            color={Color.link}
                          />
                        </TouchableOpacity>
                      </View>

                      {(!longitudeValue || !latitudeValue) && errors.location && (
                        <Text style={styles.errorText}>
                          {errors.location.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              )}
            /> */}

            <Controller
              control={control}
              name="exigences"
              render={({ field: { value } }) => (
                <View style={styles.card}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.text}>Exigences</Text>
                    <TouchableOpacity
                      onPress={() => setShowExigencesModal(true)}
                    >
                      <Feather
                        name={!value?.length ? "plus" : "edit-2"}
                        size={!value?.length ? 24 : 20}
                        color={Color.link}
                      />
                    </TouchableOpacity>
                  </View>
                  {value?.length > 0 && (
                    <View style={styles.exigencesList}>
                      {value.map((exigence, index) => (
                        <Text key={index} style={styles.exigenceItem}>
                          • {exigence}
                        </Text>
                      ))}
                    </View>
                  )}
                  {errors.exigences && (
                    <Text style={styles.errorText}>
                      {errors.exigences.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="typeContrat"
              render={({ field: { value } }) => (
                <View style={styles.card}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.text}>Type Contrat</Text>
                    <TouchableOpacity
                      onPress={() => setShowContractModal(true)}
                    >
                      <Feather
                        name={!value ? "plus" : "edit-2"}
                        size={!value ? 24 : 20}
                        color={Color.link}
                      />
                    </TouchableOpacity>
                  </View>
                  {value && <Text style={styles.value}>{value}</Text>}
                  {errors.typeContrat && (
                    <Text style={styles.errorText}>
                      {errors.typeContrat.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {renderFormField("salaire", "Enter salaire", {
              keyboardType: "number-pad",
            })}

            <Controller
              control={control}
              name="dateLimite"
              render={({ field: { value } }) => (
                <View style={styles.card}>
                  <View style={styles.fieldHeader}>
                    <Text style={styles.text}>Date Limite</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <Feather
                        name={!value ? "plus" : "edit-2"}
                        size={!value ? 24 : 20}
                        color={Color.link}
                      />
                    </TouchableOpacity>
                  </View>
                  {value && (
                    <Text style={styles.value}>
                      {new Date(value).toLocaleString()}
                    </Text>
                  )}
                  {errors.dateLimite && (
                    <Text style={styles.errorText}>
                      {errors.dateLimite.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {renderFormField("question", "Entrez une question pour les candidats")}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <LocationChoiceModal
        visible={showLocationChoiceModal}
        onRequestClose={() => setShowLocationChoiceModal(false)}
        onUseSavedLocation={handleUseSavedLocation}
        onSelectNewLocation={() => {
          setShowLocationChoiceModal(false);
          setShowLocationModal(true);
        }}
        hasSavedLocation={hasSavedLocation}
      />

      <ExigencesModal
        showModal={showExigencesModal}
        handleCloseModal={useCallback(() => {
          setShowExigencesModal(false);
        }, [])}
        currentExigences={useCallback(() => {
          getValues("exigences");
        }, [getValues])}
        handleSetExigences={useCallback(
          (newExigences) => {
            setValue("exigences", newExigences);
          },
          [setValue],
        )}
        control={control}
      />

      <LocationMapModal
        showModal={showLocationModal}
        handleCloseModal={() => setShowLocationModal(false)}
        handleSetLocation={handleSetLocation}
        control={control}
        initialLocation={{
          latitude: 31.7917, // Latitude du Maroc
          longitude: -7.0926, // Longitude du Maroc
          latitudeDelta: 10, // Niveau de zoom
          longitudeDelta: 10, // Niveau de zoom
        }}
      />

      <ContractTypeModal
        handleCloseModal={useCallback(() => {
          setShowContractModal(false);
        }, [setShowContractModal])}
        showModal={showContractModal}
        handleSetValue={useCallback(
          (option) => {
            setValue("typeContrat", option);
          },
          [setValue],
        )}
        control={control}
      />

      <DateModal
        handleCloseModal={useCallback(() => {
          setShowDatePicker(false);
        }, [setShowDatePicker])}
        showDatePicker={showDatePicker}
        date={date}
        handleSetDate={useCallback(
          (date) => {
            setDate(date);
          },
          [setDate],
        )}
        control={control}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 20,
  },
  headerContainer: {
    paddingVertical: 20,
  },
  title: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  formContainer: {
    marginTop: 10,
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: Color.text,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginVertical: 5,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: Color.link,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: Color.subtitle,
    marginTop: 8,
  },
  exigenceItem: {
    fontSize: 14,
    color: Color.text,
    marginVertical: 4,
  },
  submitText: {
    color: Color.link,
    fontWeight: "bold",
    fontSize: 16,
  },
  exigencesList: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontWeight: "700",
    fontSize: 12,
    paddingBottom: 10,
  },
});

export default AddJob;