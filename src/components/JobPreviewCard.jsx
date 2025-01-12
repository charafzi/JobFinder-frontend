import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { logo } from "../../assets";
import { Color } from "../constants/Color";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const JobPreviewCard = ({ jobPoste }) => {
  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.jobCardHeader}>
        <View style={styles.leftContent}>
          <Image source={logo} style={styles.iconStyle} resizeMode="center" />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{jobPoste || "Product Designer"}</Text>
            <Text style={styles.subtitle}>
              Google inc . California, USA
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookmarkIcon}>
          <AntDesign name="heart" size={24} color={Color.primary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Application details
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default JobPreviewCard;

const styles = StyleSheet.create({
  jobCardContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  jobCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 20,
  },
  iconStyle: {
    backgroundColor: "#C4C4C4",
    borderRadius: 30,
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.text,
  },
  subtitle: {
    color: Color.subtitle,
    fontSize: 14,
  },
  bookmarkIcon: {
    padding: 4,
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 40,
    paddingVertical: 15,
    marginTop: 30,
    alignSelf: "center",
    backgroundColor: Color.lightGrey,
  },
  buttonText: {
    color: Color.subtitle,
    textAlign: "center",
  },
});
