import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useRef } from "react";
import { Color } from "../constants/Color";
import { JobCard } from "../components";
import DATA from "../data/data";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";

const EntrepriseProjects = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const ref = useRef(null);
  useScrollToTop(ref);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <View>
        <Text style={styles.header}>Job List</Text>
        <FlatList
          ref={ref}
          data={DATA}
          renderItem={({ item }) => <JobCard item={item} />}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <View style={{ paddingBottom: tabBarHeight }} ></View>
          }
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
