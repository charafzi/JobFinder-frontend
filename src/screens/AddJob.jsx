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
  FormField,
  LocationMapModal,
} from "../components";
import { useScrollToTop } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useHasSavedLocation } from "../hooks/useHasSavedLocation";
import LocationChoiceModal from "../components/LocationChoiceModal";
import MapView, { Marker } from 'react-native-maps';
import showToast from "../utils/showToast";

const AddJob = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
  const ref = useRef(null);
  const entreprise = useSelector((state) => state.auth.entreprise);
  const id = useSelector((state) => state.auth.id);
  useScrollToTop(ref);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      position: "",
      exigences: [],
      requirements: [],
      contractType: "",
      salary: "",
      deadlineDate: "",
      city: "",
      address: "",
      longitude: "",
      latitude: "",
      question: "",
    },
    resolver: (data) => {
      const errors = {};

      // Validation du titre
      if (!data.title) {
        errors.title = { message: "Title is required" };
      } else if (data.title.trim().length < 5) {
        errors.title = {
          message: "Title must be at least 5 characters long",
        };
      }

      // Validation de la description
      if (!data.description) {
        errors.description = { message: "Description is required" };
      } else if (data.description.trim().length < 20) {
        errors.description = {
          message: "Description must be at least 20 characters long",
        };
      }

      // Validation du poste
      if (!data.position) {
        errors.position = { message: "Position is required" };
      } else if (data.position.trim().length < 3) {
        errors.position = {
          message: "Position must be at least 3 characters long",
        };
      }

      // Validation du type de contrat
      if (!data.contractType) {
        errors.contractType = { message: "Contract type is required" };
      } else if (
        !["CDD", "CDI", "Freelance", "Stage"].includes(data.contractType)
      ) {
        errors.contractType = {
          message:
            "Contract type must be valid (CDD, CDI, Internship, Freelance)",
        };
      }

      // Validation du salaire
      if (!data.salary) {
        errors.salary = { message: "Salary is required" };
      } else if (isNaN(data.salary)) {
        errors.salary = { message: "Salary must be a number" };
      } else if (parseFloat(data.salary) <= 0) {
        errors.salary = {
          message: "Salary must be a positive amount greater than zero",
        };
      }

      // Validation de la date limite
      if (!data.deadlineDate) {
        errors.deadlineDate = { message: "Deadline date is required" };
      } else if (isNaN(Date.parse(data.deadlineDate))) {
        errors.deadlineDate = {
          message: "Deadline date must be a valid date",
        };
      } else if (new Date(data.deadlineDate) <= new Date()) {
        errors.deadlineDate = {
          message: "Deadline date must be in the future",
        };
      }

      // Validation des exigences
      if (!data.exigences || data.exigences.length === 0) {
        errors.exigences = { message: "At least one requirement is required" };
      } else if (data.exigences.some((exigence) => exigence.trim() === "")) {
        errors.exigences = {
          message: "Each requirement must contain valid text",
        };
      }

      // Validation de l'adresse
      if (!data.address) {
        errors.address = { message: "Address is required" };
      }

      if (!data.city) {
        errors.city = { message: "City is required" };
      }
      if (!data.longitude || !data.latitude) {
        errors.location = { message: "Location is required" };
      }

      if (data.question.trim().length < 10) {
        errors.question = {
          message: "Question must be at least 10 characters long",
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
    if (entreprise?.adress) {
      const longitude = entreprise.adress.longitude;
      const latitude = entreprise.adress.latitude;

      if (longitude && latitude) {
        setValue('address', entreprise.adress.adress);
        setValue('city', entreprise.adress.city);
        setValue('longitude', longitude.toString());
        setValue('latitude', latitude.toString());

        // Force a re-render of the map
        setTimeout(() => {
          setValue('longitude', longitude.toString());
          setValue('latitude', latitude.toString());
        }, 100);
      }
    }
    setShowLocationChoiceModal(false);
  }, [entreprise, setValue]);

  const handleSetLocation = (location) => {
    setValue('longitude', location.longitude.toString());
    setValue('latitude', location.latitude.toString());
  }
  const onSubmit = (data) => {
    // Ensure we have a valid company id
    if (!id) {
      console.error('Company ID is missing');
      return;
    }

    // Convert form data to match backend DTO
    const formattedData = {
      title: data.title,
      description: data.description,
      position: data.position,
      exigences: data.exigences || [], // Pass exigences instead of requirements
      contractType: data.contractType,
      salary: parseFloat(data.salary),
      question: data.question,
      publicationDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      deadlineDate: dayjs(data.deadlineDate).format('YYYY-MM-DDTHH:mm:ss'),
      company: {
        id: parseInt(id)
      },
      adress: {
        city: data.city,
        adress: data.address,
        longitude: parseFloat(data.longitude),
        latitude: parseFloat(data.latitude)
      }
    };
    showToast(
      "success", 
      "Success", 
      "Job details saved successfully"
    );
    navigation.navigate("jobPreview", formattedData);
  };

  const onError = (errors) => {
    console.log("Form Errors:", errors);
    Object.entries(errors).forEach(([fieldName, error], index) => {
      const formattedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      
      // Ajouter un délai de 300ms entre chaque toast
      setTimeout(() => {
        showToast(
          "error",
          `${formattedFieldName} Error`,
          error.message
        );
      }, index * 300);
    });
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
                <Text style={styles.text}>Location</Text>
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
              {longitudeValue && latitudeValue && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: parseFloat(latitudeValue) || 0,
                      longitude: parseFloat(longitudeValue) || 0,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    region={{
                      latitude: parseFloat(latitudeValue) || 0,
                      longitude: parseFloat(longitudeValue) || 0,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(latitudeValue) || 0,
                        longitude: parseFloat(longitudeValue) || 0,
                      }}
                    />
                  </MapView>
                </View>
              )}
            </View>
          )}
        />
      )}
    />
  ), [control, errors.location, setShowLocationChoiceModal]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
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
              <Text style={styles.submitText}>Next</Text>
            </TouchableOpacity>
          </View>
          <ScrollView ref={ref} contentContainerStyle={{ paddingBottom: tabBarHeight + 50, marginBottom: tabBarHeight }}>
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Add a Job</Text>
            </View>
            <View style={styles.formContainer}>
              {renderFormField("title", "Enter job title")}
              {renderFormField("description", "Enter job description")}
              {renderFormField("position", "Enter position")}
              {renderFormField("city", "Enter city")}
              {renderFormField("address", "Enter address")}
              {renderLocationField()}
              <Controller
                control={control}
                name="exigences"
                render={({ field: { value } }) => (
                  <View style={styles.card}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.text}>Requirements</Text>
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
                name="contractType"
                render={({ field: { value } }) => (
                  <View style={styles.card}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.text}>Contract Type</Text>
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
                    {errors.contractType && (
                      <Text style={styles.errorText}>
                        {errors.contractType.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {renderFormField("salary", "Enter salary (DH/Month)", {
                keyboardType: "number-pad",
              })}

              <Controller
                control={control}
                name="deadlineDate"
                render={({ field: { value } }) => (
                  <View style={styles.card}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.text}>Deadline Date</Text>
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
                    {errors.deadlineDate && (
                      <Text style={styles.errorText}>
                        {errors.deadlineDate.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {renderFormField("question", "Enter screening question")}
            </View>
          </ScrollView>
        </>
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
        handleCloseModal={() => setShowExigencesModal(false)}
        control={control}
        handleSetExigences={(newExigences) => {
          setValue("exigences", newExigences);
          const requirements = [...newExigences]; // Copy for the requirements field
          setValue("requirements", requirements);
        }}
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
            setValue("contractType", option);
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
        handleSetDate={useCallback((date) => {
          setValue("deadlineDate", date);
          setShowDatePicker(false);
        }, [setValue])}
        date={dayjs()}
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
  mapContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    height: 150,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default AddJob;