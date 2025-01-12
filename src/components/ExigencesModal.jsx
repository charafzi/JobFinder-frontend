import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Color } from "../constants/Color";

const ExigencesModal = ({
  showModal,
  handleCloseModal,
  currentExigences,
  handleSetExigences,
}) => {
  const [newExigence, setNewExigence] = useState("");
  const [exigences, setExigences] = useState(currentExigences);

  const addExigence = () => {
    const trimmedExigence = newExigence.trim();
    if (trimmedExigence) {
      setExigences([...exigences, trimmedExigence]);
      setNewExigence("");
    }
  };

  const removeExigence = (index) => {
    const newExigences = exigences.filter((_, i) => i !== index);
    setExigences(newExigences);
  };

  const handleSubmit = () => {
    handleSetExigences(exigences);
    handleCloseModal();
  };

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCloseModal}>
            <Feather name="x" size={24} color={Color.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Add Exigences</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newExigence}
            placeholder="Enter exigence"
            onChangeText={setNewExigence}
            onSubmitEditing={addExigence}
          />
          <TouchableOpacity onPress={addExigence} style={styles.addButton}>
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={exigences}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.exigenceItem}>
              <Text style={styles.exigenceText}>{item}</Text>
              <TouchableOpacity onPress={() => removeExigence(index)}>
                <Feather name="trash-2" size={20} color={Color.link} />
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ExigencesModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Color.text,
  },
  submitText: {
    color: Color.link,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Color.link,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: Color.link,
    borderRadius: 10,
    padding: 10,
  },
  exigenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  exigenceText: {
    flex: 1,
    fontSize: 16,
    color: Color.text,
    marginRight: 10,
  },
});
