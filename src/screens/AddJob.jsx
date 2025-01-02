import React, { useState } from "react";
import {
  Keyboard,
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
import { ContractTypeModal, DateModal, ExigencesModal, FormField } from "../components";

const AddJob = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();
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
    },
    resolver: (data) => {
      const errors = {};

      if (!data.titre) {
        errors.titre = { message: "Le titre est requis" };
      }

      if (!data.description) {
        errors.description = { message: "La description est requise" };
      }

      if (!data.poste) {
        errors.poste = { message: "Le poste est requis" };
      }

      if (!data.typeContrat) {
        errors.typeContrat = { message: "Le type de contrat est requis" };
      }

      if (!data.salaire) {
        errors.salaire = { message: "Le salaire est requis" };
      } else if (isNaN(data.salaire)) {
        errors.salaire = { message: "Le salaire doit être un nombre" };
      }

      if (!data.dateLimite) {
        errors.dateLimite = { message: "La date limite est requise" };
      }

      if (!data.exigences || data.exigences.length === 0) {
        errors.exigences = { message: "Au moins une exigence est requise" };
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

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    navigation.navigate("jobPreview", data);
  };

  const onError = (errors) => {
    console.log("Form Errors:", errors);
  };

  const renderFormField = (name, placeholder, props = {}) => (
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
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentStyle={{ paddingBottom: tabBarHeight }}>
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
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <ExigencesModal
        showModal={showExigencesModal}
        handleCloseModal={() => setShowExigencesModal(false)}
        currentExigences={getValues("exigences")}
        handleSetExigences={(newExigences) =>
          setValue("exigences", newExigences)
        }
      />

      <ContractTypeModal
        handleCloseModal={() => setShowContractModal(false)}
        showModal={showContractModal}
        handleSetValue={(option) => setValue("typeContrat", option)}
      />

      <DateModal
        handleCloseModal={() => setShowDatePicker(false)}
        showDatePicker={showDatePicker}
        date={date}
        handleSetDate={(date) => setDate(date)}
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
