import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Image, ActivityIndicator, Linking} from "react-native";
import TopNavBar from "../components/TopNavBar";
import React, {useEffect, useState} from "react";
import {Color} from "../constants/Color";
import JobDetailsCard from "../components/JobDetailsCard";
import {useDispatch, useSelector} from "react-redux";
import {checkIfAlreadyApplied, applyToOffer, getDocuments, getDocumentById} from "../redux/slices/candidaturesCandidat/candidaturesThunk";
import CVUploadInput from "../components/CVUploadInput";
import { Ionicons } from '@expo/vector-icons';
import {API_BASE_URL} from "../config/axiosConfig";
import showToast from "../utils/showToast";
import {LoadingIndicator} from "../components";

const DocumentPreview = ({ document, isLoading }) => {
    if (isLoading) {
        return (
            <LoadingIndicator></LoadingIndicator>
        );
    }
    // Si c'est une image
    if (document?.type?.startsWith('image/')) {
        return (
            <Image
                source={{ uri: `${API_BASE_URL}/api/candidat/document/${document.id}` }}
                style={styles.imagePreview}
                resizeMode="cover"
            />
        );
    }

    // Pour les PDFs et autres types de documents
    return (
        <View style={styles.previewContainer}>
            <Ionicons 
                name={document?.type?.includes('pdf') ? 'document-text' : 'document'}
                size={30}
                color={Color.primary}
            />
            <Text style={styles.documentType}>
                {document?.type?.split('/')[1]?.toUpperCase() || 'DOC'}
            </Text>
        </View>
    );
};

