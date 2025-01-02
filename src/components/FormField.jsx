import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Color } from "../constants/Color";

const FormField = ({ label, value, isEditing, onEdit, children, error }) => (
  <View style={styles.card}>
    <View style={styles.fieldHeader}>
      <Text style={styles.text}>{label}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Feather
          name={
            !value
              ? isEditing
                ? "check"
                : "plus"
              : isEditing
                ? "check"
                : "edit-2"
          }
          size={!value ? 24 : 20}
          color={Color.link}
        />
      </TouchableOpacity>
    </View>
    {value && <Text style={styles.value}>{value}</Text>}
    {isEditing && children}
    {error && <Text style={styles.errorText}>{error.message}</Text>}
  </View>
);

export default FormField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 20,
  },
  headerContainer: {
    paddingBottom: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Color.text,
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
  subtext: {
    fontWeight: "regular",
    fontSize: 12,
    color: Color.subtitle,
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
  addButton: {
    backgroundColor: Color.link,
    borderRadius: 30,
    padding: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: Color.link,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalCancel: {
    padding: 15,
    marginTop: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: "left",
  },
  dateModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dateModalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
  },
  errorText: {
    color: "red",
    fontWeight: "700",
    fontSize: 12,
    paddingBottom: 10,
  },
});
