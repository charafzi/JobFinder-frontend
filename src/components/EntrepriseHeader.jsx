import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "../constants/Color";

const EntrepriseHeader = ({ entrepriseLogo, entrepriseName }) => {
  return (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.name}>Welcome Back </Text>
        <Text style={styles.name}>{entrepriseName !== "" || "Google"}</Text>
      </View>
      <Image source={entrepriseLogo} style={{ marginLeft: 10 }} />
    </View>
  );
};

export default React.memo(EntrepriseHeader);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    color: Color.text,
  },
});
