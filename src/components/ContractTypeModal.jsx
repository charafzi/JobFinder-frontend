import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../constants/Color";

const ContractTypeModal = ({ handleCloseModal, showModal, handleSetValue }) => {
  const contratOptions = ["CDD", "CDI", "Stage", "Freelance"];
  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleCloseModal}>
            <View
              style={{
                backgroundColor: "#5B5858",
                alignSelf: "center",
                width: 100,
                borderRadius: 20,
                padding: 4,
                margin: 10,
              }}
            ></View>
          </TouchableOpacity>
          <View style={{ width: "80%", alignSelf: "center" }}>
            <Text
              style={[{ textAlign: "center", marginVertical: 10 }, styles.text]}
            >
              Choose the type of workplace
            </Text>
            <Text
              style={[
                { textAlign: "center", marginVertical: 10 },
                styles.subtext,
              ]}
            >
              Decide and choose the type of place to work according to what you
              want
            </Text>
          </View>
          {contratOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.modalOption}
              onPress={() => {
                handleSetValue(option);
                handleCloseModal();
              }}
            >
              <Text style={styles.modalText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default ContractTypeModal;

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
});
