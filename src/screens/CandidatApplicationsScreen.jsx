import {FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ApplicationCard from "../components/ApplicationCard";
import {useDispatch, useSelector} from "react-redux";
import {getCandidaturesByUserId} from "../redux/slices/candidaturesCandidat/candidaturesThunk";
import {LoadingIndicator} from "../components";
import Entypo from "@expo/vector-icons/Entypo";
import {Color} from "../constants/Color";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useScrollToTop} from "@react-navigation/native";
import {clearCandidatures} from "../redux/slices/candidaturesCandidat/candidaturesSlice";
import showToast from "../utils/showToast";

const CandidatApplicationsScreen = () => {
    const dispatch = useDispatch();
    const { candidatures, isLoading, last, totalPages, currentPage, error } = useSelector((state) => state.candidatures);
    const { id } = useSelector((state) => state.auth);
    const currentScrollPosition = useRef(0);
    const flatListRef = useRef(null);
    const isLoadingMore = useRef(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useScrollToTop(flatListRef);

    const params = {
        id: id,
        page: 0,
        size: 3
    };

    const initialLoad = async () => {
        try {
            await dispatch(getCandidaturesByUserId({
                id: params.id,
                size: params.size,
                page: params.page
            }));
        } finally {
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        if (id) {
            initialLoad();
        }
    }, [id]);

    useEffect(() => {
        if (error) {
            showToast("error", "Loading applications failed", error);
        }
    }, [error]);

    const handleRefresh = useCallback(async () => {
        if (isLoading) return;

        setRefreshing(true);
        try {
            dispatch(clearCandidatures());
            await dispatch(getCandidaturesByUserId({
                id: params.id,
                size: params.size,
                page: 0
            }));
        } finally {
            setRefreshing(false);
        }
    }, [isLoading, id]);

    const handleLoadMore = useCallback(async () => {
        if (!totalPages || isLoadingMore.current || isLoading || last || currentPage >= totalPages - 1) {
            return;
        }

        try {
            isLoadingMore.current = true;
            await dispatch(getCandidaturesByUserId({
                ...params,
                page: currentPage + 1,
            }));
        } finally {
            isLoadingMore.current = false;
        }
    }, [totalPages, isLoading, last, currentPage, params, id]);

    const handleScroll = useCallback((event) => {
        currentScrollPosition.current = event.nativeEvent.contentOffset.y;
    }, []);

    useEffect(() => {
        if (currentPage === 0) {
            currentScrollPosition.current = 0;
        }
    }, [currentPage]);

    useEffect(() => {
        if (flatListRef.current && currentScrollPosition.current > 0 && currentPage > 0) {
            flatListRef.current.scrollToOffset({
                offset: currentScrollPosition.current,
                animated: false
            });
        }
    }, [currentPage]);

    const keyExtractor = useCallback((item, index) =>
      `${item.offre.id}-${item.cvDocId}-${index}`, []);

    const renderItem = useCallback(({ item }) => (
      <ApplicationCard key={item.id} application={item} />
    ), []);

    const renderFooter = useCallback(() => {
        if (candidatures.length === 0) return null;

        if (isLoading && !isInitialLoad) {
            return (
              <View style={styles.footerContainer}>
                  <LoadingIndicator size="large" />
              </View>
            );
        }

        if (last || currentPage >= totalPages - 1) {
            return (
              <View style={styles.footerContainer}>
                  <Entypo
                    name="box"
                    size={25}
                    color={Color.placeholderText}
                  />
                  <Text style={styles.noMoreResult}>No more applications</Text>
              </View>
            );
        }

        return null;
    }, [isLoading, isInitialLoad, last, currentPage, totalPages, candidatures.length]);

    const renderEmpty = useCallback(() => (
      <View style={styles.noMoreResultContainer}>
          <AntDesign
            name="file1"
            size={25}
            color={Color.icon3}
          />
          <Text style={styles.noResult}>No Applications Yet</Text>
          <Text style={styles.noResultDesc}>
              Start applying to job offers to see your applications here
          </Text>
      </View>
    ), []);

    if (isInitialLoad && isLoading) {
        return (
          <SafeAreaView style={styles.mainContainer}>
              <TopNavBar />
              <View style={styles.loadingContainer}>
                  <LoadingIndicator size="large" />
              </View>
          </SafeAreaView>
        );
    }

    return (
      <SafeAreaView style={styles.mainContainer}>
          <TopNavBar />
          <FlatList
            data={candidatures}
            contentContainerStyle={styles.flatListContent}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponentStyle={styles.footerList}
            ListFooterComponent={renderFooter}
            ref={flatListRef}
            onScroll={handleScroll}
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
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    flatListContent: {
        flexGrow: 1,
    },
    noMoreResultContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: '30%'
    },
    noResult: {
        fontSize: 16,
        fontWeight: "bold",
        paddingVertical: 10
    },
    noResultDesc: {
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 50,
        textAlign: "center"
    },
    noMoreResult: {
        fontSize: 12,
        fontWeight: "bold",
        color: Color.placeholderText,
        padding: 10
    },
    footerList: {
        paddingBottom: 20
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center"
    },
    footerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20
    }
});

export default CandidatApplicationsScreen;