import React, { useCallback, useEffect, useRef } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Color } from "../constants/Color";
import { remotejobs } from "../../assets";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { JobCard, LoadingIndicator } from "../components";
import { useScrollToTop } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getEntrepriseOffres } from "../redux/slices/entrepriseOffres/getEntrepriseOffresThunk";
import showToast from "../utils/showToast";
import TopNavBar from "../components/TopNavBar";


const ListHeaderComponent = () => {
    return (
        <>
            {/* Dashboard */}
            <View style={{ marginTop: 10 }}>
                <Text style={[styles.text, { paddingBottom: 10 }]}>Dashboard</Text>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#AFECFE",
                            alignItems: "center",
                            padding: 50,
                            borderRadius: 10,
                        }}
                    >
                        <Image
                            source={remotejobs}
                            style={{ marginVertical: 10, width: 40, height: 40 }}
                        />
                        <Text style={styles.text}>44.5k</Text>
                        <Text>Remote Job</Text>
                    </TouchableOpacity>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#BEAFFE",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                                flex: 1,
                                paddingHorizontal: 50,
                            }}
                        >
                            <Text style={styles.text}>66.8k</Text>
                            <Text>Full Time</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#FFD6AD",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 10,
                                marginTop: 10,
                                flex: 1,
                            }}
                        >
                            <Text style={styles.text}>38.9k</Text>
                            <Text>Part Time</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Text style={[styles.text, { paddingBottom: 10 }]}>Recent Job List</Text>
        </>
    );
};

const EntrepriseHomeScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const flatListRef = useRef(null);
    const dispatch = useDispatch();
    const { entrepriseOffresList, error, isLoading, totalPages } = useSelector((state) => state.entrepriseOffres);
    const { id: entrepriseId } = useSelector((state) => state.auth);

    useScrollToTop(flatListRef);

    useEffect(() => {
        if (error) {
            showToast("error", "Error", error);
        }
    }, [error]);

    useEffect(() => {
        if (entrepriseId) {
            dispatch(getEntrepriseOffres({
                entrepriseId,
                page: 0,
                size: 3, // Récupérer seulement 3 offres
                sortBy: 'PUB_DATE', // Trier par date de publication
                sortDirection: 'DESC', // Les plus récentes en premier
            }));
        }
    }, [entrepriseId, dispatch]);

    const recentJobs = entrepriseOffresList?.slice(0, 3) || [];

    const renderItem = useCallback(({ item }) => (
        <JobCard key={item.id} jobPoste={item} />
    ), []);

    const renderEmpty = () => {
        if (isLoading) return <LoadingIndicator />;
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
    };

    return (
        <SafeAreaView style={styles.mainContainer}>            
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} animated/>
            <TopNavBar
                theme={"purple"}
                showBackButton={false}
                showNotification={false}
                showWelcome={true}
                showProfile={true}
            ></TopNavBar>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={recentJobs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={
                        <View style={{ paddingBottom: tabBarHeight }}>
                            {totalPages > 1 && (
                                <TouchableOpacity
                                    style={styles.showMoreButton}
                                    onPress={() => navigation.navigate("entrepriseProjects")}
                                >
                                    <Text style={styles.showMoreText}>Voir Tout</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    }
                    ListEmptyComponent={renderEmpty}
                />
            </View>
        </SafeAreaView>
    );
};

export default EntrepriseHomeScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex : 1
    },
    container: {
        flex: 1,
        backgroundColor: Color.background,
        paddingHorizontal: 20,
    },
    text: {
        color: Color.text,
        fontWeight: "bold",
        fontSize: 16,
    },
    showMoreButton: {
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Color.selectedbutton,
        borderRadius: 10,
    },
    showMoreText: {
        color: "#fff",
        fontWeight: "bold",
    },
    emptyMessage: {
        textAlign: "center",
        marginTop: 20,
        color: Color.text,
    },
});
