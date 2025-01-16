import {SafeAreaView, ScrollView, StyleSheet,Text, TouchableOpacity, View} from "react-native";
import TopNavBar from "../components/TopNavBar";
import JobDetailsCard from "../components/JobDetailsCard";
import {Color} from "../constants/Color";
import Status from "../components/Status";
import React, {useMemo} from "react";
import formatDate from "../utils/formatDate";

const ApplicationDetailsScreen = ({route})=>{
    const applyDate = useMemo(() => formatDate(route.params.application.dateCandidature), [route.params.application.dateCandidature]);


    return(
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <TopNavBar></TopNavBar>
                <JobDetailsCard
                offre={route.params.application.offre}
                >
                </JobDetailsCard>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My application</Text>
                    <View style={styles.informationsGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoTitle}>Documents</Text>
                            <View style={styles.positionBox}>
                                <Text style={styles.position}>Docs</Text>
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
                                    <Status status={route.params.application.status}></Status>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
      backgroundColor : Color.background
    },
    applyButton: {
        backgroundColor: Color.primary,
        margin: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
    }

});

export default ApplicationDetailsScreen;