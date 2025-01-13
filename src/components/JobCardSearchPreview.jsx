import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { logo } from "../../assets";
import { Color } from "../constants/Color";
import React, {useRef, useCallback, useMemo} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

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
    const handleViewPress = useCallback(() => {
        console.log("Icon press", jobPoste.id);
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

    //console.log("RENDRED ID="+jobPoste.id);

    return (
        <View style={styles.jobCardContainer}>
            <View style={styles.topContainer}>
                <Text>ID = {jobPoste.id}</Text>
                <Image source={logo} style={styles.companyLogo} resizeMode="center" />
                <TouchableOpacity onPress={handleViewPress}>
                    <AntDesign
                        name="eye"
                        color={Color.icon3}
                        size={24}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.jobTitle}>{jobPoste.position || "Product Designer"}</Text>
                <Text style={styles.description}>
                    {jobPoste.description}
                </Text>
            </View>

            <View style={styles.requirementsContainer}>
                {requirements}
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.contractTypeBox}>
                    <Text style={styles.contractTypeText}>{jobPoste.contractType}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.publicationDateBox}>
                        <Text style={styles.dateText}>{formattedPublicationDate}</Text>
                    </View>
                    <View style={styles.deadlineDateBox}>
                        <Text style={styles.dateText}>{formattedDeadlineDate}</Text>
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
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.jobPoste.id === nextProps.jobPoste.id &&
           prevProps.jobPoste.position === nextProps.jobPoste.position &&
           prevProps.jobPoste.description === nextProps.jobPoste.description &&
           prevProps.jobPoste.publicationDate === nextProps.jobPoste.publicationDate &&
           prevProps.jobPoste.deadlineDate === nextProps.jobPoste.deadlineDate;
});

export default JobPreviewSearchPreview;

const styles = StyleSheet.create({
    jobCardContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginVertical: 15,
        margin: 20,
    },
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: '100%',
        marginTop: 10,
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: '100%',
        marginTop: 10,
        marginBottom: 5
    },
    contentContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: Color.text,
        marginBottom: 5,
    },
    subtitle: {
        color: Color.subtitle,
        fontSize: 14,
    },
    companyLogo: {
        backgroundColor: "#C4C4C4",
        borderRadius: 100,
        width: 70,
        height: 70,
    },
    icon: {
        padding: 5,
        backgroundColor: Color.background,
        borderRadius: 100
    },
    button: {
        borderRadius: 15,
        paddingHorizontal: 40,
        paddingVertical: 15,
        marginTop: 20,
        alignSelf: "center",
        backgroundColor: Color.lightGrey,
    },
    buttonText: {
        color: Color.subtitle,
        textAlign: "center",
        fontSize: 14,
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
        minWidth: 50,
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
    timeAgo:{
        fontSize: 12,
        color: "grey",
        paddingTop: 2
    },
    salarySection: {
      flexDirection: "row",
      justifyContent: "space-evenly"
    },
    salary:{
        fontSize: 16,
        fontWeight: "bold"
    },
    month :{
        fontSize: 14,
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
    }
});
