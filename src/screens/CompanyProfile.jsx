import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomTabNavigation from '../navigator/BottomTabNavigator';

const { width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const TopNavBar = ({ opacity }) => {
  const navigation = useNavigation();
  return (
    <Animated.View style={[styles.topNavBar, { opacity }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const CompanyProfile = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const logoScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const headerContentTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor="#38354c" barStyle="light-content" />
      
      <Animated.View 
        style={[
          styles.headerContainer, 
          { 
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <LinearGradient
          colors={['#38354c', '#3A317B']}
          style={styles.headerBackground}
        >
          <TopNavBar opacity={headerOpacity} />
          <Animated.View 
            style={[
              styles.headerContent, 
              { 
                opacity: headerOpacity,
                transform: [{ translateY: headerContentTranslateY }]
              }
            ]}
          >
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              <Image
                source={require('../../assets/google.png')}
                style={styles.logo}
              />
            </Animated.View>
            <Animated.Text style={[styles.companyName, { opacity: headerOpacity }]}>
              Google
            </Animated.Text>
            <Animated.Text style={[styles.location, { opacity: headerOpacity }]}>
              12, StreetFight Building, California, US
            </Animated.Text>
            <Animated.Text style={[styles.followers, { opacity: headerOpacity }]}>
              120k Follower
            </Animated.Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="information-outline" size={24} color="#FF6B6B" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>About</Text>
            </View>
            <TouchableOpacity>
              <Feather name="edit" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionContent}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus id commodo egestas metus interdum dolor.
          </Text>
        </View>

        {/* Industries Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="office-building" size={24} color="#FF8C42" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Industries</Text>
            </View>
            <TouchableOpacity>
              <Icon name="add" size={24} color="#FF8C42" />
            </TouchableOpacity>
          </View>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Information Technology</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Advertising</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Cloud Computing</Text>
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Icon name="place" size={24} color="#FF6B6B" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Address</Text>
            </View>
            <TouchableOpacity>
              <Feather name="edit" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>California</Text>
          <Text style={styles.addressSubText}>12, StreetFight Building, California US</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 33.706515226499995,
                longitude: 7.353300889739835,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 33.706515226499995,
                  longitude: 7.353300889739835,
                }}
              />
            </MapView>
          </View>
        </View>
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
      <View style={styles.bottomTabContainer}>
        <BottomTabNavigation />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: HEADER_MAX_HEIGHT + 20,
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
    marginTop: 12,
    gap: 10,
  },
  tag: {
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#666',
    fontSize: 13,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
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
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  followers: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default CompanyProfile;