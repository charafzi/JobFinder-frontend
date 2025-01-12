import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { Color } from "../constants/Color";
import {
  JobPreviewCard,
  JobPreviewDescription,
  JobPreviewFooter,
  JobPreviewHeader,
  JobPreviewPhotoUploader,
} from "../components";

const JobPreview = ({ route, navigation }) => {
  const [showAddPhotos, setShowAddPhotos] = useState(true);
  const { entrepriseName, entrepriseVille, titre, jobDescription, jobPoste } =
    route?.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ padding: 15 }}>
          <JobPreviewHeader
            navigation={navigation}
            entrepriseName={entrepriseName}
            entrepriseVille={entrepriseVille}
          />
          <JobPreviewDescription
            titre={titre}
            jobDescription={jobDescription}
          />
          <JobPreviewCard jobPoste={jobPoste} />
          <JobPreviewPhotoUploader
            visible={showAddPhotos}
            onClose={() => setShowAddPhotos(false)}
          />
        </View>
      </TouchableWithoutFeedback>
      <JobPreviewFooter onPhotoPress={() => setShowAddPhotos(true)} />
    </SafeAreaView>
  );
};

export default JobPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  headerContainer: {
    paddingVertical: 10,
  },
  title: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 16,
  },
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
});
