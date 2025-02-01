import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Color } from "../constants/Color";
import {
  JobPreviewCard,
  JobPreviewDescription,
  JobPreviewFooter,
  JobPreviewHeader,
} from "../components";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { createEntrepriseOffre } from "../redux/slices/entrepriseOffres/createEntrepriseOffreThunk";

const JobPreview = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { id: companyId, name: entrepriseName } = useSelector((state) => state.auth);
  const { city: entrepriseVille } = useSelector((state) => state.auth.entreprise.adress);
  const {
    titre,
    description,
    poste,
    exigences,
    typeContrat,
    salaire,
    dateLimite,
    address,
    city,
    longitude,
    latitude,
    question,
  } = route.params || {};
  const jobPoste = {
    title: titre,
    requirements: exigences || [],
    poste: poste,
    city: city,
    typecontract: typeContrat,
    description: description,
    salaire: salaire,
    dateLimite: dateLimite,
    address: address,
  };


  const onSubmit = async () => {
    const payload = {
      title: titre,
      description: description,
      position: poste,
      requirements: exigences || [],
      contractType: typeContrat,
      salary: parseFloat(salaire),
      deadlineDate: dayjs(dateLimite).format("YYYY-MM-DDTHH:mm:ss"),
      companyId: companyId,
      adress: {
        city: city,
        adress: address,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
      },
      question: question,
    };
    dispatch(createEntrepriseOffre(payload))
      .unwrap()
      .then(() => {
        navigation.navigate("tabNavigator", { screen: "home" });
      })
      .catch((error) => {
        console.error("Error creating job:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <ScrollView onPress={Keyboard.dismiss}>
        <View style={{ padding: 15 }}>
          <JobPreviewHeader
            navigation={navigation}
            entrepriseName={entrepriseName}
            entrepriseVille={entrepriseVille}
          />
          <JobPreviewDescription
            titre={titre}
            jobDescription={description}
            jobPreviewCard={
              <JobPreviewCard jobPoste={jobPoste} />
            }
          />
        </View>
      </ScrollView>
      <JobPreviewFooter
        onSubmit={onSubmit}
      />
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
