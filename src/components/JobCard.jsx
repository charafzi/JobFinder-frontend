import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../constants/Color";
import React, { useCallback, useMemo } from "react";
import { logo } from "../../assets";
import { useNavigation } from "@react-navigation/native";

const MAX_REQUIREMENTS = 4;

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: "2-digit",
    minute: "2-digit"
  });
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
  } else {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }
};

const JobCard = ({ jobPoste }) => {

  const navigation = useNavigation();
  const handleViewPress = useCallback(() => {
    console.log("Icon press", jobPoste.id);
  }, [jobPoste.id]);


  const requirements = useMemo(() => {
    return (<View style={styles.requirementsContainer}>
      {jobPoste?.requirements?.slice(0, MAX_REQUIREMENTS).map((requirement, index) => (
        <Text key={index} style={styles.jobRequires}>
          {requirement}
        </Text>
      ))}
      {jobPoste?.requirements?.length > MAX_REQUIREMENTS && (
        <Text style={styles.viewMore}>
          +{jobPoste?.requirements?.length - MAX_REQUIREMENTS} more
        </Text>
      )}
    </View>
    );
  }, [jobPoste.requirements]);

  const timeAgo = useMemo(() => calculateTimeAgo(jobPoste.publicationDate), [jobPoste.publicationDate]);

  const handleJobOfferPress = () => {
    console.log(jobPoste.id);
    navigation.navigate('EntrepriseJobDetails', { offre: jobPoste });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handleJobOfferPress}>
      <View style={styles.row}>
        <Image source={logo} style={styles.entrepriseLogo} />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.title}>{jobPoste.position}</Text>
          <Text style={styles.subtitle}>
            {jobPoste.company?.name || 'Company'} • {jobPoste.adress?.city || 'Location'}
          </Text>
        </View>
      </View>
      {requirements}
      <View style={[styles.row]}>
        <Text style={styles.postedTime}>{timeAgo}</Text>
        <Text style={styles.salary}>{jobPoste?.salary || 0} DH</Text>
        <Text style={[styles.postedTime, { fontWeight: "bold" }]}>/Mo</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(JobCard);

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
  requirementsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  entrepriseLogo: {
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
  jobRequires: {
    backgroundColor: Color.boxBackground,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  viewMore: {
    color: Color.subtitle,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  postedTime: {
    fontSize: 10,
    color: Color.time,
  },
  salary: {
    fontSize: 14,
    fontWeight: "bold",
    color: Color.text,
    marginLeft: "auto",
  },
});