const ExistingCVItem = ({ cv, onSelect, isSelected }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [documentDetails, setDocumentDetails] = useState(null);

    useEffect(() => {
        const loadDocumentDetails = async () => {
            try {
                setIsLoading(true);
                const response = await dispatch(getDocumentById(cv.id)).unwrap();
                setDocumentDetails(response);
            } catch (error) {
                console.error('Error loading document details:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDocumentDetails();
    }, [cv.id]);

    const viewFile = async () => {
        try {
            setIsLoading(true);
            const url = `${API_BASE_URL}/api/candidat/document/${cv.id}`;
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
        <View style={styles.cvItemContainer}>
            <TouchableOpacity 
                style={[styles.cvItem, isSelected && styles.cvItemSelected]}
                onPress={() => onSelect(cv.id)}
            >
                <DocumentPreview document={documentDetails} isLoading={isLoading} />
                <TouchableOpacity 
                    style={[styles.viewButton, isLoading && styles.viewButtonDisabled]}
                    onPress={viewFile}
                    disabled={isLoading}
                >
                    <Ionicons name="eye-outline" size={16} color="#fff" />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );
};

const ConfirmationModal = ({ visible, applicationData, onCancel, onConfirm }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Confirm Application</Text>
                    
                    <View style={styles.modalSection}>
                        <Text style={styles.modalLabel}>Email:</Text>
                        <Text style={styles.modalText}>{applicationData?.email}</Text>
                    </View>

                    <View style={styles.modalSection}>
                        <Text style={styles.modalLabel}>Your Response:</Text>
                        <Text style={styles.modalText}>{applicationData?.reponse}</Text>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.cancelButton]} 
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.confirmButton]} 
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Confirm & Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const ApplicationApplyScreen = ({route, navigation}) => {
    const dispatch = useDispatch();
    const {id, email, candidat} = useSelector((state)=>state.auth);
    const {isLoading,error} = useSelector((state)=>state.candidatures);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [selectedCvId, setSelectedCvId] = useState(null);
    const [newCv, setNewCv] = useState(null);
    const [coverLetter, setCoverLetter] = useState(null);
    const [response, setResponse] = useState('');
    const [cvDocuments, setCvDocuments] = useState([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [errors, setErrors] = useState({
        cv: '',
        response: ''
    });
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [pendingApplication, setPendingApplication] = useState(null);

    useEffect(() => {
        if (error) {
            showToast("error", "Login failed", error);
        }
    }, [error]);

    // Load CV documents
    useEffect(() => {
        const fetchDocuments = async () => {
            if (candidat?.cvDocumentsId?.length > 0) {
                setIsLoadingDocuments(true);
                try {
                    const documents = await dispatch(getDocuments(candidat.cvDocumentsId)).unwrap();
                    setCvDocuments(documents);
                } catch (error) {
                    console.error('Error loading documents:', error);
                } finally {
                    setIsLoadingDocuments(false);
                }
            }
        };
        fetchDocuments();
    }, [candidat?.cvDocumentsId, dispatch]);

    const handleCVUpload = (file) => {
        setNewCv(file);
        setSelectedCvId(null); // Reset selected CV when uploading new one
    };

    const handleCoverLetterUpload = (file) => {
        setCoverLetter(file);
    };

    const showApplicationConfirmation = (applicationData) => {
        setPendingApplication(applicationData);
        setIsConfirmationVisible(true);
    };

    const handleConfirmApplication = () => {
        setIsConfirmationVisible(false);
        submitApplication(pendingApplication);
    };

    const submitApplication = async (applicationData) => {
        try {
            await dispatch(applyToOffer(applicationData)).unwrap();
            showToast("success","Your application was sent successfully.")
            navigation.navigate('applications');
        } catch (error) {
            console.log("Error : ",error)
        }
    };

    const validateForm = () => {
        const newErrors = {
            cv: '',
            response: ''
        };
        let isValid = true;

        if (!selectedCvId && !newCv) {
            newErrors.cv = 'Please select or upload a CV';
            isValid = false;
        }

        if (!response.trim()) {
            newErrors.response = 'Please provide a response';
            isValid = false;
        } else if (response.trim().length < 10) {
            newErrors.response = 'Response should be at least 10 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleApplyPress = async () => {
        if (!validateForm()) {
            return;
        }

        const applicationData = {
            email,
            offreId: route.params.offre.id,
            reponse: response,
            cvId: selectedCvId,
            newCv: newCv,
            lettreMotivation: coverLetter
        };

        showApplicationConfirmation(applicationData);
    };

    const handleViewYourApplication = () => {
        navigation.navigate('Applications');
    };

    useEffect(() => {
        const checkApplication = async () => {
            const result = await dispatch(checkIfAlreadyApplied({
                userId: id,
                offreId: route.params.offre.id
            }));
            if (result.payload) {
                setAlreadyApplied(true);
            }
        };
        checkApplication();
    }, [dispatch, id, route.params.offre.id]);

    return(
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <TopNavBar />
                <JobDetailsCard offre={route.params.offre} />
                <View style={styles.section}>
                    {!alreadyApplied ? (
                        <>
                            <Text style={styles.sectionTitle}>Fill in the details below to apply</Text>
                            
                            <View style={styles.formContainer}>
                                {isLoadingDocuments ? (
                                    <Text style={styles.loadingText}>Loading your CVs...</Text>
                                ) : cvDocuments.length > 0 && (
                                    <>
                                        <Text style={styles.label}>Select an existing CV *</Text>
                                        <View style={styles.cvList}>
                                            {cvDocuments.map((cv) => (
                                                <ExistingCVItem
                                                    key={cv.id}
                                                    cv={cv}
                                                    onSelect={(cvId) => {
                                                        setSelectedCvId(cvId);
                                                        setNewCv(null);
                                                        setErrors({...errors, cv: ''});
                                                    }}
                                                    isSelected={selectedCvId === cv.id}
                                                />
                                            ))}
                                        </View>
                                    </>
                                )}
                                {errors.cv ? <Text style={styles.errorMessage}>{errors.cv}</Text> : null}

                                <Text style={styles.label}>Or upload a new CV *</Text>
                                <CVUploadInput 
                                    onFileSelect={(file) => {
                                        handleCVUpload(file);
                                        setErrors({...errors, cv: ''});
                                    }} 
                                />

                                <Text style={styles.label}>Cover Letter (optional)</Text>
                                <CVUploadInput fileName={"Cover Letter"} onFileSelect={handleCoverLetterUpload} />

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Your Response *</Text>
                                    <TextInput
                                        style={[styles.textInput, errors.response && styles.inputError]}
                                        multiline
                                        numberOfLines={4}
                                        value={response}
                                        onChangeText={(text) => {
                                            setResponse(text);
                                            if (text.trim()) {
                                                setErrors({...errors, response: ''});
                                            }
                                        }}
                                        placeholder="Answer here to company question...."
                                    />
                                    {errors.response ? <Text style={styles.errorMessage}>{errors.response}</Text> : null}
                                </View>

                                <TouchableOpacity
                                    style={styles.applyButton}
                                    onPress={handleApplyPress}>
                                    {!isLoading && <Text style={styles.applyButtonText}>APPLY NOW</Text>}
                                    <LoadingIndicator isLoading={isLoading} />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={handleViewYourApplication}>
                            <Text style={styles.applyButtonText}>VIEW YOUR APPLICATION</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
            <ConfirmationModal
                visible={isConfirmationVisible}
                applicationData={pendingApplication}
                onCancel={() => setIsConfirmationVisible(false)}
                onConfirm={handleConfirmApplication}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.background
    },
    formContainer: {
        padding: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
        color: Color.text,
    },
    loadingText: {
        textAlign: 'center',
        color: Color.text,
        marginVertical: 10,
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Color.primary,
    },
    uploadButtonText: {
        color: Color.primary,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
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
    },
    cvList: {
        marginBottom: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    cvItemContainer: {
        width: 100,
        marginRight: 10,
        marginBottom: 10,
    },
    cvItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 100,
    },
    cvItemSelected: {
        borderColor: Color.primary,
        backgroundColor: Color.primary + '10',
    },
    pdfIconContainer: {
        backgroundColor: Color.primary,
        padding: 8,
        borderRadius: 4,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdfIcon: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewButton: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        backgroundColor: Color.primary,
        padding: 5,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewButtonDisabled: {
        opacity: 0.5,
    },
    previewContainer: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    imagePreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    documentType: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Color.primary,
        marginTop: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    errorMessage: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Color.background,
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Color.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalSection: {
        marginBottom: 15,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Color.text,
        marginBottom: 5,
    },
    modalText: {
        fontSize: 14,
        color: Color.text,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: Color.primary,
    },
    confirmButton: {
        backgroundColor: Color.primary,
    },
    cancelButtonText: {
        color: Color.primary,
        fontWeight: 'bold',
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ApplicationApplyScreen;