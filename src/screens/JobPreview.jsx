import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Color } from "../constants/Color";
import {
  JobPreviewCard,
  JobPreviewDescription,
  JobPreviewFooter,
  JobPreviewHeader,
  LoadingIndicator,
} from "../components";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { createEntrepriseOffre } from "../redux/slices/entrepriseOffres/createEntrepriseOffreThunk";

const JobPreview = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.entrepriseOffres);
  const {
    title,
    description,
    position,
    exigences,
    contractType,
    salary,
    deadlineDate,
    adress,
    question,
  } = route.params || {};

  console.log("JobPreview - Received Deadline Date:", deadlineDate);

  useEffect(() => {
    if (error) {
      showToast("error", "Error", error);
    }
  }, [error]);

  const jobPoste = {
    title: title,
    requirements: exigences || [],
    position: position,
    city: adress.city,
    contractType: contractType,
    description: description,
    salary: salary,
    deadlineDate: deadlineDate,
    address: adress.adress,
    question: question,
  };

  console.log("JobPreview - JobPoste Deadline Date:", jobPoste.deadlineDate);

  const onSubmit = async () => {
    const publicationDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
    // Make sure deadlineDate is a valid date string
    const formattedDeadlineDate = deadlineDate ? dayjs(deadlineDate).format("YYYY-MM-DDTHH:mm:ss") : null;

    const payload = {
      title: title,
      description: description,
      position: position,
      requirements: exigences || [],
      contractType: contractType,
      salary: parseFloat(salary),
      status: "active",
      question: question,
      publicationDate: publicationDate,
      deadlineDate: formattedDeadlineDate,
      company: {
        id: id
      },
      adress: {
        city: adress.city,
        adress: adress.adress,
        longitude: parseFloat(adress.longitude),
        latitude: parseFloat(adress.latitude)
      }
    };

    try {
      await dispatch(createEntrepriseOffre(payload)).unwrap();
      navigation.navigate('tabNavigator', {
        screen: 'home',
        params: {
          refresh: true // Optional: Add this if you want to trigger a refresh
        }
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <ScrollView onPress={Keyboard.dismiss}>
        <View style={{ padding: 15 }}>
          <JobPreviewHeader
            navigation={navigation}
          />
          <JobPreviewDescription
            title={title}
            jobDescription={description}
            jobPreviewCard={
              <JobPreviewCard jobPoste={jobPoste} />
            }
          />
        </View>
      </ScrollView>
      {isLoading ? (
        <LoadingIndicator isLoading={isLoading}/>
      ) : (
        <JobPreviewFooter
          onSubmit={onSubmit}
        />
      )}
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
