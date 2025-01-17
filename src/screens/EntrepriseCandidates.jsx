import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Color } from "../constants/Color";
import { CandidatCard } from "../components";
import localCandidates from "../data/data";
import axiosInstance, { API_BASE_URL } from "../config/axiosConfig";
import showToast from "../utils/showToast";

const EntrepriseCandidates = () => {

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandidates = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/api/candidature/33?page=0&size=10`);
      setCandidates(response.data.content);
    } catch (error) {
      setError(error.message);
      showToast(error, "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const updateCandidature = (updatedCandidature, status) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidature) =>
        candidature.candidat.id === updatedCandidature.candidat.id
          ? { ...candidature, status: status }
          : candidature
      )
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <CandidatCard
      candidate={item}
      onUpdateCandidature={updateCandidature} // Passer la fonction de mise à jour
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <View style={styles.content}>
        <Text style={styles.header}>Candidates List</Text>
        <FlatList
          data={candidates}
          renderItem={renderItem}
          keyExtractor={(item) => item.candidat.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>Aucun candidat disponible.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default EntrepriseCandidates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    color: Color.text,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    color: Color.text,
  },
});