import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {ENTREPRISE_IMAGE_URL} from "../config/axiosConfig";
import React, {useMemo} from "react";
import {Color} from "../constants/Color";
import formatDate from "../utils/formatDate";
import Status from "./Status";
import {useNavigation} from "@react-navigation/native";

const ApplicationCard = React.memo( ({application})=>{
    const navigation = useNavigation();
    const requirements = useMemo(() => {
        return (application.offre?.requirements || ["Java", "Design", "Full Time"]).map((requirement, index) => (
            <View key={index} style={styles.requirementBox}>
                <Text style={styles.requirementText}>{requirement}</Text>
            </View>
        ));
    }, [application?.requirements]);

    const handleCardPress = ()=>{
        navigation.navigate("applicationDetails",{application});
    };


    const publicationDate = useMemo(() => formatDate(application.offre.publicationDate), [application.publicationDate]);
    const deadlineDate = useMemo(() => formatDate(application.offre.deadlineDate), [application.deadlineDate]);
    const applyDate = useMemo(() => formatDate(application.dateCandidature), [application.dateCandidature]);

    return (
        <TouchableOpacity style={styles.cardContainer}
                          onPress={handleCardPress}
        >
            <View style={styles.topContainer}>
                <View style={styles.companySection}>
                    <Image source={{ uri: ENTREPRISE_IMAGE_URL+application.offre.company.id }} style={styles.companyLogo} />
                    <View style={styles.companyDetails}>
                        <Text style={styles.companyName}>{application.offre.company.name}</Text>
                        <Text style={styles.companyEmail}>{application.offre.company.email}</Text>
                        <Text style={styles.companyPhone}>{application.offre.company.phoneNumber}</Text>
                    </View>
                </View>
                <View style={styles.statusDetails}>
                    <View style={styles.status}>
                        <Status status={application.status}></Status>
                    </View>
                </View>
            </View>
            <View style={styles.applicationOfferContainer}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>{application.offre.position}</Text>
                </View>
                <View style={styles.contractTypeBox}>
                    <Text style={styles.contractTypeText}>{application.offre.contractType}</Text>
                </View>
                <View style={styles.salarySection}>
                    <Text style={styles.salary}>
                        {application.offre.salary} Dh
                    </Text>
                    <Text style={styles.month}>
                        /Mo
                    </Text>
                </View>
            </View>
            <View>
                <Text style={styles.requirementTitle}>Requirements :</Text>
                <View style={styles.requirementsContainer}>
                    {requirements}
                </View>
            </View>
            <View style={styles.detailsContainer}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.label}>Publication Date</Text>
                        <View style={styles.publicationDateBox}>
                            <Text style={styles.dateText}>{publicationDate}</Text>
                        </View>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.label}>Deadline Date</Text>
                        <View style={styles.deadlineDateBox}>
                            <Text style={styles.dateText}>{deadlineDate}</Text>
                        </View>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.label}>Apply Date</Text>
                        <View style={styles.applyDateBox}>
                            <Text style={styles.dateText}>{applyDate}</Text>
                        </View>
                    </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    topContainer:{
        display : "flex",
        flexDirection : "row",
        marginVertical : 10,
        justifyContent: "space-between",
    },
    applicationOfferContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: '100%'
    },
    title: {
        color: Color.background,
        fontWeight: "bold",
        fontSize: 12,
    },
    titleBox: {
        minWidth: 50,
        height: 30,
        backgroundColor: Color.primary,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    cardContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginVertical: 15,
        marginHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    contractTypeBox: {
        minWidth: 50,
        height: 30,
        backgroundColor: Color.secondary,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    contractTypeText:{
        fontSize: 11,
        fontWeight: "bold",
        color : Color.background
    },
    salarySection: {
        flexDirection: "row",
        alignContent : "center",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    salary:{
        marginTop: -10,
        fontSize: 12,
        fontWeight: "bold",
        color: Color.text,
    },
    month :{
        marginTop: -10,
        fontSize: 10,
        color: "grey",
        fontWeight: "bold",
        paddingTop: 2
    },
    row: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
    entrepriseLogo: {
        backgroundColor: "#D6CDFE",
        borderRadius: 30,
        width: 50,
        height: 50,
    },
    detailsContainer: {
        width : '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: 15,
    },
    dateContainer: {
        flex : 1,
    },
    publicationDateBox: {
        backgroundColor: Color.purple,
        paddingVertical: 5,
        borderRadius: 5,
    },
    deadlineDateBox: {
        backgroundColor: Color.red,
        paddingVertical: 5,
        borderRadius: 5
    },
    applyDateBox: {
        backgroundColor: Color.primary,
        paddingVertical: 5,
        borderRadius: 5,
    },
    requirementText: {
        fontSize: 10,
        fontWeight : "600",
        color: Color.text,
    },
    requirementTitle:{
        marginTop: 10,
        fontSize: 10,
        fontWeight : "bold",
        color: Color.text,
    },
    requirementsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 15,
        marginBottom: 10
    },
    requirementBox: {
        backgroundColor: Color.boxBackground,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    dateText:{
        textAlign : "center",
        fontSize: 9,
        fontWeight: "600",
        color : Color.background
    },
    companySection:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flex: 1,
    },
    companyDetails:{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        marginRight: 10,
    },
    companyLogo:{
        marginRight : 20,
        width: 50,
        height : 50,
        borderRadius : 100,
    },
    companyName:{
        fontSize: 14,
        fontWeight : "bold",
        color: Color.text
    },
    companyEmail:{
        fontSize : 12,
        color : Color.subtitle
    },
    companyPhone:{
        fontSize : 10,
        color : Color.subtitle
    },
    label: {
        marginBottom: 5,
        textAlign: "center",
        fontSize: 10,
        fontWeight : "600",
        color: Color.text,
    },
    statusDetails: {
        maxWidth: '30%',
    },
    status: {
        width: "auto",
        marginLeft: "auto",
    }
});

export default ApplicationCard;