import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { logo } from "../../assets";
import { Color } from "../constants/Color";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const JobPreviewSearchPreview = ({ jobPoste }) => {
    const handleViewPress = ()=> {
        console.log("Icon press")
    }
    return (
        <View style={styles.jobCardContainer}>
            <View style={styles.topContainer}>
                <Image source={logo} style={styles.companyLogo} resizeMode="center" />
                <TouchableOpacity onPress={()=>{
                    handleViewPress()}}
                >
                    <AntDesign
                        name="eye"
                        color={Color.icon3}
                        size={24}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.jobTitle}>{jobPoste || "Product Designer"}</Text>
                <Text style={styles.subtitle}>
                    Google inc . California, USA
                </Text>
            </View>
            <View style={styles.requirementsContainer}>
                {(jobPoste?.requirements || ["Java", "Design", "Full Time"]).map((requirement, index) => (
                    <View key={index} style={styles.requirementBox}>
                        <Text style={styles.requirementText}>{requirement}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.timeAgo}>{jobPoste|| "24 minute ago"}</Text>
                <View style={styles.salarySection}>
                    <Text style={styles.salary}>
                        20000 Dh
                    </Text>
                    <Text style={styles.month}>
                        /Mo
                    </Text>
                </View>
            </View>
        </View>
    );
};

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
        marginRight: 10,
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    requirementText: {
        fontSize: 12,
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
    }
});
