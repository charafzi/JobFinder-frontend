import React from "react";
import { Modal, TouchableOpacity, Text, View } from "react-native";
import { Color } from "../constants/Color";
import Feather from "@expo/vector-icons/Feather";

const LocationChoiceModal = ({
    visible,
    onRequestClose,
    onUseSavedLocation,
    onSelectNewLocation,
    hasSavedLocation,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Feather
                        name="map-pin"
                        size={32}
                        color={Color.primary}
                        style={styles.modalIcon}
                    />
                    <Text style={styles.modalTitle}>Choisir la source de localisation</Text>

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={onUseSavedLocation}
                    >
                        <Text style={styles.buttonText}>Utiliser l'adresse de l'entreprise</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalButton2}
                        onPress={onSelectNewLocation}
                    >
                        <Text style={styles.buttonText2}>Choisir une nouvelle adresse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalCancelButton}
                        onPress={onRequestClose}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        width: "85%",
        alignItems: "center",
    },
    modalIcon: {
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: Color.text,
    },
    modalButton: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        backgroundColor: Color.selectedbutton,
        marginVertical: 5,
        alignItems: "center",
    },
    modalButton2: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        backgroundColor: Color.unselectedbutton,
        marginVertical: 5,
        alignItems: "center",
    },
    modalCancelButton: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        backgroundColor: Color.link,
        marginBottom: 5,
        marginTop: 40,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
    },
    buttonText2: {
        color: Color.text,
        fontWeight: "600",
    },
    cancelButtonText: {
        color: "white",
        fontWeight: "600",
    },
};

export default LocationChoiceModal