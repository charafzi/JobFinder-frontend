import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Color } from "../constants/Color";

const JobPreviewDescription = ({ title, jobDescription, jobPreviewCard }) => {
  return (
    <View>
      <Text style={styles.subtitle}>Description</Text>
      <View style={styles.titleContainer}>
        <Text>{title || "job title"}</Text>
        <View style={{ marginTop: 20 }}>
          <Text>
            {jobDescription ||
              "Job Description."}
          </Text>
        </View>
        {jobPreviewCard}
      </View>
    </View>
  );
};

export default React.memo(JobPreviewDescription);

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
