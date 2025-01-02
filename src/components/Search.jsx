import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color } from "../constants/Color";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.searchInputContainer]}>
        <AntDesign
          name="search1"
          size={24}
          color={Color.placeholderText}
          style={styles.icon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={Color.placeholderText}
          autoCorrect={false}
          onChangeText={(query) => handleSearch}
          style={{ flex: 1 }}
          clearButtonMode="always"
          value={searchQuery}
        />
      </View>
      <TouchableOpacity style={styles.filterContainer}>
        <Ionicons name="filter-sharp" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    height: 55,
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    paddingRight: 15,
    padding: 10,
  },
  filterContainer: {
    backgroundColor: Color.link,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
  },
});
