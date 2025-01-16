import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking} from "react-native";
import TopNavBar from "../components/TopNavBar";
import JobDetailsCard from "../components/JobDetailsCard";
import {Color} from "../constants/Color";
import Status from "../components/Status";
import React, {useMemo, useState} from "react";
import formatDate from "../utils/formatDate";
import { Ionicons } from '@expo/vector-icons';
import {API_BASE_URL} from "../config/axiosConfig";
import showToast from "../utils/showToast";
import {LoadingIndicator} from "../components";

const DocumentItem = ({ docId, label }) => {
    const [isLoading, setIsLoading] = useState(false);

    const viewFile = async () => {
        try {
            setIsLoading(true);
            const url = `${API_BASE_URL}/api/candidat/document/${docId}`;
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                showToast('error', "Cannot open this file");
            }
        } catch (error) {
            showToast('error', "Error viewing file", "Could not open the file");
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.documentContainer}>
            <View style={styles.documentItem}>
                <View style={styles.documentIconContainer}>
                    <Ionicons 
                        name="document-text"
                        size={24}
                        color={Color.primary}
                    />
                    <Text style={styles.documentLabel}>{label}</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.viewButton, isLoading && styles.viewButtonDisabled]}
                    onPress={viewFile}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <LoadingIndicator size="small" />
                    ) : (
                        <Ionicons name="eye-outline" size={16} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const ApplicationDetailsScreen = ({route}) => {
    const applyDate = useMemo(() => formatDate(route.params.application.dateCandidature), [route.params.application.dateCandidature]);
    const { cvDocId, lettreMotivationDocId, reponse } = route.params.application;
    const [showFullResponse, setShowFullResponse] = useState(false);

    const toggleResponseView = () => {
        setShowFullResponse(!showFullResponse);
    };

    return(
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <TopNavBar />
                <JobDetailsCard offre={route.params.application.offre} />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My application</Text>
                    <View style={styles.informationsGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Your Response</Text>
                            <View style={styles.responseContainer}>
                                <Text 
                                    style={styles.responseText} 
                                    numberOfLines={showFullResponse ? undefined : 2}
                                >
                                    {reponse}
                                </Text>
                                {reponse?.length > 80 && (
                                    <TouchableOpacity 
                                        style={styles.readMoreButton}
                                        onPress={toggleResponseView}
                                    >
                                        <Text style={styles.readMoreText}>
                                            {showFullResponse ? 'Read less' : 'Read more'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Documents</Text>
                            <View style={styles.documentsContainer}>
                                <DocumentItem docId={cvDocId} label="CV" />
                                {lettreMotivationDocId && (
                                    <DocumentItem docId={lettreMotivationDocId} label="Cover Letter" />
                                )}
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Apply date</Text>
                            <View style={styles.applyDateBox}>
                                <Text style={styles.dateText}>{applyDate}</Text>
                            </View>
                        </View>

                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Status</Text>
                            <View style={styles.statusDetails}>
                                <View style={styles.status}>
                                    <Status status={route.params.application.status} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor : Color.background
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoItem: {
        marginBottom: 20,
    },
    infoTitle: {
        fontSize : 12,
        fontWeight : "bold",
        color: Color.text,
        marginBottom: 5,
        textAlign : "center"
    },
    statusDetails: {
        marginHorizontal : 50,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    status: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    applyDateBox: {
        backgroundColor: Color.primary,
        paddingVertical: 5,
        borderRadius: 5,
        marginHorizontal : 50,
    },
    dateText:{
        textAlign : "center",
        fontSize: 12,
        fontWeight: "600",
        color : Color.background
    },
    informationsGrid:{
        display : "flex",
        flexDirection : "column",
        justifyContent : "space-between",
    },
    documentContainer: {
        marginBottom: 10,
    },
    documentItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    documentIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    documentLabel: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
        color: Color.text,
    },
    viewButton: {
        backgroundColor: Color.primary,
        padding: 8,
        borderRadius: 8,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewButtonDisabled: {
        opacity: 0.5,
    },
    documentsContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    responseContainer: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 5,
    },
    responseText: {
        fontSize: 14,
        color: Color.text,
        lineHeight: 20,
    },
    readMoreButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    readMoreText: {
        color: Color.primary,
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ApplicationDetailsScreen;