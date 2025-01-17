import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../constants/Color";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axiosInstance, { API_BASE_URL } from "../config/axiosConfig";

const CandidateCard = ({ candidate, onUpdateCandidature }) => {
  const [isAccepted, setIsAccepted] = useState(candidate.status === "ACCEPTE");
  const [isDeclined, setIsDeclined] = useState(candidate.status === "REJETEE");
  const navigation = useNavigation();

  useEffect(() => {
    setIsAccepted(candidate.status === "ACCEPTE");
    setIsDeclined(candidate.status === "REJETEE");
  }, [candidate.status]);


  const handleViewProfile = () => {
    navigation.navigate("CandidateProfile", { candidate });
  };

  const acceptCandidature = async (email, offreId) => {
    try {
      const response = await axiosInstance.put('/api/candidature/accept', {
        email: email,
        offreId: offreId,
      });

      console.log('Candidature acceptée:', response.data);
      return { ...candidate, status: "ACCEPTE" };
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la candidature:', error);
      throw error;
    }
  };

  const handleAccept = async () => {
    try {
      const email = candidate.candidat.email;
      const offreId = candidate.offreEmploi.offreId;

      // Accepter la candidature via l'API
      const updatedCandidature = await acceptCandidature(email, offreId);

      // Mettre à jour la candidature dans la liste du parent
      onUpdateCandidature(updatedCandidature, "ACCEPTE");

      Alert.alert('Succès', 'La candidature a été acceptée avec succès.');

      // Mettre à jour l'état local
      setIsAccepted(true);
      setIsDeclined(false);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'acceptation de la candidature.');
      console.error('Erreur lors de l\'acceptation de la candidature:', error);
    }
  };


  const rejectCandidature = async (email, offreId) => {
    try {
      const response = await axiosInstance.put('/api/candidature/dismiss', {
        email: email,
        offreId: offreId,
      });

      console.log('Candidature refuseée:', response.data);
      return { ...candidate, status: "REJETEE" };
    } catch (error) {
      console.error('Erreur lors du refus de la candidature:', error);
      throw error;
    }
  };

  const handleDecline = async () => {
    try {
      const email = candidate.candidat.email;
      const offreId = candidate.offreEmploi.offreId;

      // Accepter la candidature via l'API
      const updatedCandidature = await rejectCandidature(email, offreId);

      // Mettre à jour la candidature dans la liste du parent
      onUpdateCandidature(updatedCandidature, "REJETEE");

      Alert.alert('Succès', 'La candidature a été refusée avec succès.');

      // Mettre à jour l'état local
      setIsDeclined(true);
      setIsAccepted(false);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du refus de la candidature.');
      console.error('Erreur lors du refus de la candidature:', error);
    }
  };

  const calculateTimeAgo = (dateString) => {
    if (!dateString) return "";

    const publicationDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - publicationDate) / 1000);

    // Calculer la différence en minutes, heures et jours
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else {
      return `${diffInSeconds} seconde${diffInSeconds === 1 ? "" : "s"} ago`;
    }
  };
  const concatName = useCallback((firstName, lastName) => {
    return (firstName + " " + lastName);
  }, [])

  const timeAgo = useMemo(() => calculateTimeAgo(candidate.dateCandidature), [candidate.dateCandidature]);

  const fullName = useMemo(() => concatName(
    candidate.candidat.firstName,
    candidate.candidat.lastName,
  ), [candidate.candidat.firstName, candidate.candidat.lastName]);

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handleViewProfile}>
      <View style={styles.row}>
        <Image source={{ uri: candidate.candidat.profilePicture }} style={styles.candidateImage} />
        <View style={{ marginLeft: 20, flex: 1, }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={styles.title}>{fullName}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
              <FontAwesome6 name="clock" size={16} color={Color.time} />
              <Text style={[styles.postedTime]}>{timeAgo}</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { marginTop: 5 }]}>
            {candidate.offreEmploi.poste} . {candidate.offreEmploi.ville}
          </Text>
        </View>
      </View>
      <View style={{ marginVertical: 10 }}>
        <Text style={[styles.title, { marginBottom: 10 }]}>{candidate.offreEmploi?.question || "What are the characteristics of a fake job call form?"}</Text>
        <Text style={styles.subtitle}>{candidate.offreEmploi?.response || "Because I always find fake job calls so I'm confused which job to take can you share your knowledge here? thank you"}</Text>
      </View>
      {/* Afficher les boutons uniquement si la candidature n'est pas encore acceptée */}
      {!isAccepted && !isDeclined && candidate.status === "ENVOYEE" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={handleDecline}>
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Afficher le statut si la candidature est acceptée ou refusée */}
      {isAccepted || candidate.status === "ACCEPTE" ? (
        <View style={[styles.statusContainer, styles.acceptedContainer]}>
          <FontAwesome name="check-circle" size={20} color={Color.success} />
          <Text style={[styles.statusText, styles.acceptedText]}>Candidature Acceptée</Text>
        </View>
      ) : isDeclined || candidate.status === "REFUSEE" ? (
        <View style={[styles.statusContainer, styles.declinedContainer]}>
          <FontAwesome name="times-circle" size={20} color={Color.error} />
          <Text style={[styles.statusText, styles.declinedText]}>Candidature Refusée</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default React.memo(CandidateCard);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 10, },
  candidateImage: {
    backgroundColor: "#D6CDFE",
    borderRadius: 30,
    width: 40,
    height: 40,
  },
  title: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: { color: Color.subtitle, fontSize: 12 },
  postedTime: {
    fontSize: 10,
    color: Color.time,
    marginLeft: 4,
  },
  salary: {
    fontSize: 14,
    fontWeight: "bold",
    color: Color.text,
    marginLeft: "auto",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: Color.selectedbutton,
  },
  declineButton: {
    backgroundColor: Color.unselectedbutton,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  acceptedContainer: {
    backgroundColor: "#E8F5E9", // Light green background
    borderColor: Color.success,
    borderWidth: 1,
  },
  declinedContainer: {
    backgroundColor: "#FFEBEE", // Light red background
    borderColor: Color.error,
    borderWidth: 1,
  },
  statusText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  acceptedText: {
    color: Color.success, // Green text
  },
  declinedText: {
    color: Color.error, // Red text
  },

});