import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Color } from "../constants/Color";
import React from "react";

const MAX_TAGS = 3;

const JobCard = ({ item }) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.row}>
        <Image source={{ uri: item?.logo }} style={styles.entrepriseLogo} />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.subtitle}>
            {item?.company} . {item?.location}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        {item?.tags.slice(0, MAX_TAGS).map((tag, index) => (
          <Text key={index} style={styles.jobRequires}>
            {tag}
          </Text>
        ))}
        {item?.tags.length > MAX_TAGS && (
          <Text style={styles.viewMore}>
            +{item?.tags.length - MAX_TAGS} more
          </Text>
        )}
      </View>
      <View style={[styles.row]}>
        <Text style={styles.salary}>{item?.salary}</Text>
        <Text style={styles.postedTime}>{item?.postedTime}</Text>
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
  row: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
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
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginRight: 5,
    fontSize: 12,
  },
  viewMore: {
    color: Color.subtitle,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  postedTime: {
    fontSize: 12,
    color: "#888",
    marginLeft: "auto",
  },
  salary: {
    fontSize: 14,
    fontWeight: "bold",
    color: Color.text,
  },
});
