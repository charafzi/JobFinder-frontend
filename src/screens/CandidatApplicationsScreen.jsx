import SearchScreen from "./SearchScreen";
import {FlatList, SafeAreaView, StyleSheet} from "react-native";
import TopNavBar from "../components/TopNavBar";
import React from "react";
import ApplicationCard from "../components/ApplicationCard";

const CandidatApplicationsScreen = ()=>{
    const testData = [
        {
            offre: {
                id: 53,
                title: "Test 1",
                description: "Nous recherchons un responsable commercial pour développer notre portefeuille clients et atteindre nos objectifs de vente.",
                position: "Responsable Commercial",
                requirements: ["Négociation", "Relation client", "Stratégie commerciale", "CRM"],
                contractType: "CDI",
                salary: 14000.0,
                publicationDate: "2024-01-01T10:00:00",
                deadlineDate: "2024-01-31T23:59:59",
                status: "active",
                company: {
                    id: 2,
                    email: "contact@sqli.ma",
                    phoneNumber: "+212645163383",
                    name: "SQLI"
                },
                adress: {
                    city: "Skhirate",
                    adress: "Boulevard des Fleurs, Skhirate 11050",
                    longitude: -7.040406514483353,
                    latitude: 33.2
                }
            },
            status: "REJETEE",
            dateCandidature: "2025-01-14T13:38:29.749222",
            cvDocId: 1,
            lettreMotivationDocId: null
        },
        {
            offre: {
                id: 54,
                title: "Test 2",
                description: "Nous recherchons un responsable commercial pour développer notre portefeuille clients et atteindre nos objectifs de vente.",
                position: "Responsable Commercial",
                requirements: ["Négociation", "Relation client", "Stratégie commerciale", "CRM"],
                contractType: "CDI",
                salary: 14000.0,
                publicationDate: "2024-01-01T10:00:00",
                deadlineDate: "2024-01-31T23:59:59",
                status: "active",
                company: {
                    id: 2,
                    email: "contact@sqli.ma",
                    phoneNumber: "+212645163383",
                    name: "SQLI"
                },
                adress: {
                    city: "Skhirate",
                    adress: "Boulevard des Fleurs, Skhirate 11050",
                    longitude: -7.040406514483353,
                    latitude: 33.8
                }
            },
            status: "ACCEPTE",
            dateCandidature: "2025-01-14T13:47:06.483752",
            cvDocId: 3,
            lettreMotivationDocId: null
        },
        {
            offre: {
                id: 55,
                title: "Test 3",
                description: "Nous recherchons un responsable commercial pour développer notre portefeuille clients et atteindre nos objectifs de vente.",
                position: "Responsable Commercial",
                requirements: ["Négociation", "Relation client", "Stratégie commerciale", "CRM"],
                contractType: "CDI",
                salary: 14000.0,
                publicationDate: "2024-01-01T10:00:00",
                deadlineDate: "2024-01-31T23:59:59",
                status: "active",
                company: {
                    id: 2,
                    email: "contact@sqli.ma",
                    phoneNumber: "+212645163383",
                    name: "SQLI"
                },
                adress: {
                    city: "Skhirate",
                    adress: "Boulevard des Fleurs, Skhirate 11050",
                    longitude: -7.040406514483353,
                    latitude: 33.3
                }
            },
            status: "ENVOYEE",
            dateCandidature: "2025-01-14T15:01:23.98595",
            cvDocId: 1,
            lettreMotivationDocId: null
        },
        {
            offre: {
                id: 56,
                title: "Test 4",
                description: "Nous recherchons un responsable commercial pour développer notre portefeuille clients et atteindre nos objectifs de vente.",
                position: "Responsable Commercial",
                requirements: ["Négociation", "Relation client", "Stratégie commerciale", "CRM"],
                contractType: "CDI",
                salary: 14000.0,
                publicationDate: "2024-01-01T10:00:00",
                deadlineDate: "2024-01-31T23:59:59",
                status: "active",
                company: {
                    id: 2,
                    email: "contact@sqli.ma",
                    phoneNumber: "+212645163383",
                    name: "SQLI"
                },
                adress: {
                    city: "Skhirate",
                    adress: "Boulevard des Fleurs, Skhirate 11050",
                    longitude: -7.040406514483353,
                    latitude: 33.4
                }
            },
            status: "ENVOYEE",
            dateCandidature: "2025-01-15T14:52:12.364338",
            cvDocId: 1,
            lettreMotivationDocId: null
        },
        {
            offre: {
                id: 57,
                title: "Test 5",
                description: "Nous recherchons un responsable commercial pour développer notre portefeuille clients et atteindre nos objectifs de vente.",
                position: "Responsable Commercial",
                requirements: ["Négociation", "Relation client", "Stratégie commerciale", "CRM"],
                contractType: "CDI",
                salary: 14000.0,
                publicationDate: "2024-01-01T10:00:00",
                deadlineDate: "2024-01-31T23:59:59",
                status: "active",
                company: {
                    id: 2,
                    email: "contact@sqli.ma",
                    phoneNumber: "+212645163383",
                    name: "SQLI"
                },
                adress: {
                    city: "Skhirate",
                    adress: "Boulevard des Fleurs, Skhirate 11050",
                    longitude: -7.040406514483353,
                    latitude: 33.5
                }
            },
            status: "ENVOYEE",
            dateCandidature: "2025-01-15T14:53:24.511244",
            cvDocId: 1,
            lettreMotivationDocId: 5
        }
    ];

    const renderItem = React.useCallback(({ item }) => (
        <ApplicationCard key={item.id} application={item} />
    ), []);
    return(
        <SafeAreaView style={styles.mainContainer}>
            <TopNavBar></TopNavBar>
            <FlatList
                data={testData}
                renderItem={renderItem}>
            </FlatList>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer:{
        flex : 1
    },
});
export default CandidatApplicationsScreen;