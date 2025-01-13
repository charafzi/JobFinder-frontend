import {FlatList, Image, ScrollView, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import JobCardSearchPreview from "../components/JobCardSearchPreview";
import {Search} from "../components";
import React from "react";
import {StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Color} from "../constants/Color";

const SearchScreen = ()=>{
    const dispatch = useDispatch();
    const { searchOffres,isLoading, params: { keyword, page } = {},last } = useSelector((state) => state.offres);

    const handleLoadMore = async () => {
        if (!last) {
            await dispatch(
                searchOffres({
                    keyword,
                    page: page + 1,
                })
            );
        }
    };

    return (
        <View>
            <TopNavBar
                showBackButton={false}
                theme={"purple"}
            ></TopNavBar>
            <View style={styles.searchBar}>
                <Search></Search>
            </View>

            <FlatList
                data={searchOffres}
                contentContainerStyle={{
                    paddingBottom: 60,
                }}
                scrollIndicatorInsets={{ right: 1, bottom: 60 }}
                ListEmptyComponent={
                    <View style={styles.noResultContainer}>
                        <Image source={require('../../assets/no_result.png')}>
                        </Image>
                        <Text style={styles.noResult}>No results found</Text>
                        <Text style={styles.noResultDesc}>The search could not be found, please check spelling or write another word.</Text>
                    </View>
                }
                renderItem={({item, index, separators}) => (
                    <JobCardSearchPreview
                        jobPoste={item}
                    ></JobCardSearchPreview>
                )}
                ListFooterComponent={
                    !last ? (
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={handleLoadMore}
                            disabled={isLoading}
                        >
                            <Text style={styles.loadMoreText}>
                                {isLoading ? "Loading..." : "Load More"}
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
                keyExtractor={(item, index) => `${item.id}-${index}`}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        paddingHorizontal: 5,
        marginTop: 10,
        marginBottom: 20
    },
    noResultContainer : {
        marginVertical: 160,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
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
})

export default SearchScreen;