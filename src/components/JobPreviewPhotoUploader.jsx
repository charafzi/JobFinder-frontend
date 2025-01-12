import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Color } from "../constants/Color";

const JobPreviewPhotoUploader = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={styles.addPhotoContainer}>
      <TouchableOpacity style={styles.addPhotoButton}>
        <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={onClose}>
          <AntDesign name="closecircleo" size={22} color="black" />
        </TouchableOpacity>
        <View style={styles.addPhotoIcon}>
          <MaterialIcons name="add-to-photos" size={24} color="black" />
          <Text style={styles.text}>Add photos</Text>
          <Text style={styles.subtext}>or Drag and Drop</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default JobPreviewPhotoUploader;

const styles = StyleSheet.create({
  addPhotoContainer: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 20,
  },
  addPhotoButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    height: 150,
  },
  addPhotoIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 22, fontWeight: "bold" },
  subtext: { color: Color.placeholderText, fontSize: 13 },
});
