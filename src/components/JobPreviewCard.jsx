import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { logo } from "../../assets";
import { Color } from "../constants/Color";
import React from "react";

const JobPreviewCard = ({ jobPoste }) => {
  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.jobCardHeader}>
        <Image source={logo} style={styles.iconStyle} resizeMode="center" />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.text}>{jobPoste || "Product Designer"}</Text>
          <Text style={{ color: Color.subtitle }}>
            Google inc . California, USA
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={{ color: Color.subtitle, textAlign: "center" }}>
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
    alignItems: "center",
  },
  iconStyle: {
    backgroundColor: "#C4C4C4",
    borderRadius: 30,
    width: 40,
    height: 40,
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 40,
    paddingVertical: 15,
    marginTop: 30,
    alignSelf: "center",
    borderColor: Color.text,
    borderWidth: 1,
  },
  text: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 12,
  },
});
