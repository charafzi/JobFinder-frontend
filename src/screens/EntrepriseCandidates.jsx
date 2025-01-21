import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Color } from "../constants/Color";
import { CandidatCard, LoadingIndicator } from "../components";
import showToast from "../utils/showToast";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import TopNavBar from "../components/TopNavBar";
import { acceptCandidature, declineCandidature, getCandidaturesByOffre } from "../redux/slices/candidatureEntreprise/candidaturesThunk";

const EntrepriseCandidates = ({ route }) => {
  const dispatch = useDispatch();
  const { candidatures, isLoading, error, currentPage, totalPages, last } = useSelector((state) => state.entrepCandidatures);
  const isLoadingMore = useRef(false);
  const currentScrollPosition = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);

  const params = {
    offreId: route.params.offerId,
    page: 0,
    size: 3
  };

  useEffect(() => {
    if (error) {
      showToast("error", "Error Entreprise Candidat", error);
    }
  }, [error]);

  useEffect(() => {
    if (currentPage === 0) {
      currentScrollPosition.current = 0;
    }
  }, [currentPage]);

  const loadCandidatures = useCallback(async (page = 0) => {
    console.log("loading candidatures");
    console.log("Dispatching getCandidaturesByOffre with params:", { ...params, page });
    try {
      const result = await dispatch(getCandidaturesByOffre({ ...params, page }));
      console.log("Dispatch result:", result);
    } catch (error) {
      console.error("Error dispatching getCandidaturesByOffre:", error);
    }
  }, [dispatch])

  const handleLoadMore = async () => {
    if (
      !totalPages ||
      isLoading ||
      last ||
      currentPage >= totalPages - 1 ||
      isLoadingMore.current ||
      !candidatures?.length
    ) return;

    isLoadingMore.current = true;
    try {
      await loadCandidatures(currentPage + 1);
    } finally {
      isLoadingMore.current = false;
    }
  };

  useEffect(() => {
    if (params.offreId) {
      loadCandidatures(0);
    }

  }, [loadCandidatures]);

  const handleAccept = (email, offreId) => {
    dispatch(acceptCandidature({ email, offreId }));
  };

  const handleDecline = (email, offreId) => {
    dispatch(declineCandidature({ email, offreId }));
  };

  const handleScroll = (event) => {
    currentScrollPosition.current = event.nativeEvent.contentOffset.y;
  };

  useEffect(() => {
    if (flatListRef.current && currentScrollPosition.current > 0 && params.page > 0) {
      flatListRef.current.scrollToOffset({
        offset: currentScrollPosition.current,
        animated: false
      });
    }
  }, [params.page]);

  const renderItem = useCallback(({ item }) => (
    <CandidatCard
      candidate={item}
      handleAccept={handleAccept}
      handleDecline={handleDecline}
    />
  ), []);

  const handleRefresh = useCallback(async () => {
    if (isLoading || isLoadingMore.current) return;
    setRefreshing(true)
    try {
      await loadCandidatures(0);
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, [isLoading, isLoadingMore.current, loadCandidatures]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    if (error) {
      return (
        <Text style={styles.emptyMessage}>
          Une erreur s'est produite : {error}
        </Text>
      );
    }
    return (
      <Text style={styles.emptyMessage}>
        Aucun candidat disponible.
      </Text>
    );
  }, [isLoading, error]);

  const renderFooter = () => {
    if (candidatures.length === 0) return null;
    return (
      <View style={styles.footerContainer}>
        {isLoading ? (
          <LoadingIndicator
            size={"large"}
          ></LoadingIndicator>
        ) : (
          <View style={styles.footerContainer}>
            <Entypo
              name="box"
              size={25}
              color={Color.placeholderText}
            />
            <Text style={styles.noMoreResult}>No more applications</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <TopNavBar></TopNavBar>
      <View style={styles.content}>
        <Text style={styles.header}>Candidates List</Text>
        {
          isLoading && !refreshing && !isLoadingMore ? (
            <LoadingIndicator />
          ) : (
            <FlatList
              ref={flatListRef}
              data={candidatures}
              renderItem={renderItem}
              keyExtractor={(item) => item.candidat.id.toString()}
              ListEmptyComponent={renderEmpty}
              onEndReached={handleLoadMore}
              onScroll={(event) => {
                currentScrollPosition.current = event.nativeEvent.contentOffset.y;
              }}
              onEndReachedThreshold={0.75}
              initialNumToRender={5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[Color.spinner]}
                  tintColor={Color.spinner}
                />
              }
              ListFooterComponent={renderFooter}
            />
          )}
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
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noMoreResult: {
    fontSize: 12,
    fontWeight: "bold",
    color: Color.placeholderText,
    padding: 10
  },
});