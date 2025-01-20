import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import BottomTabNavigator from '../navigator/BottomTabNavigator';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 350;
const HEADER_MIN_HEIGHT = 84;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const EditCompanyProfile = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showIndustriesModal, setShowIndustriesModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  const [expandedSections, setExpandedSections] = useState({
    about: false,
    industries: false,
    address: false
  });

  const rotationValues = {
    about: useRef(new Animated.Value(0)).current,
    industries: useRef(new Animated.Value(0)).current,
    address: useRef(new Animated.Value(0)).current
  };

  const [companyData, setCompanyData] = useState({
    about: '',
    industries: '',
    address: ''
  });

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingIndustries, setIsEditingIndustries] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [industriesText, setIndustriesText] = useState('');
  const [addressText, setAddressText] = useState('');

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

  const AboutCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={[styles.cardIconContainer, styles.aboutIcon]}>
          <MaterialCommunityIcons name="account-details" size={24} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>À propos de moi</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditingAbout(!isEditingAbout)}
            >
              <MaterialCommunityIcons 
                name={isEditingAbout ? "check" : "pencil"} 
                size={20} 
                color="#3A317B" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDivider} />
          {isEditingAbout ? (
            <TextInput
              style={[styles.aboutInput, { minHeight: 100 }]}
              multiline
              value={aboutText}
              onChangeText={setAboutText}
              placeholder="Description de l'entreprise..."
              placeholderTextColor="#666"
              onBlur={() => {
                if (aboutText.trim()) {
                  setCompanyData(prev => ({
                    ...prev,
                    about: aboutText.trim()
                  }));
                  setIsEditingAbout(false);
                }
              }}
            />
          ) : (
            <Text style={styles.aboutText}>
              {companyData.about || "Aucune description ajoutée"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const IndustriesCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={[styles.cardIconContainer, styles.industriesIcon]}>
          <MaterialCommunityIcons name="briefcase-outline" size={24} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Secteurs d'activités</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditingIndustries(!isEditingIndustries)}
            >
              <MaterialCommunityIcons 
                name={isEditingIndustries ? "check" : "pencil"} 
                size={20} 
                color="#3A317B" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDivider} />
          {isEditingIndustries ? (
            <TextInput
              style={styles.input}
              value={industriesText}
              onChangeText={setIndustriesText}
              placeholder="Ex: Technologie, Finance..."
              placeholderTextColor="#666"
              onBlur={() => {
                if (industriesText.trim()) {
                  setCompanyData(prev => ({
                    ...prev,
                    industries: industriesText.trim()
                  }));
                  setIsEditingIndustries(false);
                }
              }}
            />
          ) : (
            <Text style={styles.aboutText}>
              {companyData.industries || "Aucun secteur ajouté"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const AddressCard = () => {
    return (
      <View style={styles.cardContainer}>
        <View style={[styles.cardIconContainer, styles.addressIcon]}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color="#fff" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Adresse</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditingAddress(!isEditingAddress)}
            >
              <MaterialCommunityIcons 
                name={isEditingAddress ? "check" : "pencil"} 
                size={20} 
                color="#3A317B" 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDivider} />
          {isEditingAddress ? (
            <TextInput
              style={styles.input}
              value={addressText}
              onChangeText={setAddressText}
              placeholder="Adresse complète..."
              placeholderTextColor="#666"
              onBlur={() => {
                if (addressText.trim()) {
                  setCompanyData(prev => ({
                    ...prev,
                    address: addressText.trim()
                  }));
                  setIsEditingAddress(false);
                }
              }}
            />
          ) : (
            <Text style={styles.aboutText}>
              {companyData.address || "Aucune adresse ajoutée"}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));

    Animated.spring(rotationValues[sectionName], {
      toValue: expandedSections[sectionName] ? 0 : 1,
      useNativeDriver: true,
      tension: 125,
      friction: 8
    }).start();
  };

  const getRotation = (sectionName) => {
    return rotationValues[sectionName].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg']
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <View style={styles.headerBackground}>
          <TopNavBar />
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <MaterialCommunityIcons name="account" size={50} color="#D1D1D1" />
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.addressText}>Aucune adresse</Text>
          </View>
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
        <View style={styles.content}>
          <AboutCard />
          <IndustriesCard />
          <AddressCard />
        </View>
      </Animated.ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTabContainer}>
        <BottomTabNavigator />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  content: {
    padding: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aboutIcon: {
    backgroundColor: '#FF6B6B',
  },
  industriesIcon: {
    backgroundColor: '#4CAF50',
  },
  addressIcon: {
    backgroundColor: '#9C27B0',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  aboutInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default EditCompanyProfile;
