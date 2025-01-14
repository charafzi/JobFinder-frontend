import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, {useEffect, useState} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Color } from "../constants/Color";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {clearSearchOffres, setKeyword} from "../redux/slices/offres/offreSlice";
import {searchOffres} from "../redux/slices/offres/searchOffresThunk";

const Search = () => {
  const dispatch = useDispatch();
  const { params } = useSelector((state) => state.offres);
  const { keyword } = params;
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // update SearchQuery if keyword changed
    if (keyword !== searchQuery) {
      setSearchQuery(keyword);
    }
  }, [keyword]);

  const handleSearch = (event) => {
    let query = event?.nativeEvent?.text || "";
    query = query.trim();

    setSearchQuery(query);
    dispatch(clearSearchOffres())
    dispatch(searchOffres({...params,keyword : query, page : 0}));
  };

  const handleFilterPress = ()=>{
    // update keyword state to conserve query when navigating to filter page
    dispatch(setKeyword(searchQuery));
    navigation.navigate("Filter")
  }
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          placeholderTextColor={Color.placeholderText}
          autoCorrect={false}
          style={{ flex: 1 }}
          clearButtonMode="always"
          onSubmitEditing={handleSearch}
        />
      </View>
      <TouchableOpacity style={styles.filterContainer} onPress={handleFilterPress}>
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
