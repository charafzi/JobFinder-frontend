import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 390;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const EditProfileCandidat = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
  });

  const pickImage = async () => {
    try {
      // Demander la permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à la galerie.',
          [{ text: 'OK' }]
        );
        return;
      }

      console.log('Ouverture de la galerie...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('Résultat:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image sélectionnée:', result.assets[0].uri);
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
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
    if (isEditing) {
      // Sauvegarder les modifications
      handleSave();
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
    console.log('Saving changes:', editFormData);
    setIsEditing(false);
  };

  const TopNavBar = ({ isEditing, onSave, onEdit }) => {
    const navigation = useNavigation();
    return (
      <View style={styles.topNavBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>Modifier Profil</Text>
        <TouchableOpacity onPress={isEditing ? onSave : onEdit}>
          <Icon name={isEditing ? "check" : "edit"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const [formations, setFormations] = useState([
    { id: 1, diplome: "Master en Informatique", ecole: "École Polytechnique", annee: "2020-2022", description: "Spécialisation en Intelligence Artificielle" },
    { id: 2, diplome: "Licence en Informatique", ecole: "Université Paris Saclay", annee: "2017-2020", description: "Formation générale en informatique" }
  ]);
  const [newFormation, setNewFormation] = useState({
    diplome: '',
    ecole: '',
    annee: '',
    description: ''
  });

  const [experiences, setExperiences] = useState([
    { id: 1, poste: "Développeur Full Stack", entreprise: "Tech Solutions", periode: "2022-Present", description: "Développement d'applications web et mobile" },
    { id: 2, poste: "Développeur Frontend", entreprise: "Digital Agency", periode: "2020-2022", description: "Création d'interfaces utilisateur modernes" }
  ]);
  const [newExperience, setNewExperience] = useState({
    poste: '',
    entreprise: '',
    periode: '',
    description: ''
  });

  const [skills, setSkills] = useState(['React Native', 'JavaScript', 'Node.js', 'Git']);
  const [newSkill, setNewSkill] = useState('');

  const [languages, setLanguages] = useState([
    { lang: 'Français', level: 'Natif' },
    { lang: 'Anglais', level: 'Professionnel' },
    { lang: 'Arabe', level: 'Natif' }
  ]);
  const [newLanguage, setNewLanguage] = useState({ lang: '', level: '' });

  const [showFormationModal, setShowFormationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (newLanguage.lang.trim() && newLanguage.level.trim()) {
      setLanguages([...languages, { ...newLanguage }]);
      setNewLanguage({ lang: '', level: '' });
    }
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addFormation = () => {
    if (editingItem) {
      setFormations(formations.map(f => 
        f.id === editingItem.id ? { ...newFormation, id: f.id } : f
      ));
    } else {
      setFormations([...formations, { ...newFormation, id: Date.now() }]);
    }
    setNewFormation({ diplome: '', ecole: '', annee: '', description: '' });
    setShowFormationModal(false);
    setEditingItem(null);
  };

  const editFormation = (formation) => {
    setNewFormation(formation);
    setEditingItem(formation);
    setShowFormationModal(true);
  };

  const removeFormation = (id) => {
    setFormations(formations.filter(f => f.id !== id));
  };

  const addExperience = () => {
    if (editingItem) {
      setExperiences(experiences.map(e => 
        e.id === editingItem.id ? { ...newExperience, id: e.id } : e
      ));
    } else {
      setExperiences([...experiences, { ...newExperience, id: Date.now() }]);
    }
    setNewExperience({ poste: '', entreprise: '', periode: '', description: '' });
    setShowExperienceModal(false);
    setEditingItem(null);
  };

  const editExperience = (experience) => {
    setNewExperience(experience);
    setEditingItem(experience);
    setShowExperienceModal(true);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  const renderFormationCard = (formation) => (
    <View style={styles.card} key={formation.id}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrapper}>
          <View style={styles.cardIconContainer}>
            <MaterialCommunityIcons name="school" size={24} color="#3A317B" />
          </View>
          <Text style={styles.cardTitle}>{formation.diplome}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => editFormation(formation)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#3A317B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => removeFormation(formation.id)}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardInfoRow}>
          <View style={styles.infoIconContainer}>
            <MaterialCommunityIcons name="office-building" size={18} color="#666" />
          </View>
          <Text style={styles.cardInfoText}>{formation.ecole}</Text>
        </View>
        <View style={styles.cardInfoRow}>
          <View style={styles.infoIconContainer}>
            <MaterialCommunityIcons name="calendar" size={18} color="#666" />
          </View>
          <Text style={styles.cardInfoText}>{formation.annee}</Text>
        </View>
        <Text style={styles.cardDescription}>{formation.description}</Text>
      </View>
    </View>
  );

  const renderExperienceCard = (experience) => (
    <View style={styles.card} key={experience.id}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrapper}>
          <View style={styles.cardIconContainer}>
            <MaterialCommunityIcons name="briefcase" size={24} color="#3A317B" />
          </View>
          <Text style={styles.cardTitle}>{experience.poste}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => editExperience(experience)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#3A317B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => removeExperience(experience.id)}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardInfoRow}>
          <View style={styles.infoIconContainer}>
            <MaterialCommunityIcons name="office-building" size={18} color="#666" />
          </View>
          <Text style={styles.cardInfoText}>{experience.entreprise}</Text>
        </View>
        <View style={styles.cardInfoRow}>
          <View style={styles.infoIconContainer}>
            <MaterialCommunityIcons name="calendar" size={18} color="#666" />
          </View>
          <Text style={styles.cardInfoText}>{experience.periode}</Text>
        </View>
        <Text style={styles.cardDescription}>{experience.description}</Text>
      </View>
    </View>
  );

  const FormationModal = () => (
    <Modal
      visible={showFormationModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Modifier la formation' : 'Ajouter une formation'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowFormationModal(false);
                setEditingItem(null);
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Diplôme</Text>
            <TextInput
              style={styles.input}
              value={newFormation.diplome}
              onChangeText={(text) => setNewFormation({...newFormation, diplome: text})}
              placeholder="Ex: Master en Informatique"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>École</Text>
            <TextInput
              style={styles.input}
              value={newFormation.ecole}
              onChangeText={(text) => setNewFormation({...newFormation, ecole: text})}
              placeholder="Ex: Université Paris Saclay"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Année</Text>
            <TextInput
              style={styles.input}
              value={newFormation.annee}
              onChangeText={(text) => setNewFormation({...newFormation, annee: text})}
              placeholder="Ex: 2020-2022"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newFormation.description}
              onChangeText={(text) => setNewFormation({...newFormation, description: text})}
              placeholder="Description de la formation"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={addFormation}
          >
            <Text style={styles.submitButtonText}>
              {editingItem ? 'Modifier' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
          <TopNavBar 
            isEditing={isEditing}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
          />
          <Animated.View 
            style={[
              styles.headerContent,
              { 
                opacity: scrollY.interpolate({
                  inputRange: [0, HEADER_SCROLL_DISTANCE],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                })
              }
            ]}
          >
            <View style={styles.avatarContainer}>
              {image ? (
                <Image 
                  source={{ uri: image }} 
                  style={styles.avatar}
                  onError={() => {
                    console.error('Erreur de chargement de l\'image');
                    setImage(null);
                  }}
                />
              ) : (
                <MaterialCommunityIcons name="account-circle" size={60} color="#3A317B" />
              )}
              <TouchableOpacity 
                style={styles.cameraIcon}
                onPress={() => {
                  console.log('Bouton caméra pressé');
                  pickImage();
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.nameText}>John Doe</Text>
            <Text style={styles.addressText}>Paris, France</Text>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.spacer} />

        {/* About Me Card */}
        <View style={styles.cardContainer}>
          <View style={[styles.cardIconContainer, styles.aboutIcon]}>
            <MaterialCommunityIcons name="account-details" size={24} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>À propos de moi</Text>
            </View>
            <View style={styles.cardDivider} />
            <TextInput
              style={styles.aboutInput}
              multiline
              placeholder="Parlez de vous..."
              placeholderTextColor="#666"
            />
          </View>
        </View>

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
                value={newSkill}
                onChangeText={setNewSkill}
                placeholder="Nouvelle compétence"
                placeholderTextColor="#666"
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
                renderFormationCard(formation)
              ))}
            </View>
            <View style={styles.addFormationContainer}>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowFormationModal(true)}>
                <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
              </TouchableOpacity>
            </View>
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
                renderExperienceCard(experience)
              ))}
            </View>
            <View style={styles.addExperienceContainer}>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowExperienceModal(true)}>
                <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Languages Card */}
        <View style={styles.cardContainer}>
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
                  <Text style={styles.languageName}>{language.lang}</Text>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{language.level}</Text>
                    <TouchableOpacity onPress={() => removeLanguage(index)}>
                      <MaterialCommunityIcons name="close-circle" size={16} color="#666" style={styles.removeIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.addLanguageContainer}>
              <TextInput
                style={styles.languageInput}
                value={newLanguage.lang}
                onChangeText={(text) => setNewLanguage({ ...newLanguage, lang: text })}
                placeholder="Langue"
                placeholderTextColor="#666"
              />
              <TextInput
                style={styles.levelInput}
                value={newLanguage.level}
                onChangeText={(text) => setNewLanguage({ ...newLanguage, level: text })}
                placeholder="Niveau"
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.addButton} onPress={addLanguage}>
                <MaterialCommunityIcons name="plus" size={24} color="#3A317B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <FormationModal />
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
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3A317B',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  spacer: {
    height: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
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
  aboutInput: {
    fontSize: 14,
    color: '#666',
    textAlignVertical: 'top',
    minHeight: 100,
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
    color: '#333',
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
    borderColor: '#E0E0E0',
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3A317B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardBody: {
    marginLeft: 4,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfoText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
    marginLeft: 44,
  },
});

export default EditProfileCandidat;
