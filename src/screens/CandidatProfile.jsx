import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Platform, 
  Dimensions,
  Animated,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import BottomTabNavigation from '../navigator/BottomTabNavigator';
import { 
  fetchFormations, 
  fetchExperiences, 
  fetchLangues, 
  fetchCompetences, 
  fetchAbout,
  getProfilePicture 
} from '../redux/slices/candidat/candidatProfileThunks';
import { resetProfile } from '../redux/slices/candidat/candidatProfileSlice';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 390;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const TopNavBar = ({ opacity }) => {
  const navigation = useNavigation();
  return (
    <Animated.View style={[styles.topNavBar]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProfileSection = ({ title, icon, content, isExpanded, onToggle }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.profileSection,
        isExpanded && styles.profileSectionExpanded
      ]} 
      onPress={onToggle}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Icon 
          name={isExpanded ? "edit" : "add"} 
          size={24} 
          color={isExpanded ? "#666" : "#FF9228"} 
        />
      </View>
      {isExpanded && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
};

const ExperienceSection = ({ experiences }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const renderExperienceCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={[styles.cardIconContainer, styles.experienceIcon]}>
          <MaterialCommunityIcons name="briefcase" size={24} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Expériences</Text>
          </View>
          <View style={styles.cardDivider} />
          {experiences.map((experience, index) => (
            <View key={index}>
              <View style={styles.experienceItem}>
                <Text style={styles.experienceTitle}>{experience.poste}</Text>
                <View style={styles.experienceDetails}>
                  <View style={styles.dateContainer}>
                    <MaterialCommunityIcons name="calendar-range" size={16} color="#666" />
                    <Text style={styles.dateText}>
                      {new Date(experience.dateDebut).toLocaleDateString()} - {new Date(experience.dateFin).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.companyContainer}>
                    <MaterialCommunityIcons name="office-building" size={16} color="#666" />
                    <Text style={styles.companyText}>{experience.entreprise || 'Entreprise'}</Text>
                  </View>
                </View>
              </View>
              {index < experiences.length - 1 && <View style={styles.itemDivider} />}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      {renderExperienceCard()}
    </View>
  );
};

const CandidatProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const candidatId = useSelector(state => state.auth.id);
  const { firstName, lastName, email } = useSelector(state => state.auth.candidat);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  
  const {
    formations,
    experiences,
    langues,
    competences,
    about,
    profilePicture,
    loading,
    error
  } = useSelector(state => state.candidatProfile);

  useEffect(() => {
    if (candidatId) {
      dispatch(fetchFormations(candidatId));
      dispatch(fetchExperiences(candidatId));
      dispatch(fetchLangues(candidatId));
      dispatch(fetchCompetences(candidatId));
      dispatch(fetchAbout(candidatId));
    }

    // Cleanup function
    return () => {
      dispatch(resetProfile());
    };
  }, [candidatId, dispatch]);

  const fetchProfilePicture = useCallback(async () => {
    if (candidatId) {
      try {
        setIsLoadingImage(true);
        const result = await dispatch(getProfilePicture(candidatId)).unwrap();
        if (result) {
          // Succès silencieux
        }
      } catch (error) {
        // Erreur silencieuse
      } finally {
        setIsLoadingImage(false);
      }
    }
  }, [candidatId, dispatch]);

  useEffect(() => {
    fetchProfilePicture();
  }, [fetchProfilePicture]);

  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [expandedSections, setExpandedSections] = useState({
    aboutMe: false,
    workExperience: false,
    education: false,
    skill: false,
    language: false,
    appreciation: false,
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const isLoading = Object.values(loading).some(value => value === true);
  const hasError = Object.values(error).some(value => value !== null);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF9228" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          Une erreur est survenue lors du chargement du profil.
        </Text>
      </View>
    );
  }

  const renderFormations = () => {
    return (
    <View style={styles.contentSection}>
      {formations && formations.length > 0 ? (
        formations.map((formation, index) => (
          <View key={index} style={styles.cardContainer}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons name="school-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{formation.nomEcole}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{formation.niveauEtude}</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardFooter}>
                <View style={styles.dateContainer}>
                  <MaterialCommunityIcons name="calendar-range" size={16} color="#666" />
                  <Text style={styles.dateText}>
                    {new Date(formation.dateDebut).toLocaleDateString()} - {new Date(formation.dateFin).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Aucune formation ajoutée</Text>
      )}
    </View>
  )};

  const renderExperiences = () => {
    return (
    <View style={styles.contentSection}>
      {experiences && experiences.length > 0 ? (
        experiences.map((experience, index) => (
          <View key={index} style={styles.cardContainer}>
            <View style={[styles.cardIconContainer, styles.experienceIcon]}>
              <MaterialCommunityIcons name="briefcase" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{experience.poste}</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardFooter}>
                <View style={styles.dateContainer}>
                  <MaterialCommunityIcons name="calendar-range" size={16} color="#666" />
                  <Text style={styles.dateText}>
                    {new Date(experience.dateDebut).toLocaleDateString()} - {new Date(experience.dateFin).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Aucune expérience ajoutée</Text>
      )}
    </View>
  )};

  const renderSkills = () => {
    return (
    <View style={styles.contentSection}>
      {competences && competences.length > 0 ? (
        <View style={styles.skillsContainer}>
          {competences.map((competence, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{competence.nomCompetence}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>Aucune compétence ajoutée</Text>
      )}
    </View>
  )};

  const renderAboutMe = () => {
    return (
    <View style={styles.contentSection}>
      {about && about.length > 0 ? (
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>{about[0].description}</Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>Aucune description ajoutée</Text>
      )}
    </View>
  )};

  const renderLanguages = () => {
    return (
    <View style={styles.contentSection}>
      {loading.langues ? (
        <ActivityIndicator size="small" color="#FF9228" />
      ) : error.langues ? (
        <Text style={styles.errorText}>Erreur: {error.langues}</Text>
      ) : langues && langues.length > 0 ? (
        langues.map((langue, index) => (
          <View key={index} style={styles.languageItem}>
            <Text style={styles.languageName}>{langue.nomLangue || 'Non spécifié'}</Text>
            <Text style={styles.languageLevel}>{langue.niveau}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>Aucune langue ajoutée</Text>
      )}
    </View>
  )};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
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
                opacity: scrollY.interpolate({
                  inputRange: [0, HEADER_SCROLL_DISTANCE],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                })
              }
            ]}
          >
            <Animated.View style={[styles.avatarContainer, { transform: [{ scale: 1 }] }]}>
              {isLoadingImage ? (
                <ActivityIndicator size="large" color="#3A317B" />
              ) : profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <MaterialCommunityIcons 
                  name="account-circle" 
                  size={94} 
                  color="#3A317B" 
                />
              )}
            </Animated.View>
            <Text style={styles.userName}>{firstName} {lastName}</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                navigation.navigate('EditProfileCandidat', {
                  candidatId: candidatId,
                  firstName: firstName,
                  lastName: lastName
                });
              }}
            >
              <Icon name="edit" size={18} color="#fff" style={styles.editIcon} />
              <Text style={styles.editButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />
        
        <ProfileSection
          title="À propos"
          icon={<MaterialCommunityIcons name="account-details" size={24} color="#FF9228" />}
          content={renderAboutMe()}
          isExpanded={expandedSections.aboutMe}
          onToggle={() => setExpandedSections(prev => ({...prev, aboutMe: !prev.aboutMe}))}
        />

        <ProfileSection
          title="Formation"
          icon={<MaterialCommunityIcons name="school" size={24} color="#FF9228" />}
          content={renderFormations()}
          isExpanded={expandedSections.education}
          onToggle={() => setExpandedSections(prev => ({...prev, education: !prev.education}))}
        />

        <ProfileSection
          title="Experience"
          icon={<MaterialCommunityIcons name="briefcase" size={24} color="#FF9228" />}
          content={renderExperiences()}
          isExpanded={expandedSections.workExperience}
          onToggle={() => setExpandedSections(prev => ({...prev, workExperience: !prev.workExperience}))}
        />

        <ProfileSection
          title="Compétences"
          icon={<MaterialCommunityIcons name="lightbulb-on" size={24} color="#FF9228" />}
          content={renderSkills()}
          isExpanded={expandedSections.skill}
          onToggle={() => setExpandedSections(prev => ({...prev, skill: !prev.skill}))}
        />

        <ProfileSection
          title="Langues"
          icon={<MaterialCommunityIcons name="translate" size={24} color="#FF9228" />}
          content={renderLanguages()}
          isExpanded={expandedSections.language}
          onToggle={() => setExpandedSections(prev => ({...prev, language: !prev.language}))}
        />
      </Animated.ScrollView>
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
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 47,
  },
  userName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginVertical: 8,
    textAlign: 'center',
    fontFamily: 'Roboto',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5
  },
  userTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
    opacity: 0.9,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9228',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  editIcon: {
    marginRight: 4,
  },
  content: {
    paddingTop: HEADER_MAX_HEIGHT + 20,
    paddingHorizontal: 16,
    paddingBottom: 80,
    gap: 16,
  },
  spacer: {
    height: 20,
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileSectionExpanded: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contentSection: {
    gap: 16,
    paddingHorizontal: 16,
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
  experienceIcon: {
    backgroundColor: '#FF9228',
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
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  levelBadge: {
    backgroundColor: '#F0F0F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#3A317B',
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0F0F7',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#F0F0F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 13,
    color: '#3A317B',
    fontWeight: '500',
  },
  languagesContainer: {
    gap: 12,
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
  languageLevel: {
    fontSize: 14,
    color: '#666',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    height: HEADER_MIN_HEIGHT,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  experienceItem: {
    paddingVertical: 12,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  experienceDetails: {
    gap: 8,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyText: {
    fontSize: 14,
    color: '#666',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F0F0F7',
    marginVertical: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
});

export default CandidatProfile;