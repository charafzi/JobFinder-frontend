import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Image,
	Platform,
	Dimensions,
	Animated,
	Keyboard,
	Alert,
	ToastAndroid,
	KeyboardAvoidingView,
	TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useSelector, useDispatch } from 'react-redux';
import {
	updateEntreprise,
	fetchSecteursActivite,
	updateEntrepriseSecteurs,
	uploadProfilePicture,
	getProfilePicture
} from '../redux/slices/EntrepriseProfile/entrepriseProfileThunks';
import LocationMapModal from '../components/LocationMapModal';
import MapView, { Marker } from 'react-native-maps';
import { useForm, Controller } from "react-hook-form";
import axios from 'axios';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const CustomCheckbox = ({ title, checked, onPress }) => (
	<TouchableOpacity
		style={styles.checkboxContainer}
		onPress={onPress}
	>
		<MaterialCommunityIcons
			name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
			size={24}
			color="#3A317B"
		/>
		<Text style={styles.checkboxText}>{title}</Text>
	</TouchableOpacity>
);

const CustomTextInput = React.forwardRef(({ value, onChangeText, ...props }, ref) => {
	const [localValue, setLocalValue] = useState(value);

	const handleChange = (text) => {
		setLocalValue(text);
		if (onChangeText) {
			onChangeText(text);
		}
	};

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	return (
		<TextInput
			ref={ref}
			value={localValue}
			onChangeText={handleChange}
			style={[styles.textInput, props.style]}
			{...props}
		/>
	);
});


