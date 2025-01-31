import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  TextInput,
  Keyboard,
  Alert,
  SafeAreaView,
  StatusBar,
  Animated,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomTabNavigation from '../navigator/BottomTabNavigator';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFormations,
  fetchExperiences,
  fetchLangues,
  fetchCompetences,
  fetchAbout,
  createFormation,
  updateFormation,
  deleteFormation,
  createExperience,
  updateExperience,
  deleteExperience,
  createLangue,
  updateLangue,
  deleteLangue,
  createCompetence,
  updateCompetence,
  deleteCompetence,
  updateAbout,
  uploadProfilePicture,
  getProfilePicture,
  createAbout
} from '../redux/slices/candidat/candidatProfileThunks';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const EditProfileCandidat = ({ route }) => {
  const scrollViewRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth and navigation
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const candidatId = useSelector(state => state.auth.id);
  const { firstName, lastName, email } = useSelector(state => state.auth.candidat) || {};
  
  // Profile data from Redux
  const {
    loading,
    error,
    formations: reduxFormations,
    experiences: reduxExperiences,
    langues: reduxLangues,
    competences: reduxCompetences,
    about: reduxAbout
  } = useSelector((state) => {
    console.log('Current Profile State:', state.candidatProfile);
    return state.candidatProfile;
  });

  // Profile image state
  const [image, setImage] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  // Form data states
  const [editFormData, setEditFormData] = useState({
    firstName: firstName,
    lastName: lastName,
    address: ''
  });

  // About state
  const [aboutText, setAboutText] = useState('');

  // Skills state
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  // Formation states
  const [formations, setFormations] = useState([]);
  const [newFormation, setNewFormation] = useState({
    nomEcole: '',
    niveauEtude: '',
    dateDebut: '',
    dateFin: ''
  });
  const [editingFormation, setEditingFormation] = useState(null);

  // Experience states
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    poste: '',
    dateDebut: '',
    dateFin: ''
  });
  const [editingExperience, setEditingExperience] = useState(null);

  // Language states
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState({
    nomLangue: '',
    niveau: 'DEBUTANT'
  });

  // Modal states
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showLangueModal, setShowLangueModal] = useState(false);
  const [showCompetenceModal, setShowCompetenceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ type: '', message: '' });

  const handleModalClose = () => {
    setShowFormationModal(false);
    setShowExperienceModal(false);
    setShowLangueModal(false);
    setShowCompetenceModal(false);
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    const keyboardWillShow = Platform.OS === 'ios' 
      ? Keyboard.addListener('keyboardWillShow', (e) => {
          setKeyboardHeight(e.endCoordinates.height);
          setKeyboardVisible(true);
        })
      : Keyboard.addListener('keyboardDidShow', (e) => {
          setKeyboardHeight(e.endCoordinates.height);
          setKeyboardVisible(true);
        });

    const keyboardWillHide = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardHeight(0);
          setKeyboardVisible(false);
        })
      : Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardHeight(0);
          setKeyboardVisible(false);
        });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    console.log('EditProfileCandidat - CandidatId:', candidatId);
    console.log('EditProfileCandidat - CandidatId Type:', typeof candidatId);
    if (candidatId) {
      console.log('Fetching initial data for candidat:', candidatId);
      dispatch(fetchFormations(candidatId));
      dispatch(fetchAbout(candidatId));
      dispatch(fetchExperiences(candidatId));
      dispatch(fetchLangues(candidatId));
      dispatch(fetchCompetences(candidatId));
    } else {
      console.log('CandidatId is not available yet');
    }
  }, [candidatId, dispatch]);

  useEffect(() => {
    console.log('About effect triggered. Current about:', aboutText);
    if (aboutText) {
      console.log('Setting aboutText with:', aboutText);
    }
  }, [aboutText]);

  useEffect(() => {
    if (reduxFormations) {
      console.log('Updating formations:', reduxFormations);
      const mappedFormations = reduxFormations.map(f => ({
        id: f.id,
        titre: f.niveauEtude || 'Sans titre',
        ecole: f.nomEcole || '',
        dateDebut: f.dateDebut || '',
        dateFin: f.dateFin || '',
        description: f.description || ''
      }));
      setFormations(mappedFormations);
    }
  }, [reduxFormations]);

  useEffect(() => {
    if (reduxExperiences) {
      console.log('Updating experiences:', reduxExperiences);
      const mappedExperiences = reduxExperiences.map(e => ({
        id: e.id,
        titre: e.poste || 'Sans titre',
        entreprise: e.entreprise || '',
        dateDebut: e.dateDebut || '',
        dateFin: e.dateFin || '',
        description: e.description || ''
      }));
      setExperiences(mappedExperiences);
    }
  }, [reduxExperiences]);

  useEffect(() => {
    if (reduxCompetences) {
      console.log('Updating competences:', reduxCompetences);
      const competencesList = reduxCompetences.map(c => c.nomCompetence || '').filter(Boolean);
      setSkills(competencesList);
    }
  }, [reduxCompetences]);

  useEffect(() => {
    if (reduxLangues) {
      console.log('Updating langues:', reduxLangues);
      const mappedLanguages = reduxLangues.map(l => ({
        id: l.id,
        nomLangue: l.nomLangue || 'Non spécifié',
        niveau: l.niveau || 'DEBUTANT'
      }));
      setLanguages(mappedLanguages);
    }
  }, [reduxLangues]);

  useEffect(() => {
    setEditFormData(prev => ({
      ...prev,
      firstName: firstName,
      lastName: lastName
    }));
  }, [firstName, lastName]);

  useEffect(() => {
    if (reduxAbout && Array.isArray(reduxAbout) && reduxAbout.length > 0) {
      setAboutText(reduxAbout[0].description || '');
    }
  }, [reduxAbout]);

  useEffect(() => {
    const loadProfilePicture = async () => {
      if (candidatId) {
        try {
          const result = await dispatch(getProfilePicture(candidatId)).unwrap();
          if (result) {
            setImage(result);
          }
        } catch (error) {
          console.error('Error loading profile picture in edit:', error);
        }
      }
    };

    loadProfilePicture();
  }, [candidatId, dispatch]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        
        // Upload the new image
        await dispatch(uploadProfilePicture({
          candidatId: candidatId,
          uri: selectedImage.uri
        })).unwrap();
        
        // Reload the image after successful upload
        const newImageUri = await dispatch(getProfilePicture(candidatId)).unwrap();
        if (newImageUri) {
          setImage(newImageUri);
        }
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du chargement de l\'image');
    }
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressé');
    pickImage();
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const navOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const toggleEditing = () => {
    if (isEditingProfile) {
      // Sauvegarder les modifications
      handleSave();
    }
    setIsEditingProfile(!isEditingProfile);
  };

  const handleSave = () => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
    console.log('Saving changes:', editFormData);
    setIsEditingProfile(false);
  };

  const TopNavBar = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.topNavBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const addSkill = async () => {
    if (newSkill.trim()) {
      try {
        console.log('Adding skill - candidatId:', candidatId);
        console.log('Adding skill - newSkill:', newSkill.trim());
        
        if (!candidatId) {
          console.error('CandidatId is missing or invalid');
          return;
        }

        const response = await dispatch(createCompetence({
          nomCompetence: newSkill.trim(),
          candidatId
        })).unwrap();

        // Mettre à jour immédiatement le state local
        setSkills([...skills, newSkill.trim()]);
        setNewSkill('');
        
        console.log('Compétence ajoutée avec succès:', response);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la compétence:', error);
      }
    }
  };

  const removeSkill = async (index) => {
    try {
      const skillToRemove = reduxCompetences[index];
      await dispatch(deleteCompetence(skillToRemove.id)).unwrap();
      
      // Mettre à jour immédiatement le state local
      const newSkills = [...skills];
      newSkills.splice(index, 1);
      setSkills(newSkills);
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétence:', error);
    }
  };

  const addLanguage = async () => {
    try {
      if (!newLanguage.nomLangue.trim()) {
        Alert.alert('Erreur', 'Le nom de la langue est requis');
        return;
      }
      if (!newLanguage.niveau) {
        Alert.alert('Erreur', 'Le niveau est requis');
        return;
      }

      if (!candidatId || isNaN(candidatId)) {
        console.error('Invalid candidatId:', candidatId);
        Alert.alert('Erreur', 'ID du candidat invalide ou manquant');
        return;
      }

      const languageData = {
        nomLangue: newLanguage.nomLangue.trim(),
        niveau: newLanguage.niveau,
        candidatId: Number(candidatId)
      };
      
      console.log('Adding language with data:', languageData);
      const result = await dispatch(createLangue(languageData)).unwrap();
      console.log('Language added successfully:', result);
      
      // Refresh the languages list
      await dispatch(fetchLangues(candidatId));
      
      // Reset form and close modal
      setNewLanguage({ nomLangue: '', niveau: 'DEBUTANT' });
      setShowLangueModal(false);
    } catch (error) {
      console.error('Error adding language:', error);
      Alert.alert('Erreur', error.message || 'Impossible d\'ajouter la langue. Veuillez réessayer.');
    }
  };

  const removeLanguage = async (langueId) => {
    try {
      console.log('Removing language with ID:', langueId);
      await dispatch(deleteLangue(langueId)).unwrap();
      
      // Refresh the languages list
      await dispatch(fetchLangues(candidatId));
      
      console.log('Language removed successfully');
    } catch (error) {
      console.error('Error removing language:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la langue. Veuillez réessayer.');
    }
  };

  const handleFormationSubmit = async () => {
    try {
      if (!candidatId) {
        console.error('CandidatId is missing');
        Alert.alert('Erreur', 'ID du candidat manquant');
        return;
      }

      // Validate all required fields
      if (!newFormation.nomEcole.trim() || !newFormation.niveauEtude.trim() || 
          !newFormation.dateDebut.trim() || !newFormation.dateFin.trim()) {
        Alert.alert('Erreur', 'Tous les champs sont obligatoires');
        return;
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(newFormation.dateDebut) || !dateRegex.test(newFormation.dateFin)) {
        Alert.alert('Erreur', 'Format de date invalide. Utilisez le format AAAA-MM-JJ');
        return;
      }

      const formationData = {
        nomEcole: newFormation.nomEcole.trim(),
        niveauEtude: newFormation.niveauEtude.trim(),
        dateDebut: newFormation.dateDebut.trim(),
        dateFin: newFormation.dateFin.trim(),
        candidatId: Number(candidatId)
      };

      if (editingFormation) {
        await dispatch(updateFormation({
          formationId: editingFormation.id,
          formationData: formationData
        })).unwrap();
      } else {
        await dispatch(createFormation(formationData)).unwrap();
      }

      await dispatch(fetchFormations(candidatId));

      setNewFormation({
        nomEcole: '',
        niveauEtude: '',
        dateDebut: '',
        dateFin: ''
      });
      setShowFormationModal(false);
      setEditingFormation(null);

      // Show success message
      Alert.alert('Succès', editingFormation ? 'Formation modifiée avec succès' : 'Formation ajoutée avec succès');
    } catch (error) {
      console.error('Error submitting formation:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Une erreur est survenue lors de la soumission de la formation'
      );
    }
  };

  const handleExperienceSubmit = async () => {
    try {
      if (!candidatId) {
        console.error('CandidatId is missing');
        Alert.alert('Erreur', 'ID du candidat manquant');
        return;
      }

      // Validate all required fields
      if (!newExperience.poste.trim() || !newExperience.dateDebut.trim() || 
          !newExperience.dateFin.trim()) {
        Alert.alert('Erreur', 'Tous les champs sont obligatoires');
        return;
      }

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(newExperience.dateDebut) || !dateRegex.test(newExperience.dateFin)) {
        Alert.alert('Erreur', 'Format de date invalide. Utilisez le format AAAA-MM-JJ');
        return;
      }

      const experienceData = {
        poste: newExperience.poste.trim(),
        dateDebut: newExperience.dateDebut.trim(),
        dateFin: newExperience.dateFin.trim(),
        candidatId: Number(candidatId)
      };

      if (editingExperience && editingExperience.id) {
        await dispatch(updateExperience({
          experienceId: editingExperience.id,
          experienceData: experienceData
        })).unwrap();
      } else {
        await dispatch(createExperience(experienceData)).unwrap();
      }

      await dispatch(fetchExperiences(candidatId));

      setNewExperience({
        poste: '',
        dateDebut: '',
        dateFin: ''
      });
      setEditingExperience(null);
      setShowExperienceModal(false);

      // Show success message
      Alert.alert('Succès', editingExperience ? 'Expérience modifiée avec succès' : 'Expérience ajoutée avec succès');
    } catch (error) {
      console.error('Error submitting experience:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Une erreur est survenue lors de la soumission de l\'expérience'
      );
    }
  };

  const handleEditFormation = (formation) => {
    console.log('handleEditFormation - formation to edit:', formation);
    
    // Mapper les champs pour correspondre au format du formulaire
    const formationToEdit = {
      id: formation.id,
      titre: formation.titre || '',
      ecole: formation.ecole || '',
      dateDebut: formation.dateDebut || '',
      dateFin: formation.dateFin || ''
    };

    console.log('Formation mapped for editing:', formationToEdit);
    
    // Stocker la formation complète dans editingFormation
    setEditingFormation(formationToEdit);
    
    // Mettre à jour le formulaire avec les valeurs existantes
    setNewFormation({
      nomEcole: formationToEdit.ecole,
      niveauEtude: formationToEdit.titre,
      dateDebut: formationToEdit.dateDebut,
      dateFin: formationToEdit.dateFin
    });
    
    // Ouvrir le modal
    setShowFormationModal(true);
  };

  const handleDeleteFormation = (formation) => {
    setItemToDelete(formation);
    setShowDeleteModal(true);
  };

  const confirmDeleteFormation = async () => {
    try {
      if (itemToDelete?.id) {
        console.log('Deleting formation:', itemToDelete.id);
        await dispatch(deleteFormation(itemToDelete.id)).unwrap();
        console.log('Formation deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting formation:', error);
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const ExperienceModal = () => {
    const [errors, setErrors] = useState({});
    
    const validateForm = () => {
      const newErrors = {};
      if (!newExperience.poste) newErrors.poste = "Le poste est requis";
      if (!newExperience.dateDebut) newErrors.dateDebut = "La date de début est requise";
      if (!newExperience.dateFin) newErrors.dateFin = "La date de fin est requise";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        handleExperienceSubmit();
      }
    };

    return (
      <Modal
        visible={showExperienceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExperienceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExperience ? 'Modifier l\'expérience' : 'Ajouter une expérience'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowExperienceModal(false);
                  setEditingExperience(null);
                  setNewExperience({ poste: '', dateDebut: '', dateFin: '' });
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Poste *</Text>
              <TextInput
                style={[styles.input, errors.poste && styles.inputError]}
                placeholder="Ex: Développeur Java"
                value={newExperience.poste}
                onChangeText={(text) => {
                  setNewExperience(prev => ({ ...prev, poste: text }));
                  if (errors.poste) setErrors(prev => ({ ...prev, poste: null }));
                }}
              />
              {errors.poste && <Text style={styles.errorText}>{errors.poste}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de début *</Text>
              <TextInput
                style={[styles.input, errors.dateDebut && styles.inputError]}
                placeholder="AAAA-MM-JJ (Ex: 2020-09-01)"
                value={newExperience.dateDebut}
                onChangeText={(text) => {
                  setNewExperience(prev => ({ ...prev, dateDebut: text }));
                  if (errors.dateDebut) setErrors(prev => ({ ...prev, dateDebut: null }));
                }}
              />
              {errors.dateDebut && <Text style={styles.errorText}>{errors.dateDebut}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de fin *</Text>
              <TextInput
                style={[styles.input, errors.dateFin && styles.inputError]}
                placeholder="AAAA-MM-JJ (Ex: 2023-06-30)"
                value={newExperience.dateFin}
                onChangeText={(text) => {
                  setNewExperience(prev => ({ ...prev, dateFin: text }));
                  if (errors.dateFin) setErrors(prev => ({ ...prev, dateFin: null }));
                }}
              />
              {errors.dateFin && <Text style={styles.errorText}>{errors.dateFin}</Text>}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {editingExperience ? 'Modifier' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const FormationModal = () => {
    const [errors, setErrors] = useState({});
    
    const validateForm = () => {
      const newErrors = {};
      if (!newFormation.nomEcole) newErrors.nomEcole = "L'école est requise";
      if (!newFormation.niveauEtude) newErrors.niveauEtude = "Le niveau d'étude est requis";
      if (!newFormation.dateDebut) newErrors.dateDebut = "La date de début est requise";
      if (!newFormation.dateFin) newErrors.dateFin = "La date de fin est requise";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        handleFormationSubmit();
      }
    };

    return (
      <Modal
        visible={showFormationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFormationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFormation ? 'Modifier la formation' : 'Ajouter une formation'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowFormationModal(false);
                  setEditingFormation(null);
                  setNewFormation({ nomEcole: '', niveauEtude: '', dateDebut: '', dateFin: '' });
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ecole *</Text>
              <TextInput
                style={[styles.input, errors.nomEcole && styles.inputError]}
                placeholder="Ex: ESTEM"
                value={newFormation.nomEcole}
                onChangeText={(text) => {
                  setNewFormation(prev => ({ ...prev, nomEcole: text }));
                  if (errors.nomEcole) setErrors(prev => ({ ...prev, nomEcole: null }));
                }}
              />
              {errors.nomEcole && <Text style={styles.errorText}>{errors.nomEcole}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Niveau d'étude *</Text>
              <TextInput
                style={[styles.input, errors.niveauEtude && styles.inputError]}
                placeholder="Ex: BAC_PLUS_5"
                value={newFormation.niveauEtude}
                onChangeText={(text) => {
                  setNewFormation(prev => ({ ...prev, niveauEtude: text }));
                  if (errors.niveauEtude) setErrors(prev => ({ ...prev, niveauEtude: null }));
                }}
              />
              {errors.niveauEtude && <Text style={styles.errorText}>{errors.niveauEtude}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de début *</Text>
              <TextInput
                style={[styles.input, errors.dateDebut && styles.inputError]}
                placeholder="AAAA-MM-JJ (Ex: 2020-09-01)"
                value={newFormation.dateDebut}
                onChangeText={(text) => {
                  setNewFormation(prev => ({ ...prev, dateDebut: text }));
                  if (errors.dateDebut) setErrors(prev => ({ ...prev, dateDebut: null }));
                }}
              />
              {errors.dateDebut && <Text style={styles.errorText}>{errors.dateDebut}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date de fin *</Text>
              <TextInput
                style={[styles.input, errors.dateFin && styles.inputError]}
                placeholder="AAAA-MM-JJ (Ex: 2024-06-30)"
                value={newFormation.dateFin}
                onChangeText={(text) => {
                  setNewFormation(prev => ({ ...prev, dateFin: text }));
                  if (errors.dateFin) setErrors(prev => ({ ...prev, dateFin: null }));
                }}
              />
              {errors.dateFin && <Text style={styles.errorText}>{errors.dateFin}</Text>}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {editingFormation ? 'Modifier' : 'Ajouter'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const LanguageModal = () => {
    const languageLevels = [
      { label: 'Débutant', value: 'DEBUTANT' },
      { label: 'Intermédiaire', value: 'INTERMEDIAIRE' },
      { label: 'Avancé', value: 'AVANCE' },
      { label: 'Natif', value: 'NATIF' }
    ];

    return (
      <Modal
        visible={showLangueModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {newLanguage.id ? 'Modifier la langue' : 'Ajouter une langue'}
                  </Text>
                  <TouchableOpacity onPress={handleModalClose}>
                    <MaterialCommunityIcons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nom de la langue *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Français, Anglais, Espagnol..."
                    value={newLanguage.nomLangue}
                    onChangeText={(text) => setNewLanguage({ ...newLanguage, nomLangue: text })}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Niveau *</Text>
                  <View style={styles.levelButtons}>
                    {languageLevels.map((level) => (
                      <TouchableOpacity
                        key={level.value}
                        style={[
                          styles.levelButton,
                          newLanguage.niveau === level.value && styles.selectedLevelButton
                        ]}
                        onPress={() => setNewLanguage({ ...newLanguage, niveau: level.value })}
                      >
                        <Text style={[
                          styles.levelButtonText,
                          newLanguage.niveau === level.value && styles.selectedLevelButtonText
                        ]}>
                          {level.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleLanguageSubmit}
                >
                  <Text style={styles.submitButtonText}>
                    {newLanguage.id ? 'Modifier' : 'Ajouter'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const handleLanguageSubmit = async () => {
    if (!newLanguage.nomLangue.trim()) {
      showCustomAlert('error', 'Le nom de la langue est requis');
      return;
    }

    try {
      if (newLanguage.id) {
        // Update existing language
        await dispatch(updateLangue({
          id: newLanguage.id,
          nomLangue: newLanguage.nomLangue.trim(),
          niveau: newLanguage.niveau,
          candidatId
        })).unwrap();
        showCustomAlert('success', 'Langue modifiée avec succès');
      } else {
        // Create new language
        await dispatch(createLangue({
          nomLangue: newLanguage.nomLangue.trim(),
          niveau: newLanguage.niveau,
          candidatId
        })).unwrap();
        showCustomAlert('success', 'Langue ajoutée avec succès');
      }

      // Reset form and close modal
      setNewLanguage({ nomLangue: '', niveau: 'DEBUTANT' });
      setShowLangueModal(false);
      
      // Refresh languages list
      dispatch(fetchLangues(candidatId));
    } catch (error) {
      console.error('Error submitting language:', error);
      showCustomAlert('error', 'Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const showCustomAlert = (type, message) => {
    setAlertConfig({ type, message });
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const CustomAlert = () => {
    if (!alertVisible) return null;

    const isSuccess = alertConfig.type === 'success';
    return (
      <Animated.View style={[
        styles.alertContainer,
        {
          backgroundColor: isSuccess ? '#4CAF50' : '#f44336',
        }
      ]}>
        <View style={styles.alertContent}>
          <MaterialCommunityIcons
            name={isSuccess ? 'check-circle' : 'alert-circle'}
            size={24}
            color="#fff"
          />
          <Text style={styles.alertText}>{alertConfig.message}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderDeleteConfirmationModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { padding: 20 }]}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer cette formation ?
              {itemToDelete && (
                `\n${itemToDelete.ecole} - ${itemToDelete.titre}`
              )}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteFormation}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLanguages = () => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Langues</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setNewLanguage({ nomLangue: '', niveau: 'DEBUTANT' });
              setShowLangueModal(true);
            }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {languages.map((language, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{language.nomLangue}</Text>
              <Text style={styles.itemSubtitle}>{language.niveau}</Text>
            </View>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => {
                setNewLanguage(language);
                setShowLangueModal(true);
              }}>
                <MaterialCommunityIcons name="pencil" size={20} color="#3A317B" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeLanguage(language.id)}>
                <MaterialCommunityIcons name="delete" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderProfileImage = () => {
    return (
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.avatar}
              onError={(e) => {
                console.log('Error loading image:', e.nativeEvent.error);
                setImage(null);
              }}
            />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <MaterialCommunityIcons name="account" size={40} color="#fff" />
            </View>
          )}
          <View style={styles.editAvatarButton}>
            <MaterialCommunityIcons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{firstName} {lastName}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>
    );
  };

  const handleAboutUpdate = async () => {
    try {
      if (!candidatId) {
        showCustomAlert('error', 'ID du candidat manquant');
        return;
      }

      // Get the current about data
      const aboutResponse = await dispatch(fetchAbout(candidatId)).unwrap();
      console.log('Current about data:', aboutResponse);

      if (!aboutResponse || !aboutResponse[0]) {
        // Create new about if none exists
        console.log('No about exists, creating new one');
        await dispatch(createAbout({
          description: aboutText.trim(),
          candidatId: candidatId
        })).unwrap();
      } else {
        // Update existing about
        console.log('Updating existing about');
        await dispatch(updateAbout({
          aboutId: aboutResponse[0].id,
          description: aboutText.trim(),
          candidatId: candidatId
        })).unwrap();
      }

      setIsEditingAbout(false);
      showCustomAlert('success', 'Votre description a été mise à jour avec succès');
      
      // Refresh the about data
      dispatch(fetchAbout(candidatId));
    } catch (error) {
      console.error('Error updating about:', error);
      showCustomAlert('error', 'Erreur lors de la mise à jour de votre description');
    }
  };

  const renderAboutCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={[styles.cardIconContainer, styles.aboutIcon]}>
          <MaterialCommunityIcons name="account-details" size={24} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>À propos</Text>
            <TouchableOpacity 
              onPress={() => {
                if (isEditingAbout) {
                  handleAboutUpdate();
                } else {
                  setIsEditingAbout(true);
                }
              }}
            >
              <MaterialCommunityIcons 
                name={isEditingAbout ? "check" : "pencil"} 
                size={24} 
                color="#3A317B" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDivider} />
          {isEditingAbout ? (
            <TextInput
              style={styles.aboutInput}
              multiline
              value={aboutText}
              onChangeText={setAboutText}
              placeholder="Parlez-nous de vous..."
              textAlignVertical="top"
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.aboutText}>
              {aboutText || "Aucune description ajoutée"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const handleTextInputFocus = (offset = 0) => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          y: offset,
          animated: true
        });
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#38354c" barStyle="light-content" />
      
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [
              { translateY: scrollY.interpolate({
                inputRange: [0, HEADER_SCROLL_DISTANCE],
                outputRange: [0, -HEADER_SCROLL_DISTANCE],
                extrapolate: 'clamp',
              })}
            ]
          }
        ]}
      >
        <View style={[styles.headerBackground, { height: HEADER_MAX_HEIGHT }]}>
          <TopNavBar />
          <Animated.View 
            style={[
              styles.headerContent,
              {
                transform: [{ translateY: headerTranslate }],
                opacity: headerOpacity,
              },
            ]}
          >
            <View style={styles.profileSection}>
              {renderProfileImage()}
            </View>

            {isEditingProfile ? (
              <View style={styles.editProfileForm}>
                <TextInput
                  placeholder="Prénom"
                  value={editFormData.firstName}
                  onChangeText={(text) => setEditFormData({...editFormData, firstName: text})}
                  onFocus={() => handleTextInputFocus(100)}
                />
                <TextInput
                  placeholder="Nom"
                  value={editFormData.lastName}
                  onChangeText={(text) => setEditFormData({...editFormData, lastName: text})}
                  onFocus={() => handleTextInputFocus(150)}
                />
                <TextInput
                  placeholder="Adresse"
                  value={editFormData.address}
                  onChangeText={(text) => setEditFormData({...editFormData, address: text})}
                  onFocus={() => handleTextInputFocus(200)}
                />
              </View>
            ) : (
              <>
                <Text style={styles.emailText}>{email}</Text>
                <Text style={styles.addressText}>{editFormData.address || ""}</Text>
              </>
            )}
          </Animated.View>
        </View>
      </Animated.View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: keyboardHeight }
          ]}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <View style={styles.spacer} />

          {/* About Card */}
          {renderAboutCard()}

          {/* Skills Card */}
          <View style={styles.cardContainer}>
            <View style={[styles.cardIconContainer, styles.skillsIcon]}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Compétences</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(index)}>
                      <MaterialCommunityIcons name="close-circle" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.addSkillContainer}>
                <TextInput
                  style={styles.skillInput}
                  placeholder="Nouvelle compétence"
                  value={newSkill}
                  onChangeText={setNewSkill}
                  onFocus={() => handleTextInputFocus(300)}
                />
                <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                  <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Formations Card */}
          <View style={styles.cardContainer}>
            <View style={[styles.cardIconContainer, styles.formationsIcon]}>
              <MaterialCommunityIcons name="school" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Formations</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.formationsContainer}>
                {formations.map((formation, index) => (
                  <View key={formation.id} style={styles.formationCard}>
                    <View style={styles.formationHeader}>
                      <Text style={styles.formationTitle}>{formation.titre}</Text>
                      <View style={styles.actionContainer}>
                        <TouchableOpacity 
                          style={[styles.iconButton, styles.editIconButton]}
                          onPress={() => handleEditFormation(formation)}
                        >
                          <MaterialCommunityIcons name="pencil" size={20} color="#3A317B" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.iconButton, styles.deleteIconButton]}
                          onPress={() => {
                            if (formation.id) {
                              handleDeleteFormation(formation);
                            }
                          }}
                        >
                          <MaterialCommunityIcons name="delete" size={20} color="#FF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.formationSchool}>{formation.ecole}</Text>
                    <Text style={styles.formationDate}>
                      {formation.dateDebut} - {formation.dateFin || 'Présent'}
                    </Text>
                    <Text style={styles.formationDescription}>{formation.description}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  setEditingFormation(null);
                  setShowFormationModal(true);
                }}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Experiences Card */}
          <View style={styles.cardContainer}>
            <View style={[styles.cardIconContainer, styles.experiencesIcon]}>
              <MaterialCommunityIcons name="briefcase" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Expériences</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.experiencesContainer}>
                {experiences.map((experience, index) => (
                  <View key={experience.id} style={styles.experienceCard}>
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experienceTitle}>{experience.titre}</Text>
                      <View style={styles.actionContainer}>
                        <TouchableOpacity 
                          style={[styles.iconButton, styles.editIconButton]}
                          onPress={() => {
                            setNewExperience(experience);
                            setEditingExperience(experience);
                            setShowExperienceModal(true);
                          }}
                        >
                          <MaterialCommunityIcons name="pencil" size={20} color="#3A317B" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.iconButton, styles.deleteIconButton]}
                          onPress={() => {
                            if (experience.id) {
                              handleDeleteExperience(experience.id);
                            }
                          }}
                        >
                          <MaterialCommunityIcons name="delete" size={20} color="#FF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.experienceCompany}>{experience.entreprise}</Text>
                    <Text style={styles.experienceDate}>
                      {experience.dateDebut} - {experience.dateFin || 'Présent'}
                    </Text>
                    <Text style={styles.experienceDescription}>{experience.description}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  setEditingExperience(null);
                  setShowExperienceModal(true);
                }}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Languages Card */}
          <View style={[styles.cardContainer, styles.lastCardContainer]}>
            <View style={[styles.cardIconContainer, styles.languageIcon]}>
              <MaterialCommunityIcons name="translate" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Langues</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.languagesContainer}>
                {languages.map((language, index) => (
                  <View key={index} style={styles.languageItem}>
                    <Text style={styles.languageName}>{language.nomLangue || 'Non spécifié'}</Text>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>{language.niveau}</Text>
                      <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={() => {
                          console.log('Removing language:', language);
                          if (language.id) {
                            removeLanguage(language.id);
                          }
                        }}
                      >
                        <MaterialCommunityIcons name="close-circle" size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => {
                  setNewLanguage({ nomLangue: '', niveau: 'DEBUTANT' });
                  setShowLangueModal(true);
                }}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3A317B" />
          </View>
        )}

        {/* Modals */}
        {ExperienceModal()}
        {FormationModal()}
        {LanguageModal()}
        {renderDeleteConfirmationModal()}
      </KeyboardAvoidingView>

      <View style={styles.bottomTabContainer}>
        <BottomTabNavigation />
      </View>
      <CustomAlert />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    zIndex: 1,
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    flex: 1,
    backgroundColor: '#3A317B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  aboutInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    padding: 12,
  },
  spacer: {
    height: 20,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lastCardContainer: {
    marginBottom: 100,
  },
  cardIconContainer: {
    width: 50,
    backgroundColor: '#3A317B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  aboutIcon: {
    backgroundColor: '#4CAF50',
  },
  skillsIcon: {
    backgroundColor: '#9C27B0',
  },
  languageIcon: {
    backgroundColor: '#2196F3',
  },
  formationsIcon: {
    backgroundColor: '#FF9800',
  },
  experiencesIcon: {
    backgroundColor: '#8BC34A',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F0F7',
    marginVertical: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillBadge: {
    backgroundColor: '#F0F0F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillText: {
    fontSize: 13,
    color: '#3A317B',
    fontWeight: '500',
  },
  addSkillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F0F7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languagesContainer: {
    gap: 12,
    marginBottom: 12,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  levelBadge: {
    backgroundColor: '#F0F0F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 12,
    color: '#3A317B',
    fontWeight: '500',
  },
  removeIcon: {
    marginLeft: 4,
  },
  addLanguageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#333',
  },
  levelInput: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#333',
  },
  formationsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  formationItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  formationName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  formationEcole: {
    fontSize: 12,
    color: '#666',
  },
  formationAnnee: {
    fontSize: 12,
    color: '#666',
  },
  formationDescription: {
    fontSize: 12,
    color: '#666',
  },
  addFormationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  experiencesContainer: {
    gap: 12,
    marginBottom: 12,
  },
  experienceItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  experiencePoste: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  experienceEntreprise: {
    fontSize: 12,
    color: '#666',
  },
  experiencePeriode: {
    fontSize: 12,
    color: '#666',
  },
  experienceDescription: {
    fontSize: 12,
    color: '#666',
  },
  addExperienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A317B'
  },
  formScrollView: {
    maxHeight: '70%'
  },
  formGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  inputError: {
    borderColor: '#ff4444'
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  picker: {
    height: 50
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#f5f5f5'
  },
  submitButton: {
    backgroundColor: '#3A317B'
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  },
  closeButton: {
    padding: 5
  },
  formationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editIconButton: {
    backgroundColor: '#E8F0FE',
  },
  deleteIconButton: {
    backgroundColor: '#FEE8E8',
  },
  formationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3A317B',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  alertContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  levelDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  levelOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  levelOptionSelected: {
    backgroundColor: '#3A317B',
  },
  levelOptionText: {
    fontSize: 16,
    color: '#333',
  },
  levelOptionTextSelected: {
    color: '#fff',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  levelButtons: {
    flexDirection: 'column',
  },
  levelButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  selectedLevelButton: {
    backgroundColor: '#3A317B',
    borderColor: '#3A317B',
  },
  levelButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedLevelButtonText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#3A317B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileCandidat;