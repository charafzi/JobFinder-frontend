import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Color } from "../constants/Color";
import React from "react";

const JobPreviewFooter = ({ onSubmit }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={onSubmit}>
        <Text style={styles.postButton}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(JobPreviewFooter);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "white",
    padding: 10,
  },
  postButton: {
    color: Color.link,
    fontWeight: "bold",
    padding: 10,
    textAlign: "right",
  },
});
