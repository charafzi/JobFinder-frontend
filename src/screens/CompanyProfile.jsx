import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchEntrepriseByEmail,
} from '../redux/slices/EntrepriseProfile/entrepriseProfileThunks';
import { ENTREPRISE_IMAGE_URL } from '../config/axiosConfig';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 350;

const TopNavBar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.topNavBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};


const CompanyProfile = () => {
  const dispatch = useDispatch();
  const { email, id } = useSelector((state) => state.auth);
  const { entreprise, loading, error, profilePicture } = useSelector((state) => state.entrepriseProfile);
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    industries: false,
    address: false
  });

  //see the content of profilePicture on the loading of the page
  useEffect(() => {
    console.log("profile Picture: " ,profilePicture);
  }, []);

  useEffect(() => {
    if (email) {
      dispatch(fetchEntrepriseByEmail(email));
    }
  }, [dispatch, email]);

  const navigation = useNavigation();

  const handleEditProfile = () => {
    navigation.navigate('EditCompanyProfile');
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar translucent backgroundColor="transparent" />      
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <TopNavBar />
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={profilePicture ? { uri: ENTREPRISE_IMAGE_URL + id } : require('../../assets/google.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.companyName}>{entreprise?.name || 'Company Name'}</Text>
              <Text style={styles.location}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#fff" />
                {' '}{entreprise?.adress?.adress || 'Adresse'}, {entreprise?.adress?.city || 'Ville'}
              </Text>
              <Text style={styles.location}>
                <MaterialCommunityIcons name="phone" size={16} color="#fff" />
                {' '}{entreprise?.phoneNumber || 'Non spécifié'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <MaterialCommunityIcons 
                name="pencil" 
                size={24} 
                color="#3A317B" 
              />
              <Text style={styles.editButtonText}>
                Modifier le profil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
      >
        {/* About Section */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => toggleSection('about')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="information-outline" size={24} color="#FF6B6B" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>About</Text>
            </View>
            <View style={styles.expandButton}>
              <Icon 
                name="add"
                size={24} 
                color="#FF9228"
              />
            </View>
          </View>
          {expandedSections.about && (
            <Text style={styles.sectionContent}>
              {entreprise?.about || 'Aucune description disponible'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Industries Section */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => toggleSection('industries')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="office-building" size={24} color="#FF8C42" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Secteurs d'activités</Text>
            </View>
            <View style={styles.expandButton}>
              <Icon 
                name="add"
                size={24} 
                color="#FF9228"
              />
            </View>
          </View>
          {expandedSections.industries && (
            <View style={styles.tags}>
              {entreprise?.activitySectors && entreprise.activitySectors.length > 0 ? (
                entreprise.activitySectors.map((sector, index) => (
                  <View key={sector.id} style={styles.tag}>
                    <Text style={styles.tagText}>{sector.nom}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Aucun secteur d'activité spécifié</Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Address Section */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => toggleSection('address')}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Icon name="place" size={24} color="#FF6B6B" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Address</Text>
            </View>
            <View style={styles.expandButton}>
              <Icon 
                name="add"
                size={24} 
                color="#FF9228"
              />
            </View>
          </View>
          {expandedSections.address && entreprise?.adress && (
            <>
              <Text style={styles.addressText}>
                {entreprise.adress.city}
              </Text>
              <Text style={styles.addressSubText}>
                {entreprise.adress.adress}
              </Text>
              <TouchableOpacity 
                style={styles.mapContainer}
                onPress={() => console.log('Map pressed')}
              >
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: entreprise.adress.latitude,
                    longitude: entreprise.adress.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: entreprise.adress.latitude,
                      longitude: entreprise.adress.longitude,
                    }}
                  />
                </MapView>
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    width: '100%',
    height: HEADER_MAX_HEIGHT,
    backgroundColor: '#3A317B',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerBackground: {
    flex: 1,
    paddingBottom: 50,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 40,
  },
  container: {
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF5EC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
  },
  tagText: {
    color: '#FF9228',
    fontSize: 14,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  addressSubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 16,
  },
  map: {
    flex: 1,
  },
  bottomSpacing: {
    height: 80,
  },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 75,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    resizeMode: 'cover',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  followers: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  editButtonText: {
    color: '#3A317B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  }
});

export default CompanyProfile;