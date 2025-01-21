import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Color } from "../constants/Color";
import React from "react";

const JobPreviewFooter = ({ onPhotoPress, onSubmit }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={onPhotoPress}>
        <AntDesign name="picture" size={24} color={Color.link} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSubmit}>
        <Text style={styles.postButton}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(JobPreviewFooter);

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 15,
    justifyContent: "space-between",
  },
  postButton: {
    color: Color.link,
    fontWeight: "bold",
  },
});
