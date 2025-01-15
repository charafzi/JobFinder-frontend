import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Color } from "../constants/Color";
import { profile, remotejobs } from "../../assets";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { JobCard } from "../components";
import DATA from "../data/data";
import TopNavBar from "../components/TopNavBar";

const ListHeaderComponent = () => {
  return (
    <>
      {/* Dashboard */}
      <View style={{ marginTop: 10 }}>
        <Text style={[styles.text, { paddingBottom: 10 }]}>Dashboard</Text>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#AFECFE",
              alignItems: "center",
              padding: 50,
              borderRadius: 10,
            }}
          >
            <Image
              source={remotejobs}
              style={{ marginVertical: 10, width: 40, height: 40 }}
            />
            <Text style={styles.text}>44.5k</Text>
            <Text>Remote Job</Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#BEAFFE",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                flex: 1,
                paddingHorizontal: 50,
              }}
            >
              <Text style={styles.text}>66.8k</Text>
              <Text>Full Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#FFD6AD",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                marginTop: 10,
                flex: 1,
              }}
            >
              <Text style={styles.text}>38.9k</Text>
              <Text>Part Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={[styles.text, { paddingBottom: 10 }]}>Recent Job List</Text>
    </>
  );
};

const EntrepriseHomeScreen = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight();

  const recentJobs = DATA.slice(0, 3);
  return (
    <SafeAreaView style={styles.mainContainer}>
        <TopNavBar
        theme={"purple"}
        showBackButton={false}
        showNotification={false}
        showWelcome={true}
        ></TopNavBar>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      {/* JobList */}
      <View style={styles.container}>
        <FlatList
          data={recentJobs}
          renderItem={({ item }) => <JobCard item={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={
            <View style={{ paddingBottom: tabBarHeight }}>
              {/* Bouton Show More */}
              {DATA.length > 3 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => navigation.navigate("entrepriseProjects")}
                >
                  <Text style={styles.showMoreText}>Voir Tout</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default EntrepriseHomeScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex : 1
    },
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 20,
  },
  text: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  showMoreButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Color.link,
    borderRadius: 10,
  },
  showMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
