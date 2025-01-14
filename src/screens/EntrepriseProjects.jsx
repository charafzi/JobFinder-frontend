import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Color } from "../constants/Color";
import { JobCard } from "../components";
import DATA from "../data/data";

const EntrepriseProjects = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <View>
        <Text style={styles.header}>Job List</Text>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <JobCard item={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default EntrepriseProjects;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 20,
  },
  header: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
