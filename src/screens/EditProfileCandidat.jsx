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
	Modal,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	ActivityIndicator,
	SafeAreaView,
	StatusBar,
	Animated,
	Switch,
	Keyboard
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
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const EditProfileCandidat = ({ route }) => {
	const { candidatId } = route.params;
	const dispatch = useDispatch();
	const scrollViewRef = useRef(null);
	const scrollY = new Animated.Value(0);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Auth and navigation
	const navigation = useNavigation();
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

	const handleModalClose = () => {
		setShowFormationModal(false);
		setShowExperienceModal(false);
		setShowLangueModal(false);
		setShowCompetenceModal(false);
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
				nomEcole: f.nomEcole || 'Sans titre',
				niveauEtude: f.niveauEtude || '',
				dateDebut: f.dateDebut || '',
				dateFin: f.dateFin || '',
				enCours: f.enCours || false,
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
				poste: e.poste || 'Sans titre',
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
			if (candidatId && !image) {
				try {
					const result = await dispatch(getProfilePicture(candidatId)).unwrap();
					if (result) {
						setImage(result);
					}
				} catch (error) {
					console.error('Error loading profile picture:', error);
					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Erreur',
						text2: 'Erreur lors du chargement de l\'image de profil',
						visibilityTime: 3000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				}
			}
		};

		loadProfilePicture();
	}, [candidatId]);

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.5, // Qualité à 50% - bon compromis entre taille et qualité
				allowsMultipleSelection: false,
			});

			if (!result.canceled && result.assets[0]) {
				setIsLoading(true);
				try {
					if (!candidatId) {
						Toast.show({
							type: 'error',
							position: 'top',
							text1: 'Erreur',
							text2: 'ID du candidat non disponible',
							visibilityTime: 3000,
							autoHide: true,
							topOffset: 30,
							bottomOffset: 40,
						});
						return;
					}

					const selectedImage = result.assets[0];

					// Créer le FormData
					const formData = new FormData();
					formData.append('file', {
						uri: selectedImage.uri,
						type: 'image/jpeg',
						name: 'profile.jpg',
					});

					// Upload the new image
					await dispatch(uploadProfilePicture({
						candidatId: Number(candidatId),
						formData: formData
					})).unwrap();

					// Reload the image after successful upload
					const newImageUri = await dispatch(getProfilePicture(candidatId)).unwrap();
					if (newImageUri) {
						setImage(newImageUri);
					}

					Toast.show({
						type: 'success',
						position: 'top',
						text1: 'Photo de profil mise à jour avec succès',
						visibilityTime: 3000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				} catch (uploadError) {
					console.error('Error uploading image:', uploadError);
					let errorMessage = 'Une erreur est survenue lors du chargement de l\'image';

					if (uploadError.message?.includes('Maximum upload size exceeded')) {
						errorMessage = 'L\'image est trop grande. La taille maximale est de 10MB.';
					}

					Toast.show({
						type: 'error',
						position: 'top',
						text1: 'Erreur',
						text2: errorMessage,
						visibilityTime: 3000,
						autoHide: true,
						topOffset: 30,
						bottomOffset: 40,
					});
				} finally {
					setIsLoading(false);
				}
			}
		} catch (error) {
			console.error('Error picking image:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: 'Une erreur est survenue lors de la sélection de l\'image',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
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
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'Le nom de la langue est requis',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}
			if (!newLanguage.niveau) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'Le niveau est requis',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			if (!candidatId || isNaN(candidatId)) {
				console.error('Invalid candidatId:', candidatId);
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'ID du candidat invalide ou manquant',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
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
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: error.message || 'Impossible d\'ajouter la langue. Veuillez réessayer.',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
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
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: 'Impossible de supprimer la langue. Veuillez réessayer.',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		}
	};

	const handleFormationSubmit = async () => {
		try {
			if (!candidatId) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'ID du candidat manquant',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			// Validate all required fields
			if (!newFormation.nomEcole.trim() || !newFormation.niveauEtude.trim() ||
				!newFormation.dateDebut.trim() || !newFormation.dateFin.trim()) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'Tous les champs sont obligatoires',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			// Validate date format
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
			if (!dateRegex.test(newFormation.dateDebut) || !dateRegex.test(newFormation.dateFin)) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'Format de date invalide. Utilisez le format AAAA-MM-JJ',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			// Validate dates
			const validateDates = (dateDebut, dateFin) => {
				const debut = new Date(dateDebut);
				const fin = new Date(dateFin);
				return debut < fin; // Changé de <= à < pour une comparaison stricte
			};

			if (!validateDates(newFormation.dateDebut, newFormation.dateFin)) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'La date de fin doit être strictement supérieure à la date de début',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
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
			Toast.show({
				type: 'success',
				position: 'top',
				text1: 'Succès',
				text2: editingFormation ? 'Formation modifiée avec succès' : 'Formation ajoutée avec succès',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		} catch (error) {
			console.error('Error submitting formation:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: error.message || 'Une erreur est survenue lors de la soumission de la formation',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		}
	};

	const handleExperienceSubmit = async () => {
		try {
			if (!candidatId) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'ID du candidat manquant',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			// Validate all required fields
			if (!newExperience.poste.trim() || !newExperience.dateDebut.trim() ||
				!newExperience.dateFin.trim()) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'Tous les champs sont obligatoires',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			// Validate date format
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
			if (!dateRegex.test(newExperience.dateDebut) || !dateRegex.test(newExperience.dateFin)) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'Format de date invalide. Utilisez le format AAAA-MM-JJ',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
				return;
			}

			// Validate dates
			const validateDates = (dateDebut, dateFin) => {
				const debut = new Date(dateDebut);
				const fin = new Date(dateFin);
				return debut < fin; // Changé de <= à < pour une comparaison stricte
			};

			if (!validateDates(newExperience.dateDebut, newExperience.dateFin)) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'La date de fin doit être strictement supérieure à la date de début',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
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
			Toast.show({
				type: 'success',
				position: 'top',
				text1: 'Succès',
				text2: editingExperience ? 'Expérience modifiée avec succès' : 'Expérience ajoutée avec succès',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		} catch (error) {
			console.error('Error submitting experience:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: error.message || 'Une erreur est survenue lors de la soumission de l\'expérience',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		}
	};

	const handleEditFormation = (formation) => {
		console.log('handleEditFormation - formation to edit:', formation);

		// Mapper les champs pour correspondre au format du formulaire
		const formationToEdit = {
			id: formation.id,
			nomEcole: formation.nomEcole || '',
			niveauEtude: formation.niveauEtude || '',
			dateDebut: formation.dateDebut || '',
			dateFin: formation.dateFin || ''
		};

		console.log('Formation mapped for editing:', formationToEdit);

		// Stocker la formation complète dans editingFormation
		setEditingFormation(formationToEdit);

		// Mettre à jour le formulaire avec les valeurs existantes
		setNewFormation({
			nomEcole: formationToEdit.nomEcole,
			niveauEtude: formationToEdit.niveauEtude,
			dateDebut: formationToEdit.dateDebut,
			dateFin: formationToEdit.dateFin
		});

		// Ouvrir le modal
		setShowFormationModal(true);
	};

	const handleDeleteFormation = async (formationId) => {
		try {
			await dispatch(deleteFormation(formationId)).unwrap();
			Toast.show({
				type: 'success',
				position: 'top',
				text1: 'Formation supprimée avec succès',
				visibilityTime: 2000,
			});
		} catch (error) {
			console.error('Erreur lors de la suppression de la formation:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur lors de la suppression',
				text2: error.message,
				visibilityTime: 3000,
			});
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
				<TouchableWithoutFeedback onPress={() => setShowExperienceModal(false)}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
								<ScrollView showsVerticalScrollIndicator={false}>
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
											<Text style={styles.inputTitle}>Poste *</Text>
											<TextInput
												style={[styles.input, errors.poste && styles.inputError]}
												placeholder="Ex: Développeur Full Stack"
												placeholderTextColor="#AAA6B9"
												value={newExperience.poste}
												onChangeText={(text) => {
													setNewExperience(prev => ({ ...prev, poste: text }));
													if (errors.poste) setErrors(prev => ({ ...prev, poste: null }));
												}}
											/>
											{errors.poste && <Text style={styles.errorText}>{errors.poste}</Text>}
										</View>

										<View style={styles.formGroup}>
											<Text style={styles.inputTitle}>Date de début *</Text>
											<TextInput
												style={[styles.input, errors.dateDebut && styles.inputError]}
												placeholder="AAAA-MM-JJ"
												placeholderTextColor="#AAA6B9"
												value={newExperience.dateDebut}
												onChangeText={(text) => {
													setNewExperience(prev => ({ ...prev, dateDebut: text }));
													if (errors.dateDebut) setErrors(prev => ({ ...prev, dateDebut: null }));
												}}
											/>
											{errors.dateDebut && <Text style={styles.errorText}>{errors.dateDebut}</Text>}
										</View>

										<View style={styles.formGroup}>
											<Text style={styles.inputTitle}>Date de fin *</Text>
											<TextInput
												style={[styles.input, errors.dateFin && styles.inputError]}
												placeholder="AAAA-MM-JJ"
												placeholderTextColor="#AAA6B9"
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
								</ScrollView>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
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
				<TouchableWithoutFeedback onPress={() => setShowFormationModal(false)}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
								<ScrollView showsVerticalScrollIndicator={false}>
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
											<Text style={styles.inputTitle}>Ecole *</Text>
											<TextInput
												style={[styles.input, errors.nomEcole && styles.inputError]}
												placeholder="Ex: ESTEM, EMSI, ENSA..."
												placeholderTextColor="#AAA6B9"
												value={editingFormation ? editingFormation.nomEcole : newFormation.nomEcole}
												onChangeText={(text) => {
													if (editingFormation) {
														setEditingFormation({...editingFormation, nomEcole: text});
													}
													setNewFormation(prev => ({ ...prev, nomEcole: text }));
													if (errors.nomEcole) setErrors(prev => ({ ...prev, nomEcole: null }));
												}}
											/>
											{errors.nomEcole && <Text style={styles.errorText}>{errors.nomEcole}</Text>}
										</View>

										<View style={[styles.formGroup, { marginTop: 1 }]}>
											<Text style={styles.inputTitle}>Niveau d'étude *</Text>
											<TextInput
												style={[styles.input, errors.niveauEtude && styles.inputError]}
												placeholder="Ex: BAC+5, Master, Licence..."
												placeholderTextColor="#AAA6B9"
												value={editingFormation ? editingFormation.niveauEtude : newFormation.niveauEtude}
												onChangeText={(text) => {
													if (editingFormation) {
														setEditingFormation({...editingFormation, niveauEtude: text});
													}
													setNewFormation(prev => ({ ...prev, niveauEtude: text }));
													if (errors.niveauEtude) setErrors(prev => ({ ...prev, niveauEtude: null }));
												}}
											/>
											{errors.niveauEtude && <Text style={styles.errorText}>{errors.niveauEtude}</Text>}
										</View>

										<View style={[styles.formGroup, { marginTop: 1 }]}>
											<Text style={styles.inputTitle}>Date de début *</Text>
											<TextInput
												style={[styles.input, errors.dateDebut && styles.inputError]}
												placeholder="AAAA-MM-JJ"
												placeholderTextColor="#AAA6B9"
												value={newFormation.dateDebut}
												onChangeText={(text) => {
													setNewFormation(prev => ({ ...prev, dateDebut: text }));
													if (errors.dateDebut) setErrors(prev => ({ ...prev, dateDebut: null }));
												}}
											/>
											{errors.dateDebut && <Text style={styles.errorText}>{errors.dateDebut}</Text>}
										</View>

										<View style={[styles.formGroup, { marginTop: 1 }]}>
											<Text style={styles.inputTitle}>Date de fin *</Text>
											<TextInput
												style={[styles.input, errors.dateFin && styles.inputError]}
												placeholder="AAAA-MM-JJ"
												placeholderTextColor="#AAA6B9"
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

										{/* Ajouter de l'espace supplémentaire en bas */}
										<View style={{ height: 100 }} />
									</View>
								</ScrollView>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
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
							<ScrollView showsVerticalScrollIndicator={false}>
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
										<Text style={styles.inputTitle}>Nom de la langue *</Text>
										<TextInput
											style={styles.input}
											placeholder="Ex: Français, Anglais, Espagnol..."
											placeholderTextColor="#AAA6B9"
											value={newLanguage.nomLangue}
											onChangeText={(text) => setNewLanguage({ ...newLanguage, nomLangue: text })}
										/>
									</View>

									<View style={styles.formGroup}>
										<Text style={styles.inputTitle}>Niveau *</Text>
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
										onPress={addLanguage}
									>
										<Text style={styles.submitButtonText}>
											{newLanguage.id ? 'Modifier' : 'Ajouter'}
										</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		);
	};

	const handleLanguageSubmit = async () => {
		if (!newLanguage.nomLangue.trim()) {
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: 'Le nom de la langue est requis',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
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
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Succès',
					text2: 'Langue modifiée avec succès',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			} else {
				// Create new language
				await dispatch(createLangue({
					nomLangue: newLanguage.nomLangue.trim(),
					niveau: newLanguage.niveau,
					candidatId
				})).unwrap();
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Succès',
					text2: 'Langue ajoutée avec succès',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
			}

			// Reset form and close modal
			setNewLanguage({ nomLangue: '', niveau: 'DEBUTANT' });
			setShowLangueModal(false);

			// Refresh the languages list
			dispatch(fetchLangues(candidatId));
		} catch (error) {
			console.error('Error submitting language:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: 'Une erreur est survenue lors de l\'enregistrement',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		}
	};

	const showCustomAlert = (type, message) => {
		if (type === 'success') {
			Toast.show({
				type: 'success',
				position: 'top',
				text1: message,
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		} else {
			Toast.show({
				type: 'error',
				position: 'top',
				text1: message,
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		}
	};

	const handleAboutUpdate = async () => {
		try {
			if (!candidatId) {
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Erreur',
					text2: 'ID du candidat manquant',
					visibilityTime: 3000,
					autoHide: true,
					topOffset: 30,
					bottomOffset: 40,
				});
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
			Toast.show({
				type: 'success',
				position: 'top',
				text1: 'Succès',
				text2: 'Votre description a été mise à jour avec succès',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});

			// Refresh the about data
			dispatch(fetchAbout(candidatId));
		} catch (error) {
			console.error('Error updating about:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: 'Erreur lors de la mise à jour de votre description',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
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
							style={styles.textInputContainer}
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

	const handleDeleteExperience = async (experienceId) => {
		try {
			await dispatch(deleteExperience(experienceId)).unwrap();
			Toast.show({
				type: 'success',
				position: 'top',
				text1: 'Succès',
				text2: 'Expérience supprimée avec succès',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
			dispatch(fetchExperiences(candidatId));
		} catch (error) {
			console.error('Error deleting experience:', error);
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Erreur',
				text2: 'Erreur lors de la suppression de l\'expérience',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 30,
				bottomOffset: 40,
			});
		}
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
											<View style={styles.formationTitleContainer}>
												<Text style={styles.formationSchool}>
													{formation.nomEcole}
												</Text>
												<Text style={styles.formationTitle}>
													{formation.niveauEtude}
												</Text>
												<Text style={styles.formationDate}>
													{formation.dateDebut} - {formation.dateFin}
												</Text>
											</View>
											<View style={styles.actionContainer}>
												<TouchableOpacity
													style={[styles.iconButton, styles.editIconButton]}
													onPress={() => handleEditFormation(formation)}
												>
													<MaterialCommunityIcons name="pencil" size={20} color="#3A317B" />
												</TouchableOpacity>
												<TouchableOpacity
													style={[styles.iconButton, styles.deleteIconButton]}
													onPress={() => handleDeleteFormation(formation.id)}
												>
													<MaterialCommunityIcons name="delete" size={20} color="#FF6B6B" />
												</TouchableOpacity>
											</View>
										</View>
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
											<View style={styles.experienceTitleContainer}>
												<Text style={styles.experiencePoste}>
													{experience.poste}
												</Text>
												<Text style={styles.experienceEntreprise}>{experience.entreprise}</Text>
											</View>
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
													onPress={() => handleDeleteExperience(experience.id)}
												>
													<MaterialCommunityIcons name="delete" size={20} color="#FF4444" />
												</TouchableOpacity>
											</View>
										</View>
										<Text style={styles.experiencePeriode}>
											{experience.dateDebut} - {experience.dateFin}
										</Text>
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
			</KeyboardAvoidingView>

			<View style={styles.bottomTabContainer}>
				<BottomTabNavigation />
			</View>
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
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
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
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 20,
		elevation: 5,
		alignSelf: 'center',
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	modalContent: {
		padding: 16,
		paddingBottom: 20,
		maxHeight: '80%',
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
		marginBottom: 8
	},
	label: {
		fontSize: 12,
		fontWeight: "700",
		color: '#333',
	},
	input: {
		marginVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		height: 50,
		fontSize: 14,
		color: '#333',
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	inputError: {
		borderColor: '#FF4444',
		borderWidth: 1,
	},
	errorText: {
		color: "red",
		fontWeight: "700",
		fontSize: 12,
		paddingBottom: 10,
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
		marginTop: 20,
		marginBottom: 10,
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
		alignItems: 'flex-start',
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
		gap: 8,
	},
	iconButton: {
		padding: 8,
		borderRadius: 8,
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
	formationTitleContainer: {
		flex: 1,
		marginRight: 12,
	},
	formationSchool: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 4,
	},
	formationTitle: {
		fontSize: 14,
		color: '#666',
		fontStyle: 'italic',
	},
	formationDate: {
		fontSize: 14,
		color: '#666',
		marginTop: 4,
	},
	experienceCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
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
		padding: 20,
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
		padding: 16,
		paddingBottom: 20,
		maxHeight: '80%',
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
		marginBottom: 8
	},
	label: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#333',
	},
	textInputContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		marginVertical: 10,
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		height: 60,
		alignItems: "center",
		borderWidth: 1,
		borderColor: '#E0E0E0',
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
	formationCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
	formationHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
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
		gap: 8,
	},
	iconButton: {
		padding: 8,
		borderRadius: 8,
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
	experienceCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
	},
});

export default EditProfileCandidat;