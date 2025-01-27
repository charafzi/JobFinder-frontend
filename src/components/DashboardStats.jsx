import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { Color } from "../constants/Color";
import { remotejobs } from "../../assets";

const DashboardStats = ({ offresCount, totalCandidatures, candidaturesAcceptees}) => {
    return (
        <View style={{ marginTop: 10, paddingHorizontal: 10}}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={{ flexDirection: "row", marginVertical: 15, alignItems: "center", justifyContent: "space-between" }}>
                <TouchableOpacity
                    style={styles.offreContainer}
                >
                    <Image
                        source={remotejobs}
                        style={styles.icon}
                    />

                    <Text style={[styles.countText, styles.countNumber, { backgroundColor: "#AFECFE", }]}>{offresCount}</Text>
                    <Text style={styles.text}>Offres d'Emploi</Text>
                </TouchableOpacity>
                <View style={{  }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#BEAFFE",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            flex: 1,
                            padding: "6%",
                        }}
                    >
                        <Text style={[styles.countText, styles.countNumber, { backgroundColor: "#BEAFFE", }]}>{totalCandidatures}</Text>
                        <Text style={styles.text}>Candidatures</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#FFD6AD",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 10,
                            flex: 1,
                            padding: 10,
                            marginTop: 10,
                        }}
                    >
                        <Text style={[styles.countText, styles.countNumber, { backgroundColor: "#FFD6AD", }]}>{candidaturesAcceptees}</Text>
                        <Text style={styles.text}>candidatures acceptées</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    offreContainer: {
        backgroundColor: "#AFECFE",
        alignItems: "center",
        justifyContent: 'center',
        paddingVertical: "9%",
        paddingHorizontal: "6%",
        borderRadius: 10,
    },
    icon: {
        marginVertical: 10,
        width: 40,
        height: 40
    },
    title: {
        color: Color.text,
        fontWeight: "bold",
        fontSize: 16,
        paddingBottom: 10
    },
    text: {
        color: Color.text,
        fontWeight: "bold",
        fontSize: 14,
    },
    countNumber: {
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    countText: {
        color: Color.text,
        fontWeight: "bold",
        fontSize: 16,
    }
});

export default DashboardStats;