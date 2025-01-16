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

const CandidatApplicationsScreen = ()=>{
    const dispatch = useDispatch();
    const { candidatures, isLoading, last, totalPages,currentPage } = useSelector((state) => state.candidatures);
    const { id } = useSelector((state) => state.auth);
    const currentScrollPosition = useRef(0);
    const flatListRef = useRef(null);
    const isLoadingMore = useRef(false);
    useScrollToTop(flatListRef);

    const params = {
        id: id,
        page: 0,
        size: 3
    };

    const handleLoadMore = async () => {
        if (!totalPages) return;
        if (!isLoading && !last && currentPage < totalPages - 1 && !isLoadingMore.current) {
            try {
                isLoadingMore.current = true;
                dispatch(getCandidaturesByUserId({
                    ...params,
                    page: currentPage + 1,
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
        // load initial condidatures
        dispatch(getCandidaturesByUserId({
            id : params.id,
            size : params.size,
            page : params.page
        }))
    }, [id]);

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

    const keyExtractor = React.useCallback((item, index) => `${item.offre.id}-${item.cvDocId}-${index}`, []);

    const renderItem = React.useCallback(({ item }) => (
        <ApplicationCard key={item.id} application={item} />
    ), []);

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

    const renderEmpty = () =>{
        return(
            <View style={styles.noMoreResultContainer}>
                <AntDesign
                    name="file1"
                    size={25}
                    color={Color.icon3}>
                </AntDesign>
                <Text style={styles.noResult}>No Applications Yet</Text>
                <Text style={styles.noResultDesc}>Start applying to job offers to see your applications here</Text>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.mainContainer}>
            <TopNavBar></TopNavBar>

            {isLoading &&
                <View style={styles.loadingContainer}>
                    <LoadingIndicator size={"large"} isLoading={isLoading} ></LoadingIndicator>
                </View>}

            {!isLoading && <FlatList
                data={candidatures}
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
            />}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    mainContainer:{
        flex : 1
    },
    flatListContent: {
        flexGrow: 1,
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
export default CandidatApplicationsScreen;