import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "../constants/Color";

const JobPreviewDescription = ({ titre, jobDescription }) => {
  return (
    <View>
      <Text style={styles.subtitle}>Description</Text>
      <View style={styles.titleContainer}>
        <Text>{titre || "job title"}</Text>
        <View style={{ marginVertical: 20 }}>
          <Text>
            {jobDescription ||
              "Today I am opening a job vacancy in the field of UI/UX Designer at an Apple company. To see a job description, please see below."}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default JobPreviewDescription;

const styles = StyleSheet.create({
  subtitle: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 12,
  },
  titleContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
