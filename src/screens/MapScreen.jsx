import { ActivityIndicator, View, Text, Modal, Animated, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../utils/showToast";
import {Color} from "../constants/Color";
import {getOffresNearby} from "../redux/slices/offres/mapOffresThunk";
import {addOffreToMap, clearMapOffres} from "../redux/slices/offres/offreSlice";
import {WEBSOCKETIO_URL} from "../config/axiosConfig";
import io from 'socket.io-client';
import TopNavBar from "../components/TopNavBar";


const MapScreen = () => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    const { mapOffresList, error } = useSelector((state) => state.offres);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
    const [socket, setSocket] = useState(null);
    const [region, setRegion] = useState({
        latitude: 33.697904,
        longitude: -7.4019606,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    const [firstLoading,setFirstLoading] = useState(true);

    useEffect(() => {
        //clear map offers initially
        dispatch(clearMapOffres());
    }, [dispatch]);

    useEffect(() => {
        // Connexion au serveur WebSocket
        console.log("CONNECTING TO:", WEBSOCKETIO_URL);

        const socketConnection = io(WEBSOCKETIO_URL,  {
            transports: ['websocket'],
        });

        setSocket(socketConnection);


        socketConnection.on('connect', () => {
            console.log('WebSocket connected successfully');
            console.log('Socket ID:', socketConnection.id);
        });

        socketConnection.on('connect_error', (error) => {
            console.log('Connection Error Full Details:', error);
            console.log('Connection Error Details:', {
                error: error.message,
                type: error.type,
                description: error.description,
                transport: socketConnection.io?.engine?.transport?.name
            });
        });

        socketConnection.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        socketConnection.on('offre_created', (data) => {
            console.log("Nouvelle offre reçue:", data);
            dispatch(addOffreToMap(data));
        });

        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
                console.log('Socket déconnecté proprement');
            }
        };
    }, []);
    const showModal = () => {
        setModalVisible(true);
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const hideModal = () => {
        Animated.timing(slideAnim, {
            toValue: Dimensions.get('window').height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
            setSelectedOffre(null);
        });
    };

    const handlePressApply = ()=>{
        hideModal();
        //// add navigation here
    }

    const markerPressed = (offre) => {
        setSelectedOffre(offre);
        showModal();
    };

    const handleRegionChangeComplete = (newRegion) => {
        if (
            Math.abs(newRegion.latitude - region.latitude) > 0.0001 ||
            Math.abs(newRegion.longitude - region.longitude) > 0.0001 ||
            Math.abs(newRegion.latitudeDelta - region.latitudeDelta) > 0.0001 ||
            Math.abs(newRegion.longitudeDelta - region.longitudeDelta) > 0.0001
        ) {
            setRegion(newRegion);
            console.log("Region updated:", newRegion);
            dispatch(getOffresNearby({
            lat: newRegion.latitude,
            lng: newRegion.longitude,
            radius: calculateRadius(region)
        }));
        }
    };

    const calculateRadius = (region) => {
        // Estimate the radius based on latitudeDelta
        const earthRadius = 6371000; // in meters
        const latDelta = region.latitudeDelta / 2;
        const latDistance = earthRadius * (latDelta * (Math.PI / 180));
        return latDistance;
    };

    useEffect(() => {
        if (error) {
            showToast("error", "Error", error);
        }
    }, [error]);

    const requestPermission = async () => {
        setFirstLoading(true)
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const newRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                };

                setRegion(newRegion);

                dispatch(getOffresNearby({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    radius: 5000
                }));

                mapRef.current?.animateToRegion(newRegion, 1000);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Permission Denied',
                    text2: 'You need to allow location access.'
                });
            }
            setFirstLoading(false);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to get location: ' + error.message
            });
        }
    };

    useEffect(() => {
        requestPermission();
    }, []);

    return (
        <View style={styles.container}>
            <TopNavBar
            showProfile={false}
            showNotification={false}
            ></TopNavBar>
            {!firstLoading ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    region={region}
                    onRegionChangeComplete={handleRegionChangeComplete}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    {mapOffresList?.map((offre, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: offre.adress.latitude,
                                longitude: offre.adress.longitude
                            }}
                            onPress={() => markerPressed(offre)}
                        />
                    ))}
                </MapView>
            ) : (
                <ActivityIndicator style={styles.loader} />
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="none"
                onRequestClose={hideModal}
            >
                <TouchableWithoutFeedback onPress={hideModal}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <Animated.View
                                style={[
                                    styles.modalContent,
                                    {
                                        transform: [{ translateY: slideAnim }],
                                    },
                                ]}
                            >
                                <View style={styles.modalHandle} />
                                {selectedOffre && (
                                    <View style={styles.jobDetails}>
                                        <Text style={styles.title}>{selectedOffre.title}</Text>
                                        <Text style={styles.position}>{selectedOffre.position}</Text>
                                        <Text style={styles.salary}>
                                            {selectedOffre.salary.toLocaleString()} DH
                                        </Text>
                                        <Text style={styles.contractType}>
                                            {selectedOffre.contractType}
                                        </Text>
                                        <Text style={styles.description}>
                                            {selectedOffre.description}
                                        </Text>
                                        <Text style={styles.requirements}>
                                            Requirements:
                                        </Text>
                                        <View style={styles.requirementsContainer}>
                                            {selectedOffre.requirements.map((requirement, index) => (
                                                <View key={index} style={styles.requirementBox}>
                                                    <Text style={styles.requirementText}>{requirement}</Text>
                                                </View>
                                            ))}
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.button}
                                            onPress={() => {
                                                handlePressApply();
                                            }}
                                        >
                                            <Text style={styles.buttonText}>Apply Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        color: Color.secondary
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#DEDEDE',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    jobDetails: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: Color.highLightText,
    },
    position: {
        fontSize: 18,
        color: Color.subtitle,
        marginBottom: 15,
    },
    salary: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.text,
        marginBottom: 10,
    },
    contractType: {
        fontSize: 16,
        color: Color.highLightText,
        marginBottom: 15,
        fontWeight: "900"
    },
    description: {
        fontSize: 16,
        color: Color.text,
        lineHeight: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Color.selectedbutton,
        margin: 20,
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 10,
        height: 60,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 14,
        textAlign: "center"
    },
    requirements :{
        fontSize: 16,
        color: Color.subtitle,
        fontWeight: "bold"
    },
    requirementsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    requirementBox: {
        backgroundColor: Color.boxBackground,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 8,
        marginBottom: 8,
        alignSelf: "flex-start",
    },
    requirementText: {
        fontSize: 12,
        color: Color.text,
    },
});

export default MapScreen;