import {FlatList, Image, RefreshControl, Text, View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import JobCardSearchPreview from "../components/JobCardSearchPreview";
import {LoadingIndicator, Search} from "../components";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Color} from "../constants/Color";
import {searchOffres} from "../redux/slices/offres/searchOffresThunk";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import {useScrollToTop} from "@react-navigation/native";
import {clearCandidatures} from "../redux/slices/candidaturesCandidat/candidaturesSlice";
import {getCandidaturesByUserId} from "../redux/slices/candidaturesCandidat/candidaturesThunk";
import {clearSearchOffres} from "../redux/slices/offres/offreSlice";
import showToast from "../utils/showToast";

const SearchScreen = ()=>{
    const dispatch = useDispatch();
    const { searchOffresList, isLoading, params, last, totalPages,error } = useSelector((state) => state.offres);
    const currentScrollPosition = useRef(0);
    const flatListRef = useRef(null);
    const isLoadingMore = useRef(false);
    const [refreshing, setRefreshing] = useState(false);

    useScrollToTop(flatListRef);

    useEffect(() => {
        // load initial search
        /*dispatch(searchOffres({
            keyword : "",
            page: 0
        }));*/
    }, []);

    useEffect(() => {
        if (error) {
            showToast("error", "Login failed", error);
        }
    }, [error]);

    const handleRefresh = useCallback(async () => {
        if (isLoading) return;

        setRefreshing(true);
        try {
            dispatch(clearSearchOffres());
            await dispatch(searchOffres({
                keyword : "",
                page: 0
            }));

        } finally {
            setRefreshing(false);
        }
    }, [isLoading]);

    const handleLoadMore = async () => {
        if (!totalPages) return;

        if (!isLoading && !last && params.page < totalPages - 1 && !isLoadingMore.current) {
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
        }
    };

    // this for storing the position of scrolling
    const handleScroll = (event) => {
        currentScrollPosition.current = event.nativeEvent.contentOffset.y;
    };

    useEffect(() => {
        if(params.page === 0){
            currentScrollPosition.current=0;
        }
    }, [params.page]);

    // save the current position at scrolling list when new data is fetched
    useEffect(() => {
        if (flatListRef.current && currentScrollPosition.current > 0 && params.page > 0) {
            flatListRef.current.scrollToOffset({
                offset: currentScrollPosition.current,
                animated: false
            });
        }
    }, [params.page]);

    const keyExtractor = React.useCallback((item) => item.id.toString(), []);

    const renderItem = React.useCallback(({ item }) => (
        <JobCardSearchPreview key={item.id} jobPoste={item} />
    ), []);

    const renderFooter = () => {
        if (searchOffresList.length === 0) return null;
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
                        <Text style={styles.noMoreResult}>No More Job Offers</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderEmpty = () =>{
        return(
            <View style={styles.noMoreResultContainer}>
                <Image
                    style={styles.noResultImage}
                    source={require('../../assets/no_result.png')}
                >
                </Image>
                <Text style={styles.noResult}>No results found</Text>
                <Text style={styles.noResultDesc}>The search could not be found, please check spelling or write another word.</Text>
            </View>
        )
    }

    return (
        <View style={styles.mainContainer}>
            <TopNavBar
                showBackButton={false}
                theme={"purple"}
            ></TopNavBar>
            <View style={styles.searchBar}>
                <Search></Search>
            </View>

            {isLoading &&
                <View style={styles.loadingContainer}>
                <LoadingIndicator size={"large"} isLoading={isLoading} ></LoadingIndicator>
            </View>}

            {!isLoading && <FlatList
                data={searchOffresList}
                contentContainerStyle={styles.flatListContent}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.75}
                ListFooterComponentStyle={styles.footerList}
                ListFooterComponent={renderFooter}
                ref={flatListRef}
                windowSize={5}
                initialNumToRender={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
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
    )
}

const styles = StyleSheet.create({
    mainContainer:{
      flex : 1
    },
    flatListContent: {
        flexGrow: 1,
    },
    searchBar: {
        paddingHorizontal: 5,
        marginTop: 10,
        marginBottom: 20
    },
    noResultContainer : {
        marginVertical: '50%',
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: '50%'
    },
    noResult :{
        fontSize: 16,
        fontWeight : "bold",
        paddingVertical: 10
    },
    noResultDesc :{
        fontSize: 14,
        paddingVertical: 10,
        paddingHorizontal: 50,
        textAlign: "center"
    },
    loadMoreButton: {
        backgroundColor: Color.primary,
        paddingVertical: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    loadMoreText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    noMoreResultContainer:{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
        marginVertical : '50%'
    },
    noMoreResult:{
        fontSize: 12,
        fontWeight: "bold",
        color: Color.placeholderText,
        padding: 10
    },
    footerList: {
        paddingBottom: 20
    },
    loadingContainer:{
        flex : 1,
        justifyContent : "center"
    },
    footerContainer : {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    }
})

export default SearchScreen;