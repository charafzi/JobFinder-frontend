import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, } from "react-native";
import TopNavBar from "../components/TopNavBar";
import React, { useCallback, useEffect } from "react";
import { Color } from "../constants/Color";
import JobDetailsCard from "../components/JobDetailsCard";
import { useDispatch, useSelector } from "react-redux";
import showToast from "../utils/showToast";
import { getCandidaturesByOffre } from "../redux/slices/candidatureEntreprise/candidaturesThunk";
import Entypo from "@expo/vector-icons/Entypo";
import { CANDIDAT_IMAGE_URL } from "../config/axiosConfig";

const EntrepriseJobDetailsScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { candidatures, isLoading, error, totalElements } = useSelector((state) => state.entrepCandidatures);

    const params = {
        offreId: route.params.offre.id,
        page: 0,
        size: 5
    };

    const circleColors = [
        Color.secondary, // Orange
        Color.primary, // Vert
        Color.spinner, // Bleu
        Color.accept, // Rose
        Color.unselectedbutton, // Violet
    ];

    useEffect(() => {
        if (error) {
            showToast("error", "Login failed", error);
        }
    }, [error]);

    const loadCandidatures = useCallback(async (page = 0) => {
        console.log("loading candidatures");
        console.log("Dispatching getCandidaturesByOffre with params:", { ...params, page });
        try {
            const result = await dispatch(getCandidaturesByOffre({ ...params, page }));
            console.log("Dispatch result:", result);
        } catch (error) {
            console.error("Error dispatching getCandidaturesByOffre:", error);
        }
    }, [dispatch]);

    useEffect(() => {
        loadCandidatures(0);
    }, [loadCandidatures]);

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <TopNavBar />
                <JobDetailsCard offre={route.params.offre} />
                {isLoading ? (
                    <ActivityIndicator size="large" color={Color.primary} />
                ) : totalElements > 0 ? (
                    <View style={styles.candidatesContainer}>
                        <Text style={styles.candidatesTitle}>Candidats ayant postulé :</Text>
                        <View style={styles.candidatesRow}>
                            <View style={styles.circlesContainer}>
                                {candidatures.slice(0, 5).map((candidature, index) => {
                                    const color = circleColors[index % circleColors.length];

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.circle}
                                            onPress={() => {
                                                navigation.navigate("entrepriseCandidates", { offerId: route.params.offre.id });
                                            }}
                                        >
                                            {candidature.candidat.profilePicture ? (
                                                <Image
                                                    source={{ uri: CANDIDAT_IMAGE_URL+candidature.candidat.id }}
                                                    style={styles.profilePic}
                                                />
                                            ) : (
                                                <View style={[styles.circle, { backgroundColor: color }]}>
                                                    <Text style={styles.circleText}>
                                                        {candidature.candidat.firstName.charAt(0).toUpperCase()}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <TouchableOpacity
                                style={styles.seeAllButton}
                                onPress={() => {
                                    navigation.navigate("entrepriseCandidates", { offerId: route.params.offre.id });
                                }}
                            >
                                <Text style={styles.seeAllText}>Voir tous</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.footerContainer}>
                        <Entypo
                            name="box"
                            size={25}
                            color={Color.placeholderText}
                        />
                        <Text style={styles.noMoreResult}>Aucun candidat n'a postulé à cette offre</Text>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.background,
        paddingBottom: 70,
    },
    candidatesContainer: {
        padding: 20,
    },
    candidatesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Color.text,
        marginBottom: 15,
        textAlign: "center",
    },
    candidatesRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    seeAllButton: {
        backgroundColor: Color.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    seeAllText: {
        color: Color.background,
        fontSize: 16,
        fontWeight: "bold",
    },
    circlesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    circleText: {
        color: Color.background,
        fontSize: 18,
        fontWeight: "bold",
    },
    noCandidatesText: {
        textAlign: "center",
        fontSize: 16,
        color: Color.text,
        marginTop: 20,
    },
    footerContainer: {
        paddingBottom: 20,
        paddingHorizontal: 20,
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
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 20,
        marginLeft: 8,
    },
});

export default EntrepriseJobDetailsScreen;