import {FlatList, Image, RefreshControl, Text, View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import JobCardSearchPreview from "../components/JobCardSearchPreview";
import {LoadingIndicator, Search} from "../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Color} from "../constants/Color";
import {searchOffres} from "../redux/slices/offres/searchOffresThunk";
import Entypo from "@expo/vector-icons/Entypo";
import {useScrollToTop} from "@react-navigation/native";
import {clearSearchOffres} from "../redux/slices/offres/offreSlice";
import showToast from "../utils/showToast";
import {useAuthCheck} from "../hooks/useAuthCheck";

const SearchScreen = () => {
    const dispatch = useDispatch();
    const { searchOffresList, isLoading, params, last, totalPages, error } = useSelector((state) => state.offres);
    const currentScrollPosition = useRef(0);
    const flatListRef = useRef(null);
    const isLoadingMore = useRef(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useScrollToTop(flatListRef);

    useEffect(() => {
        if (error) {
            showToast("error", "Search failed", error);
        }
    }, [error]);

    useEffect(() => {
        initialLoad();
    }, []);

    const initialLoad = async () => {
        try {
            await dispatch(searchOffres({
                keyword: "",
                page: 0
            }));
        } finally {
            setIsInitialLoad(false);
        }
    };

    const handleRefresh = useCallback(async () => {
        if (isLoading) return;

        setRefreshing(true);
        try {
            dispatch(clearSearchOffres());
            await dispatch(searchOffres({
                keyword: "",
                page: 0
            }));
        } finally {
            setRefreshing(false);
        }
    }, [isLoading]);

    const handleLoadMore = useCallback(async () => {
        if (!totalPages || isLoadingMore.current || isLoading || last || params.page >= totalPages - 1) {
            return;
        }

        try {
            isLoadingMore.current = true;
            const nextPage = params.page + 1;
            await dispatch(searchOffres({
                ...params,
                page: nextPage
            }));
        } finally {
            isLoadingMore.current = false;
        }
    }, [totalPages, isLoading, last, params, dispatch]);

    const handleScroll = useCallback((event) => {
        currentScrollPosition.current = event.nativeEvent.contentOffset.y;
    }, []);

    useEffect(() => {
        if (params.page === 0) {
            currentScrollPosition.current = 0;
        }
    }, [params.page]);

    useEffect(() => {
        if (flatListRef.current && currentScrollPosition.current > 0 && params.page > 0) {
            flatListRef.current.scrollToOffset({
                offset: currentScrollPosition.current,
                animated: false
            });
        }
    }, [params.page]);

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    const renderItem = useCallback(({ item }) => (
      <JobCardSearchPreview key={item.id} jobPoste={item} />
    ), []);

    const renderFooter = useCallback(() => {
        if (searchOffresList.length === 0) return null;

        if (isLoading && !isInitialLoad) {
            return (
              <View style={styles.footerContainer}>
                  <LoadingIndicator size="large" />
              </View>
            );
        }

        if (last || params.page >= totalPages - 1) {
            return (
              <View style={styles.footerContainer}>
                  <Entypo
                    name="box"
                    size={25}
                    color={Color.placeholderText}
                  />
                  <Text style={styles.noMoreResult}>No More Job Offers</Text>
              </View>
            );
        }

        return null;
    }, [isLoading, isInitialLoad, last, params.page, totalPages, searchOffresList.length]);

    const renderEmpty = useCallback(() => (
      <View style={styles.noMoreResultContainer}>
          <Image
            style={styles.noResultImage}
            source={require('../../assets/no_result.png')}
          />
          <Text style={styles.noResult}>No results found</Text>
          <Text style={styles.noResultDesc}>
              The search could not be found, please check spelling or write another word.
          </Text>
      </View>
    ), []);


    return (
      <View style={styles.mainContainer}>
          <TopNavBar showBackButton={false} theme="purple" showWelcome={true}/>
          <View style={styles.searchBar}>
              <Search />
          </View>
          {isInitialLoad && isLoading &&
            <View style={styles.loadingContainer}>
              <LoadingIndicator size="large" />
          </View>}
          { (!isInitialLoad || !isLoading) && <FlatList
            data={searchOffresList}
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
          />}
      </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    flatListContent: {
        flexGrow: 1,
    },
    searchBar: {
        paddingHorizontal: 5,
        marginTop: 10,
        marginBottom: 20
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

export default SearchScreen;