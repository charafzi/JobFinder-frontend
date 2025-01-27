import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Color } from "../constants/Color";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ENTREPRISE_IMAGE_URL } from "../config/axiosConfig";
import { logo } from "../../assets";
import dayjs from "dayjs";

const MAX_REQUIREMENTS = 3;

const JobPreviewCard = ({ jobPoste }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { id } = useSelector((state) => state.auth);
  const { profilePicture } = useSelector((state) => state.entrepriseProfile);
  const exigencesTest = [
    {
      "requirement": "Bachelor's degree in Computer Science",
      "index": 0
    },
    {
      "requirement": "At least 2 years of experience in software development",
      "index": 1
    },
    {
      "requirement": "Proficiency in JavaScript and React",
      "index": 2
    },
    {
      "requirement": "Familiarity with RESTful APIs",
      "index": 3
    },
    {
      "requirement": "Strong problem-solving skills",
      "index": 4
    },
    {
      "requirement": "Experience with Node.js and Express.js",
      "index": 5
    },
    {
      "requirement": "Knowledge of PostgreSQL or MongoDB",
      "index": 6
    }
  ]
  

  const requirements = useMemo(() => {
    const requirementsList = jobPoste?.exigences || exigencesTest;
    const displayedRequirements = requirementsList.slice(0, MAX_REQUIREMENTS);
    return (
      <View style={styles.requirementsContainer}>
        {displayedRequirements.map((item, index) => (
          <Text key={index} style={styles.jobRequires}>
             {item.requirement}
          </Text>
        ))}
        {requirementsList.length > MAX_REQUIREMENTS && (
          <Text style={styles.viewMore}>
            +{requirementsList.length - MAX_REQUIREMENTS} more
          </Text>
        )}
      </View>
    );
  }, [jobPoste?.exigences]);
  return (
    <View style={styles.jobCardContainer}>
      <View style={styles.jobCardHeader}>
        <View style={styles.leftContent}>
          <Image source={profilePicture ? {
            uri: ENTREPRISE_IMAGE_URL + id,
          } : logo} style={styles.iconStyle} resizeMode="center" />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{jobPoste?.poste || "job Poste"}</Text>
            <Text style={styles.description}>
              {jobPoste?.title || "job title"}
            </Text>
            <Text style={styles.subtitle}>
              {jobPoste?.city || "job city"} . {jobPoste?.typeContrat || "job type contrat"}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setShowDetails(!showDetails)}>
        <Text style={styles.buttonText}>
          {showDetails ? "Close" : "Job details"}
        </Text>
      </TouchableOpacity>
      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailTitle}>Description</Text>
          <Text style={styles.detailText}>{jobPoste?.description || "job description"}</Text>

          <Text style={styles.detailTitle}>Requirements</Text>
          {requirements}

          <Text style={styles.detailTitle}>Salary</Text>
          <Text style={styles.detailText}>{jobPoste?.salaire || "6000"} Dh</Text>

          <Text style={styles.detailTitle}>Deadline</Text>
          <Text style={styles.detailText}>
            {dayjs(jobPoste?.dateLimite).format("DD/MM/YYYY") || "DD/MM/YYYY"}
          </Text>

          <Text style={styles.detailTitle}>Location</Text>
          <Text style={styles.detailText}>{jobPoste?.address || "job address"}, {jobPoste?.city || "job city"}</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(JobPreviewCard);

const styles = StyleSheet.create({
  jobCardContainer: {
    backgroundColor: Color.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  jobCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 20,
  },
  iconStyle: {
    backgroundColor: "#C4C4C4",
    borderRadius: 30,
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: Color.text,
  },
  description: {
    fontSize: 12,
    fontWeight: "regular",
    marginVertical: 10,
    color: Color.text,
  },
  subtitle: {
    color: Color.subtitle,
    fontSize: 14,
  },
  bookmarkIcon: {
    padding: 4,
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 35,
    paddingVertical: 15,
    marginTop: 30,
    alignSelf: "center",
    borderColor: Color.text,
  },
  buttonText: {
    color: Color.text,
    textAlign: "center",
    fontWeight: "regular",
    fontSize: 12,
  },
  detailsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  detailTitle: {
    fontWeight: "bold",
    color: Color.text,
    marginTop: 10,
    fontSize: 14,
  },
  detailText: {
    color: Color.text,
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 12,
  },
  requirementsContainer: {
    marginBottom: 10,
  },
  jobRequires: {
    backgroundColor: Color.boxBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  viewMore: {
    color: Color.subtitle,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
    textAlign: "center",
  },
});
