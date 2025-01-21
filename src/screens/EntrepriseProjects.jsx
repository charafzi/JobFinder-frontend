import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { Color } from "../constants/Color";
import { JobCard, LoadingIndicator } from "../components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useScrollToTop } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getEntrepriseOffres } from "../redux/slices/entrepriseOffres/getEntrepriseOffresThunk";
import showToast from "../utils/showToast";

const EntrepriseProjects = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    entrepriseOffresList,
    error,
    isLoading,
    last,
    totalPages,
    pageNo,
    size,
    sortBy,
    sortDirection,
  } = useSelector((state) => state.entrepriseOffres);

  const { id: entrepriseId } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const flatListref = useRef(null);
  const currentScrollPosition = useRef(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useScrollToTop(flatListref);

  useEffect(() => {
    if (error) {
      showToast("error", "Error", error);
    }
  }, [error]);

  useEffect(() => {
    if (pageNo === 0) {
      currentScrollPosition.current = 0;
    }
  }, [pageNo]);

  const loadOffres = useCallback(async (page = 0) => {
    if (entrepriseId) {
      return dispatch(getEntrepriseOffres({
        entrepriseId,
        page,
        size,
        sortBy,
        sortDirection,
      }));
    }
  }, [entrepriseId, size, sortBy, sortDirection, dispatch]);

  const handleLoadMore = async () => {
    if (
      !totalPages ||
      isLoading ||
      last ||
      pageNo >= totalPages - 1 ||
      isLoadingMore ||
      !entrepriseOffresList?.length
    ) return;

    setIsLoadingMore(true);
    try {
      await loadOffres(pageNo + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    if (isLoading || isLoadingMore) return;

    setRefreshing(true);
    try {
      await loadOffres(0);
    } finally {
      setRefreshing(false);
    }
  }, [loadOffres, isLoading, isLoadingMore]);

  useEffect(() => {
    loadOffres(0);
  }, [loadOffres]);

  const renderItem = useCallback(({ item }) => (
    <JobCard key={item.id} jobPoste={item} />
  ), []);

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
        Aucune offre disponible pour cette entreprise.
      </Text>
    );
  }, [isLoading, error]);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <LoadingIndicator />;
    }
    return <View style={{ paddingBottom: tabBarHeight + 30, marginBottom: tabBarHeight }} />;
  }, [tabBarHeight, isLoadingMore]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
      <View style={styles.content}>
        <Text style={styles.header}>Job List</Text>
        {isLoading && !refreshing && !isLoadingMore ? (
          <LoadingIndicator />
        ) : (
          <FlatList
            ref={flatListref}
            data={entrepriseOffresList || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.75}
            onScroll={(event) => {
              currentScrollPosition.current = event.nativeEvent.contentOffset.y;
            }}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Color.spinner]}
                tintColor={Color.spinner}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default EntrepriseProjects;

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