function EditCompanyProfile() {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const { entreprise, secteursActivites } = useSelector((state) => state.entrepriseProfile);
	const [image, setImage] = useState(null);
	const [profileImage, setProfileImage] = useState(null);
	const [isLoadingImage, setIsLoadingImage] = useState(false);
	const imageCache = useRef(null);
	const scrollY = useRef(new Animated.Value(0)).current;
	const scrollViewRef = useRef(null);

	useEffect(() => {
		let isMounted = true;

		const loadProfilePicture = async () => {
			if (!entreprise?.id || isLoadingImage || imageCache.current) return;

			try {
				setIsLoadingImage(true);
				const imageUrl = await dispatch(getProfilePicture(entreprise.id)).unwrap();
				if (isMounted) {
					setProfileImage(imageUrl);
					setImage(imageUrl);
					imageCache.current = imageUrl; // Mettre en cache l'URL
				}
			} catch (error) {
				console.error('Error loading profile picture:', error);
				if (isMounted) {
					showNotification(
						'Impossible de charger l\'image de profil. Veuillez réessayer plus tard.',
						'error'
					);
				}
			} finally {
				if (isMounted) {
					setIsLoadingImage(false);
				}
			}
		};

		if (entreprise?.id && !imageCache.current) {
			loadProfilePicture();
		} else if (imageCache.current) {
			// Utiliser l'image en cache si disponible
			setProfileImage(imageCache.current);
			setImage(imageCache.current);
		}

		return () => {
			isMounted = false;
		};
	}, [entreprise?.id]);

	// Nettoyer le cache lors du démontage du composant
	useEffect(() => {
		return () => {
			imageCache.current = null;
		};
	}, []);

	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const aboutInputRef = useRef(null);
	const cityInputRef = useRef(null);
	const addressInputRef = useRef(null);

	useEffect(() => {
		const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
			setKeyboardVisible(true);
			setKeyboardHeight(e.endCoordinates.height);
		});

		const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
			setKeyboardVisible(false);
			setKeyboardHeight(0);
		});

		return () => {
			keyboardWillShow.remove();
			keyboardWillHide.remove();
		};
	}, []);

	const [formData, setFormData] = useState({
		about: '',
		adress: {
			adress: '',
			city: '',
			latitude: 33.5731104,
			longitude: -7.5898434
		},
		selectedSectors: []
	});

	const [errors, setErrors] = useState({
		about: null,
		city: null,
		adress: null
	});

	const [isIndustriesExpanded, setIsIndustriesExpanded] = useState(false);
	const industriesAnimation = useRef(new Animated.Value(0)).current;

	const [isEditingAbout, setIsEditingAbout] = useState(false);
	const [isEditingAddress, setIsEditingAddress] = useState(false);

	const [addressData, setAddressData] = useState({
		adress: formData.adress?.adress || '',
		city: formData.adress?.city || '',
		latitude: formData.adress?.latitude || 0,
		longitude: formData.adress?.longitude || 0
	});

	const [selectedSecteurs, setSelectedSecteurs] = useState([]);
	const [isEditingIndustries, setIsEditingIndustries] = useState(false);
	const [addressSuggestions, setAddressSuggestions] = useState([]);
	const [cityInput, setCityInput] = useState(addressData.city || '');
	const [selectedCity, setSelectedCity] = useState('');
	const [notification, setNotification] = useState({ visible: false, message: '', type: '' });
	const [showLocationModal, setShowLocationModal] = useState(false);

	useEffect(() => {
		if (entreprise?.activitySectors) {
			setSelectedSecteurs(entreprise.activitySectors.map(secteur => secteur.id));
		}
	}, [entreprise]);

	useEffect(() => {
		dispatch(fetchSecteursActivite());
	}, [dispatch]);

	useEffect(() => {
		if (entreprise) {
			setFormData({
				about: entreprise.about || '',
				adress: entreprise.adress || {
					adress: '',
					city: '',
					latitude: 33.5731104,
					longitude: -7.5898434
				},
				selectedSectors: entreprise.activitySectors || []
			});
		}
	}, [entreprise]);

	const handleMapPress = (event) => {
		const { latitude, longitude } = event.nativeEvent.coordinate;
		setFormData(prev => ({
			...prev,
			adress: {
				...prev.adress,
				latitude,
				longitude
			}
		}));
	};

	const handleSecteurToggle = (secteurId) => {
		if (!entreprise?.id) {
			console.log('No entreprise ID found');
			return;
		}

		setSelectedSecteurs(prev => {
			const isSelected = prev.includes(secteurId);
			const newSelection = isSelected
				? prev.filter(id => id !== secteurId)
				: [...prev, secteurId];

			console.log('Updating secteurs for entreprise:', entreprise.id, 'with selection:', newSelection);
			dispatch(updateEntrepriseSecteurs({
				entrepriseId: entreprise.id,
				secteurIds: newSelection
			})).then(result => {
				if (result.error) {
					console.error('Failed to update secteurs:', result.error);
				} else {
					console.log('Secteurs updated successfully');
				}
			});

			return newSelection;
		});
	};

	const handleSubmit = async () => {
		try {
			const updatedData = {
				...entreprise,
				about: formData.about,
				adress: formData.adress,
				activitySectors: formData.selectedSectors
			};
			await dispatch(updateEntreprise(updatedData)).unwrap();
			navigation.goBack();
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};

	const pickImage = async () => {
		if (isLoadingImage) return;

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.5,
			});

			if (!result.canceled) {
				const selectedImage = result.assets[0];
				const id = entreprise?.id;

				if (!id) {
					showNotification('ID de l\'entreprise non disponible', 'error');
					return;
				}

				// Mise à jour locale immédiate pour l'UX
				const localImageUri = selectedImage.uri;
				setImage(localImageUri);

				const formData = new FormData();
				formData.append('file', {
					uri: localImageUri,
					type: 'image/jpeg',
					name: 'profile.jpg'
				});

				setIsLoadingImage(true);
				try {
					await dispatch(uploadProfilePicture({
						formData,
						entrepriseId: id
					})).unwrap();

					// Mettre à jour le cache avec la nouvelle image
					imageCache.current = localImageUri;
					setProfileImage(localImageUri);
					showNotification('Photo de profil mise à jour avec succès', 'success');
				} catch (error) {
					// Restaurer l'ancienne image en cas d'erreur
					setImage(imageCache.current);
					showNotification('Erreur lors de la mise à jour de la photo', 'error');
				} finally {
					setIsLoadingImage(false);
				}
			}
		} catch (error) {
			console.error('Error picking image:', error);
			showNotification(
				'Erreur lors de la sélection de l\'image. Veuillez réessayer.',
				'error'
			);
		}
	};

	const getCoordinatesFromAddress = async (address, city) => {
		try {
			const query = `${address}, ${city}`;
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
			);
			const data = await response.json();

			if (data && data.length > 0) {
				const { lat, lon } = data[0];
				setAddressData(prev => ({
					...prev,
					latitude: parseFloat(lat),
					longitude: parseFloat(lon)
				}));
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des coordonnées:', error);
		}
	};

	const selectCity = (city) => {
		setSelectedCity(city);
		setSelectedPrefecture('');
		setCitySearchText(city);
		setShowCityDropdown(false);

		// Mettre à jour les coordonnées pour le centre de la ville sélectionnée
		getCoordinatesFromAddress(city, "Maroc");
	};

	const selectPrefecture = (prefecture) => {
		setSelectedPrefecture(prefecture);
		setShowPrefectureDropdown(false);

		// Mettre à jour les coordonnées pour la préfecture
		const fullAddress = `${prefecture}, ${selectedCity}, Maroc`;
		setAddressData(prev => ({
			...prev,
			adress: fullAddress,
			city: selectedCity
		}));
		getCoordinatesFromAddress(fullAddress, "Maroc");
	};

	const getAddressSuggestions = async (city) => {
		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&city=${encodeURIComponent(city)}&countrycodes=ma&limit=5`
			);
			const data = await response.json();
			setAddressSuggestions(data);
		} catch (error) {
			console.error('Erreur lors de la récupération des suggestions:', error);
			setAddressSuggestions([]);
		}
	};

	useEffect(() => {
		if (cityInput.length > 2) {
			const timer = setTimeout(() => {
				getAddressSuggestions(cityInput);
			}, 500);
			return () => clearTimeout(timer);
		} else {
			setAddressSuggestions([]);
		}
	}, [cityInput]);

	// const selectAddress = (suggestion) => {
	//   const { lat, lon, display_name } = suggestion;
	//   setAddressData({
	//     adress: display_name,
	//     city: cityInput,
	//     latitude: parseFloat(lat),
	//     longitude: parseFloat(lon)
	//   });
	//   setCityInput(cityInput);
	//   setAddressSuggestions([]);
	// };

	const handleUpdateAddress = async () => {
		// Validation
		if (!addressData.city?.trim()) {
			setErrors(prev => ({ ...prev, city: 'La ville est requise' }));
			return;
		}

		if (!addressData.adress?.trim()) {
			setErrors(prev => ({ ...prev, adress: 'L\'adresse est requise' }));
			return;
		}

		try {
			console.log('Données d\'adresse actuelles:', addressData);

			// S'assurer que les données d'adresse sont complètes
			if (!addressData.adress || !addressData.city) {
				if (Platform.OS === 'android') {
					ToastAndroid.show('Veuillez sélectionner une ville et une préfecture', ToastAndroid.SHORT);
				} else {
					console.warn('Ville ou préfecture manquante');
				}
				return;
			}

			// Créer une copie de l'entreprise avec la nouvelle adresse
			const updatedEntreprise = {
				...entreprise,
				adress: {
					adress: addressData.adress,
					city: addressData.city,
					latitude: addressData.latitude,
					longitude: addressData.longitude
				}
			};

			console.log('Envoi des données à l\'API:', updatedEntreprise);

			// Mettre à jour l'entreprise
			const result = await dispatch(updateEntreprise(updatedEntreprise)).unwrap();
			console.log('Résultat de la mise à jour:', result);

			if (result) {
				setIsEditingAddress(false);
				setNotification({ visible: true, message: 'Adresse mise à jour avec succès !', type: 'success' });
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour de l\'adresse:', error);
			setNotification({ visible: true, message: error.message || 'Erreur lors de la mise à jour de l\'adresse', type: 'error' });
		}
	};

	const handleUpdateAbout = async () => {
		// Validation
		if (!formData.about?.trim()) {
			setErrors(prev => ({ ...prev, about: 'La description est requise' }));
			return;
		}

		try {
			const result = await dispatch(updateEntreprise({
				...entreprise,
				about: formData.about
			})).unwrap();

			if (result) {
				setIsEditingAbout(false);
				showNotification('Description mise à jour avec succès', 'success');
			}
		} catch (error) {
			console.error('Erreur lors de la mise à jour:', error);
			showNotification('Erreur lors de la mise à jour de la description', 'error');
		}
	};

	const showNotification = (message, type = 'success') => {
		setNotification({
			visible: true,
			message,
			type,
		});
		setTimeout(() => {
			setNotification({ visible: false, message: '', type: '' });
		}, 3000);
	};

	const TopNavBar = () => (
		<View style={styles.topNavBar}>
			<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
				<MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
			</TouchableOpacity>
		</View>
	);

	const HeaderInfo = () => (
		<View style={styles.headerInfo}>
			<Text style={styles.companyName}>{entreprise?.name || 'Nom de l\'entreprise'}</Text>
			<View style={styles.infoContainer}>
				<View style={styles.infoRow}>
					<MaterialCommunityIcons name="map-marker" size={16} color="#fff" />
					<Text style={styles.infoText}>
						{formData.adress.adress ? `${formData.adress.adress}, ${formData.adress.city}` : 'Adresse non spécifiée'}
					</Text>
				</View>
				<View style={styles.infoRow}>
					<MaterialCommunityIcons name="phone" size={16} color="#fff" />
					<Text style={styles.infoText}>
						{entreprise?.phoneNumber || 'Numéro non spécifié'}
					</Text>
				</View>
			</View>
		</View>
	);
	const [testText, setTestText] = useState('');
	const [isEditingTest, setIsEditingTest] = useState(false);

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

	const handleTestUpdate = async () => {
		Keyboard.dismiss();
		setIsEditingTest(false);
		// Add any update logic here if needed
	};

	const AboutCard = () => {
		const [isEditingAbout, setIsEditingAbout] = useState(false);
		const [aboutText, setAboutText] = useState(entreprise?.about || ''); // Initialisation correcte

		const handleSaveAbout = async () => {
			try {
				const result = await dispatch(updateEntreprise({
					...entreprise,
					about: aboutText,
				})).unwrap();

				if (result) {
					setIsEditingAbout(false);
					setFormData(prev => ({ ...prev, about: aboutText }));
					showNotification('Description mise à jour avec succès', 'success');
				}
			} catch (error) {
				console.error('Erreur lors de la mise à jour:', error);
				showNotification('Erreur lors de la mise à jour de la description', 'error');
			}
		};

		return (
			<View style={styles.cardContainer}>
				<View style={styles.cardContent}>
					<View style={styles.cardHeader}>
						<View style={styles.sectionTitleContainer}>
							<MaterialCommunityIcons name="account-details" size={24} color="#3A317B" style={styles.sectionIcon} />
							<Text style={styles.sectionTitle}>About</Text>
						</View>
						<TouchableOpacity
							onPress={() => {
								if (isEditingAbout) {
									handleSaveAbout();
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
							placeholder="Décrivez votre entreprise..."
							placeholderTextColor="#999"
							autoCapitalize="sentences"
							textAlignVertical="top"
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

	const IndustriesCard = () => (
		<View style={styles.sectionCard}>
			<View style={styles.sectionHeader}>
				<View style={styles.sectionTitleContainer}>
					<MaterialCommunityIcons name="factory" size={24} color="#3A317B" style={styles.sectionIcon} />
					<Text style={styles.sectionTitle}>Secteurs d'activité</Text>
				</View>
				<TouchableOpacity onPress={() => setIsEditingIndustries(!isEditingIndustries)}>
					<MaterialCommunityIcons name="pencil" size={24} color="#3A317B" />
				</TouchableOpacity>
			</View>
			{isEditingIndustries ? (
				<View style={styles.industriesContainer}>
					{secteursActivites.map((secteur) => (
						<CustomCheckbox
							key={secteur.id}
							title={secteur.nom}
							checked={selectedSecteurs.includes(secteur.id)}
							onPress={() => handleSecteurToggle(secteur.id)}
						/>
					))}
				</View>
			) : (
				<View style={styles.selectedIndustriesContainer}>
					{entreprise?.activitySectors?.map((secteur) => (
						<View key={secteur.id} style={styles.selectedIndustryTag}>
							<Text style={styles.selectedIndustryText}>{secteur.nom}</Text>
						</View>
					))}
				</View>
			)}
		</View>
	);

	const AddressDisplay = () => {
		if (!formData.adress) {
			return (
				<Text style={styles.sectionText}>Aucune adresse disponible</Text>
			);
		}

		return (
			<View style={styles.addressDisplayContainer}>
				<View style={styles.addressTextContainer}>
					<Text style={styles.addressLabel}>Ville:</Text>
					<Text style={styles.addressText}>{formData.adress.city || 'Non spécifiée'}</Text>
				</View>
				<View style={styles.addressTextContainer}>
					<Text style={styles.addressLabel}>Adresse complète:</Text>
					<Text style={styles.addressText}>{formData.adress.adress || 'Non spécifiée'}</Text>
				</View>
				{formData.adress.latitude !== 0 && formData.adress.longitude !== 0 && (
					<TouchableOpacity
						style={styles.viewLocationButton}
						onPress={() => setShowLocationModal(true)}
					>
						<MaterialCommunityIcons name="map-marker" size={20} color="#3A317B" />
						<Text style={styles.viewLocationText}>Voir la localisation</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const AddressCard = () => {
		const handleUpdateAddress = async () => {
			// Vérifier si les champs obligatoires sont remplis
			if (!addressData.city || !addressData.adress) {
				showNotification("La ville et l'adresse sont obligatoires", "error");
				return; // Si l'un des champs est manquant, ne pas envoyer la requête
			}

			// Créer un objet pour envoyer les données mises à jour
			const entrepriseData = {
				...entreprise, // Préserver les autres informations de l'entreprise
				adress: {
					city: addressData.city,
					adress: addressData.adress,
					latitude: addressData.latitude,
					longitude: addressData.longitude,
				},
			};

			try {
				// Appel à Redux pour mettre à jour l'entreprise avec la nouvelle adresse
				const result = await dispatch(updateEntreprise(entrepriseData)).unwrap();

				if (result) {
					// Si la mise à jour réussit, désactiver le mode édition et mettre à jour les données du formulaire
					setIsEditingAddress(false);
					setFormData((prev) => ({ ...prev, adress: addressData }));
					showNotification("Adresse mise à jour avec succès", "success");
				}
			} catch (error) {
				console.error("Erreur lors de la mise à jour de l'adresse:", error);
				showNotification("Erreur lors de la mise à jour de l'adresse", "error");
			}
		};

		const handleOpenLocationModal = async () => {
			if (!addressData.city || !addressData.adress) {
				showNotification("Veuillez d'abord saisir la ville et l'adresse.", "error");
				return;
			}

			try {
				const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
					params: {
						q: `${addressData.adress}, ${addressData.city}`,
						format: "json",
						limit: 1,
					},
				});

				if (response.data.length > 0) {
					const { lat, lon } = response.data[0];

					setAddressData((prev) => ({
						...prev,
						latitude: parseFloat(lat),
						longitude: parseFloat(lon),
					}));
				} else {
					showNotification("Adresse introuvable. Veuillez vérifier les informations saisies.", "error");
				}
			} catch (error) {
				console.error("Erreur lors du géocodage:", error);
				showNotification("Impossible d'obtenir les coordonnées GPS.", "error");
			}

			setShowLocationModal(true);
		};

		return (
			<View style={styles.sectionCard}>
				<View style={styles.sectionHeader}>
					<View style={styles.sectionTitleContainer}>
						<MaterialCommunityIcons
							name="map-marker"
							size={24}
							color="#3A317B"
							style={styles.sectionIcon}
						/>
						<Text style={styles.sectionTitle}>Adresse</Text>
					</View>
					{!isEditingAddress && (
						<TouchableOpacity
							style={styles.editButton}
							onPress={() => {
								setIsEditingAddress(true);
								setTimeout(() => {
									cityInputRef.current?.focus();
								}, 100);
							}}
						>
							<MaterialCommunityIcons name="pencil" size={24} color="#3A317B" />
						</TouchableOpacity>
					)}
				</View>

				{!isEditingAddress ? (
					<AddressDisplay />
				) : (
					<View style={styles.editContainer}>
						{/* Ville Input */}
						<TextInput
							ref={cityInputRef}
							style={[styles.textInput, styles.addressInput]}
							value={addressData.city}
							onChangeText={(text) => setAddressData((prev) => ({ ...prev, city: text }))}
							placeholder="Ville"
							returnKeyType="next"
							onSubmitEditing={() => {
								addressInputRef.current?.focus();
							}}
							editable={true}
						/>
						{errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

						{/* Adresse Input */}
						<TextInput
							ref={addressInputRef}
							style={[styles.textInput, styles.addressInput]}
							value={addressData.adress}
							onChangeText={(text) => setAddressData((prev) => ({ ...prev, adress: text }))}
							placeholder="Adresse complète"
							multiline={true}
							numberOfLines={2}
							textAlignVertical="top"
							editable={true}
						/>
						{errors.adress && <Text style={styles.errorText}>{errors.adress}</Text>}

						{/* Location Button (pour ouvrir la carte) */}
						<TouchableOpacity style={styles.locationButton} onPress={handleOpenLocationModal}>
							<MaterialCommunityIcons name="map-marker" size={24} color="#3A317B" />
							<Text style={styles.locationButtonText}>
								{addressData.latitude !== 0 && addressData.longitude !== 0
									? "Modifier la localisation"
									: "Ajouter la localisation"}
							</Text>
						</TouchableOpacity>

						{/* Location Modal */}
						{showLocationModal && (
							<LocationMapModal
								visible={showLocationModal}
								onClose={() => setShowLocationModal(false)}
								onLocationSelect={(latitude, longitude) => {
									setAddressData((prev) => ({
										...prev,
										latitude,
										longitude,
									}));
								}}
								initialLocation={{
									latitude: addressData.latitude || 33.5731104,
									longitude: addressData.longitude || -7.5898434,
								}}
							/>
						)}

						{/* Buttons */}
						<View style={styles.editButtonsContainer}>
							<TouchableOpacity
								style={[styles.editButton, styles.cancelButton]}
								onPress={() => {
									setIsEditingAddress(false);
									setAddressData({
										adress: formData.adress?.adress || "",
										city: formData.adress?.city || "",
										latitude: formData.adress?.latitude || 0,
										longitude: formData.adress?.longitude || 0,
									});
								}}
							>
								<Text style={styles.cancelButtonText}>Annuler</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.editButton, styles.saveButton]}
								onPress={handleUpdateAddress}
							>
								<Text style={styles.saveButtonText}>Enregistrer</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</View>
		);
	};



	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={{ flex: 1 }}>
					{notification.visible && (
						<Animated.View style={[
							styles.notification,
							notification.type === 'success' ? styles.notificationSuccess : styles.notificationError
						]}>
							<View style={styles.notificationContent}>
								<MaterialCommunityIcons
									name={notification.type === 'success' ? 'check-circle' : 'alert-circle'}
									size={24}
									color="#fff"
									style={styles.notificationIcon}
								/>
								<Text style={styles.notificationText}>{notification.message}</Text>
							</View>
						</Animated.View>
					)}
					<ScrollView
						ref={scrollViewRef}
						style={styles.container}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							paddingBottom: keyboardVisible ? keyboardHeight + 20 : 20
						}}
					>
						<Animated.View style={[styles.header, {
							transform: [{
								translateY: scrollY.interpolate({
									inputRange: [0, HEADER_SCROLL_DISTANCE],
									outputRange: [0, -HEADER_SCROLL_DISTANCE],
									extrapolate: 'clamp',
								})
							}]
						}]}>
							<View style={styles.headerBackground}>
								<TopNavBar />
								<View style={styles.headerContent}>
									<TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
										{(image || profileImage) ? (
											<Image
												source={
													image
														? { uri: image }
														: { uri: profileImage }
												}
												style={styles.profileImage}
											/>
										) : (
											<View style={styles.placeholderContainer}>
												<MaterialCommunityIcons name="account" size={40} color="#666" />
											</View>
										)}
										<View style={styles.cameraIconContainer}>
											<MaterialCommunityIcons name="camera" size={20} color="#fff" />
										</View>
									</TouchableOpacity>
									<HeaderInfo />
								</View>
							</View>
						</Animated.View>

						<View style={styles.content}>
							<View style={{paddingTop: 20}}></View>
							{AboutCard()}
							<IndustriesCard />
							{AddressCard()}
							<View style={styles.bottomSpacing} />
						</View>
					</ScrollView>

				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	content: {
		paddingTop: HEADER_MAX_HEIGHT + 50,
		paddingHorizontal: 16,
		paddingBottom: 100,
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
		paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
		paddingBottom: 20,
	},
	headerContent: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 20,
	},
	imageContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
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
	profileImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	placeholderContainer: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#e1e1e1',
	},
	cameraIconContainer: {
		position: 'absolute',
		bottom: 5,
		right: 5,
		backgroundColor: '#3A317B',
		width: 42,
		height: 42,
		borderRadius: 21,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#fff',
		elevation: 5,
	},
	headerInfo: {
		alignItems: 'center',
		paddingHorizontal: 20,
		marginTop: 10,
	},
	companyName: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 10,
		textAlign: 'center',
	},
	infoContainer: {
		width: '100%',
		alignItems: 'center',
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 5,
	},
	infoText: {
		color: '#fff',
		marginLeft: 8,
		fontSize: 14,
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
	saveButton: {
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
	},
	saveButtonText: {
		color: '#3A317B',
		fontWeight: '600',
	},
	cardContainer: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		marginBottom: 16,
		padding: 16,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	cardIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 16,
	},
	aboutIcon: {
		backgroundColor: '#3A317B',
	},
	cardContent: {
		flex: 1,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	cardDivider: {
		height: 1,
		backgroundColor: '#E5E5E5',
		marginVertical: 8,
	},
	textInputContainer: {
		backgroundColor: '#F5F5F5',
		borderRadius: 8,
		padding: 12,
		minHeight: 100,
		textAlignVertical: 'top',
		fontSize: 16,
		color: '#333',
	},
	aboutText: {
		fontSize: 16,
		color: '#666',
		lineHeight: 24,
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		marginVertical: 2,
	},
	checkboxList: {
		marginTop: 8,
	},
	checkboxText: {
		marginLeft: 8,
		fontSize: 14,
		color: '#333',
	},
	noSectorsText: {
		color: '#666',
		fontStyle: 'italic',
		marginTop: 8,
	},
	selectedSectorsPreview: {
		marginTop: 8,
		paddingVertical: 4,
	},
	selectedSectorsText: {
		color: '#666',
		fontSize: 14,
	},
	sectionCard: {
		backgroundColor: '#fff',
		borderRadius: 15,
		padding: 15,
		marginBottom: 15,
		elevation: 3,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	sectionTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sectionIcon: {
		marginRight: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#3A317B',
	},
	textInput: {
		marginVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		minHeight: 120,
		textAlignVertical: 'top',
		padding: 15,
		borderWidth: 1,
		borderColor: '#E5E5E5',
	},
	inputFocused: {
		borderColor: '#3A317B',
		borderWidth: 1,
	},
	sectionText: {
		fontSize: 16,
		color: '#666',
		lineHeight: 24,
	},
	bottomTabContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopWidth: 1,
		borderTopColor: '#eee',
		paddingBottom: Platform.OS === 'ios' ? 20 : 0,
	},
	mapContainer: {
		marginTop: 15,
		borderRadius: 10,
		overflow: 'hidden',
		height: 200,
	},
	map: {
		width: '100%',
		height: '100%',
	},
	textInputContainer: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		marginBottom: 10,
		backgroundColor: '#fff',
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		borderRadius: 10,
		paddingHorizontal: 12,
		marginBottom: 10,
	},
	inputIcon: {
		marginRight: 8,
	},
	addressInput: {
		flex: 1,
		paddingVertical: 12,
		fontSize: 16,
		color: '#333',
	},
	suggestionsContainer: {
		backgroundColor: '#fff',
		borderRadius: 8,
		marginTop: -8,
		marginBottom: 16,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	suggestionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	suggestionIcon: {
		marginRight: 12,
	},
	suggestionTextContainer: {
		flex: 1,
	},
	suggestionMainText: {
		fontSize: 16,
		color: '#333',
		fontWeight: '500',
	},
	suggestionSubText: {
		fontSize: 14,
		color: '#666',
		marginTop: 2,
	},
	addressDisplayContainer: {
		padding: 10,
	},
	addressTextContainer: {
		marginBottom: 10,
	},
	addressLabel: {
		fontSize: 14,
		color: '#666',
		marginBottom: 4,
	},
	addressText: {
		fontSize: 16,
		color: '#333',
	},
	viewLocationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f0f0f0',
		padding: 10,
		borderRadius: 8,
		marginTop: 10,
	},
	viewLocationText: {
		marginLeft: 8,
		color: '#3A317B',
		fontSize: 14,
		fontWeight: '500',
	},
	industriesContainer: {
		marginTop: 10,
	},
	selectedIndustriesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 10,
		gap: 8,
	},
	selectedIndustryTag: {
		backgroundColor: '#3A317B20',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
	},
	selectedIndustryText: {
		color: '#3A317B',
		fontSize: 14,
	},
	multilineInput: {
		minHeight: 120,
		paddingTop: 12,
		paddingBottom: 12,
	},
	editContainer: {
		marginTop: 10,
	},
	editButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 12,
		gap: 10,
		position: 'relative',
		zIndex: 0,
	},
	editButton: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 6,
		minWidth: 100,
		alignItems: 'center',
	},
	cancelButton: {
		backgroundColor: '#f5f5f5',
		borderWidth: 1,
		borderColor: '#ddd',
	},
	saveButton: {
		backgroundColor: '#3A317B',
	},
	cancelButtonText: {
		color: '#666',
		fontSize: 14,
		fontWeight: '500',
	},
	saveButtonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
	marginBottom: {
		marginBottom: 10,
	},
	coordinatesContainer: {
		flexDirection: 'row',
		gap: 10,
		marginBottom: 10,
	},
	coordinateInput: {
		flex: 1,
	},
	mapPreviewContainer: {
		height: 200,
		marginVertical: 10,
		borderRadius: 8,
		overflow: 'hidden',
	},
	mapPreview: {
		flex: 1,
	},
	addressText: {
		fontSize: 16,
		color: '#666',
		marginBottom: 5,
	},
	dropdownContainer: {
		marginBottom: 16,
		zIndex: 1,
	},
	dropdownButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 12,
		minHeight: 48,
	},
	dropdownButtonActive: {
		borderColor: '#3A317B',
	},
	dropdownInput: {
		flex: 1,
		fontSize: 16,
		color: '#333',
	},
	dropdownList: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		borderRadius: 8,
		marginTop: 4,
		maxHeight: 200,
		elevation: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		zIndex: 1000,
	},
	dropdownScroll: {
		maxHeight: 200,
	},
	dropdownItem: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
		backgroundColor: '#fff',
	},
	dropdownItemText: {
		fontSize: 16,
		color: '#333',
		paddingVertical: 2,
	},
	dropdownItemTextSelected: {
		color: '#3A317B',
		fontWeight: '600',
	},
	bottomSpacing: {
		height: 100,  // Espace en bas de la dernière carte
	},
	notification: {
		position: 'absolute',
		top: 80,
		left: 20,
		right: 20,
		borderRadius: 12,
		padding: 16,
		zIndex: 1000,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
	},
	notificationSuccess: {
		backgroundColor: '#22c55e',
	},
	notificationError: {
		backgroundColor: '#dc3545',
	},
	notificationContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	notificationIcon: {
		marginRight: 12,
	},
	notificationText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '500',
		flex: 1,
	},
	addressInput: {
		marginBottom: 16,
	},
	locationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	locationButtonText: {
		marginLeft: 8,
		color: '#3A317B',
		fontSize: 16,
	},
	aboutInput: {
		minHeight: 120,
		textAlignVertical: 'top',
	},
	errorText: {
		color: '#FF4B55',
		fontSize: 12,
		marginTop: 4,
	},
	formSection: {
		marginTop: 15,
	},
	inputContainer: {
		marginBottom: 15,
	},
	inputTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#3A317B',
		marginBottom: 8,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 10,
	},
	button: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 6,
		minWidth: 100,
		alignItems: 'center',
	},
	cancelBtn: {
		backgroundColor: '#f5f5f5',
		borderWidth: 1,
		borderColor: '#ddd',
	},
	saveBtn: {
		backgroundColor: '#3A317B',
	},
	cancelBtnText: {
		color: '#666',
		fontSize: 14,
		fontWeight: '500',
	},
	saveBtnText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '500',
	},
});

export default EditCompanyProfile;