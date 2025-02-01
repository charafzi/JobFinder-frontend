import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { profile } from "../../assets";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color } from "../constants/Color";
import { useSelector } from "react-redux";
import { ENTREPRISE_IMAGE_URL } from "../config/axiosConfig";


const JobPreviewHeader = ({ navigation }) => {
  const {id } = useSelector((state) => state.auth);
  const entreprise = useSelector((state) => state.auth.entreprise);
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Share a Job</Text>
      <View style={styles.profileContainer}>
        <Image source={id ? {
          uri: ENTREPRISE_IMAGE_URL + id,
        } : profile} style={styles.profileImage} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{entreprise.name || "Entreprise Name"}</Text>
          <Text>{entreprise.adress.city || "Entreprise Ville"}</Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(JobPreviewHeader);

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 10,
  },
  profileContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingVertical: 10,
  },
  profileImage: {
    marginLeft: 10,
    width: 56,
    height: 56,
    borderRadius: 30,
  },
  title: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
