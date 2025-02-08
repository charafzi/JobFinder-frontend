import React, { useCallback, useEffect, useRef } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Color } from "../constants/Color";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { JobCard, LoadingIndicator } from "../components";
import { useScrollToTop } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/showToast";
import TopNavBar from "../components/TopNavBar";
import DashboardStats from "../components/DashboardStats";
import { getNombreOffresParEntreprise, getRecentEntrepriseOffres } from "../redux/slices/entrepriseOffres/getEntrepriseOffresThunk";
import { getNombreCandidaturesAccepteesParEntreprise, getNombreCandidaturesParEntreprise } from "../redux/slices/candidatureEntreprise/candidaturesThunk";


const EntrepriseHomeScreen = ({ navigation }) => {
    const tabBarHeight = useBottomTabBarHeight();
    const flatListRef = useRef(null);
    const dispatch = useDispatch();
    const { nombreOffres, error, recentLoading, entrepriseRecentList, totalPages } = useSelector((state) => state.entrepriseOffres);
    const { nombreCandidaturesAcceptees, nombreCandidatures, } = useSelector((state) => state.entrepCandidatures);
    const { id: entrepriseId } = useSelector((state) => state.auth);

    useScrollToTop(flatListRef);

    useEffect(() => {
        if (error) {
            showToast("error", "Error", error);
        }
    }, [error]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (entrepriseId) {
                dispatch(getRecentEntrepriseOffres(entrepriseId));
                dispatch(getNombreOffresParEntreprise(entrepriseId));
                dispatch(getNombreCandidaturesParEntreprise(entrepriseId));
                dispatch(getNombreCandidaturesAccepteesParEntreprise(entrepriseId));
            }
        });
        return unsubscribe;
    }, [navigation, entrepriseId, dispatch]);

    const ListHeaderComponent = () => {
        return (
            <>
                {/* Dashboard */}
                <DashboardStats offresCount={nombreOffres} totalCandidatures={nombreCandidatures} candidaturesAcceptees={nombreCandidaturesAcceptees} />
                <Text style={[styles.text, { paddingBottom: 10 }]}>Recent Job List</Text>
            </>
        );
    };

    const renderItem = useCallback(({ item }) => (
        <JobCard key={item.id} jobPoste={item} />
    ), []);

    const renderEmpty = () => {
        if (recentLoading) return <LoadingIndicator />;
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

    if (recentLoading || !entrepriseRecentList) {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <StatusBar barStyle="dark-content" backgroundColor={Color.background} animated />
                <TopNavBar
                    theme={"purple"}
                    showBackButton={false}
                    showNotification={true}
                    showWelcome={true}
                    showProfile={true}
                />
                <View style={styles.container}>
                    <LoadingIndicator />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} animated />
            <TopNavBar
                theme={"purple"}
                showBackButton={false}
                showNotification={true}
                showWelcome={true}
                showProfile={true}
            ></TopNavBar>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={entrepriseRecentList || []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={
                        <View style={{ paddingBottom: tabBarHeight + 30, marginBottom: tabBarHeight }}>
                            {totalPages > 1 && (
                                <TouchableOpacity
                                    style={styles.showMoreButton}
                                    onPress={() => navigation.navigate("entrepriseProjects")}
                                >
                                    <Text style={styles.showMoreText}>See All</Text>
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
        flex: 1
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
        color: Color.red,
        fontWeight: "bold",
    },
});
