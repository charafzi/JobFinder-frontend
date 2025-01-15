import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { logo } from "../../assets";
import { Color } from "../constants/Color";
import React, {useRef, useCallback, useMemo} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {ConfigFile} from "@babel/core/src/config/files/index-browser";
import {ENTREPRISE_IMAGE_URL} from "../config/axiosConfig";

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: "2-digit",
        minute: "2-digit"
    });
};

const JobPreviewSearchPreview = React.memo(({ jobPoste }) => {
    const handleJobOfferPress = useCallback(() => {
        console.log("press", jobPoste.id);
    }, [jobPoste.id]);

    const requirements = useMemo(() => {
        return (jobPoste?.requirements || ["Java", "Design", "Full Time"]).map((requirement, index) => (
            <View key={index} style={styles.requirementBox}>
                <Text style={styles.requirementText}>{requirement}</Text>
            </View>
        ));
    }, [jobPoste?.requirements]);

    const formattedPublicationDate = useMemo(() => formatDate(jobPoste.publicationDate), [jobPoste.publicationDate]);
    const formattedDeadlineDate = useMemo(() => formatDate(jobPoste.deadlineDate), [jobPoste.deadlineDate]);

    console.log("RENDRED ID="+jobPoste.id);

    return (
        <TouchableOpacity style={styles.cardContainer}
        onPress={handleJobOfferPress}
        >
            <View style={styles.topContainer}>
                <View style={styles.row}>
                    <Image source={{ uri: ENTREPRISE_IMAGE_URL+jobPoste.company.id }} style={styles.entrepriseLogo} />
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.title}>{jobPoste.position}</Text>
                        <Text style={styles.subtitle}>
                            <Text style={styles.companyName}>{jobPoste.company.name}</Text> . {jobPoste.company.adress.adress} . {jobPoste.company.adress.city}
                        </Text>
                    </View>
                </View>
            </View>
            <View>
                <Text style={styles.requirementTitle}>Requirements :</Text>
                <View style={styles.requirementsContainer}>
                    {requirements}
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.label}>Contrat Type</Text>
                    <View style={styles.contractTypeBox}>
                        <Text style={styles.contractTypeText}>{jobPoste.contractType}</Text>
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <View>
                        <Text style={styles.label}>Publication Date</Text>
                        <View style={styles.publicationDateBox}>
                            <Text style={styles.dateText}>{formattedPublicationDate}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.label}>Deadline Date</Text>
                        <View style={styles.deadlineDateBox}>
                            <Text style={styles.dateText}>{formattedDeadlineDate}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.timeAgo}>{jobPoste.timeAgo|| "24 minute ago"}</Text>
                <View style={styles.salarySection}>
                    <Text style={styles.salary}>
                        {jobPoste.salary} Dh
                    </Text>
                    <Text style={styles.month}>
                        /Mo
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}, (prevProps, nextProps) => {
    return prevProps.jobPoste.id === nextProps.jobPoste.id
});

export default JobPreviewSearchPreview;

const styles = StyleSheet.create({
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
    row: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
    entrepriseLogo: {
        backgroundColor: "#D6CDFE",
        borderRadius: 30,
        width: 50,
        height: 50,
    },
    title: {
        color: Color.text,
        fontWeight: "bold",
        fontSize: 16,
    },
    subtitle: { color: Color.subtitle, fontSize: 12 },
    jobRequires: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 10,
        marginRight: 5,
        fontSize: 12,
    },
    viewMore: {
        color: Color.subtitle,
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 5,
    },
    postedTime: {
        fontSize: 12,
        color: "#888",
        marginLeft: "auto",
    },
    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    publicationDateBox: {
        backgroundColor: Color.green,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    deadlineDateBox: {
        backgroundColor: Color.red,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 10,
    },
    contractTypeBox: {
        minWidth: 80,
        height: 25,
        backgroundColor: Color.secondary,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 10,
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
    timeAgo:{
        fontSize: 12,
        color: "grey",
        paddingTop: 2
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
    salarySection: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    salary:{
        fontSize: 14,
        fontWeight: "bold",
        color: Color.text,
    },
    month :{
        fontSize: 12,
        color: "grey",
        fontWeight: "bold",
        paddingTop: 2
    },
    dateText:{
        fontSize: 10,
        fontWeight: "600",
        color : Color.background
    },
    contractTypeText:{
        fontSize: 10,
        fontWeight: "bold",
        color : Color.background
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: '100%',
        marginTop: 10,
        marginBottom: 5
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: '100%'
    },
    companyName:{
        fontSize: 13,
        fontWeight : "bold",
        color: Color.text
    },
    label: {
        fontSize: 10,
        color: Color.text,
        marginLeft: -5,
        fontWeight: "500",
        marginBottom: 5,
        textAlign: "center"
    }
});
