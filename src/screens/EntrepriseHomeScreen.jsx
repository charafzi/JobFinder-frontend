import {
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { Color } from "../constants/Color";
import { logo, profile, remotejobs } from "../../assets";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const EntrepriseHomeScreen = ({ route }) => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentStyle={{ paddingBottom: tabBarHeight }}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.name}>Welcome Back </Text>
              <Text style={styles.name}>{route.params?.name || "Google"}</Text>
            </View>
            <Image source={profile} style={{ marginLeft: 10 }} />
          </View>
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

          <View style={{ marginTop: 10 }}>
            <Text style={[styles.text, { paddingBottom: 10 }]}>
              Recent Job List
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 20,
                marginVertical: 15,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={logo}
                  style={{
                    backgroundColor: "#D6CDFE",
                    borderRadius: 30,
                    width: 40,
                    height: 40,
                  }}
                  resizeMode="center"
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.text}>Product Designer</Text>
                  <Text style={{ color: Color.subtitle }}>
                    Google inc . California, USA
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={styles.text}>$15k</Text>
                <Text style={{ color: Color.subtitle }}>/Mo</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View
                  style={{
                    backgroundColor: "#CBC9D4",
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: Color.subtitle }}>Senior designer</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#CBC9D4",
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: Color.subtitle }}>Senior designer</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 20,
                marginVertical: 15,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={logo}
                  style={{
                    backgroundColor: "#D6CDFE",
                    borderRadius: 30,
                    width: 40,
                    height: 40,
                  }}
                  resizeMode="center"
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={styles.text}>Product Designer</Text>
                  <Text style={{ color: Color.subtitle }}>
                    Google inc . California, USA
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={styles.text}>$15k</Text>
                <Text style={{ color: Color.subtitle }}>/Mo</Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View
                  style={{
                    backgroundColor: "#CBC9D4",
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: Color.subtitle }}>Senior designer</Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#CBC9D4",
                    borderRadius: 10,
                    padding: 10,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: Color.subtitle }}>Senior designer</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EntrepriseHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    color: Color.text,
  },
  text: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 16,
  },
});
