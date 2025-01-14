import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Dimensions,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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

const CandidatProfile = () => {
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

  const profileScale = scrollY.interpolate({
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
            <Animated.View style={[styles.profileContainer, { transform: [{ scale: profileScale }] }]}>
              <View style={styles.avatarContainer}>
                <MaterialCommunityIcons 
                  name="account" 
                  size={60} 
                  color="#3A317B" 
                />
              </View>
            </Animated.View>
            <Animated.Text style={[styles.userName, { opacity: headerOpacity }]}>
              John Doe
            </Animated.Text>
            <Animated.Text style={[styles.userTitle, { opacity: headerOpacity }]}>
              Software Engineer
            </Animated.Text>
            <Animated.Text style={[styles.location, { opacity: headerOpacity }]}>
              San Francisco, CA
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
        {/* Formation Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="school" size={24} color="#FF4757" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Formation</Text>
            </View>
            <TouchableOpacity>
              <Icon name="add" size={24} color="#FF4757" />
            </TouchableOpacity>
          </View>
          {/* Formation Items */}
          <View style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <Text style={styles.schoolName}>Stanford University</Text>
              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.degree}>Master in Computer Science</Text>
            <Text style={styles.period}>2018 - 2020</Text>
          </View>
          <View style={styles.educationItem}>
            <View style={styles.educationHeader}>
              <Text style={styles.schoolName}>MIT</Text>
              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.degree}>Bachelor in Computer Science</Text>
            <Text style={styles.period}>2014 - 2018</Text>
          </View>
        </View>

        {/* Experience Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="briefcase-outline" size={24} color="#FF8C42" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Experience</Text>
            </View>
            <TouchableOpacity>
              <Icon name="add" size={24} color="#FF8C42" />
            </TouchableOpacity>
          </View>
          {/* Experience Items */}
          <View style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.companyName}>Google</Text>
              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.position}>Senior Software Engineer</Text>
            <Text style={styles.period}>2020 - Present</Text>
            <Text style={styles.description}>
              Lead development of key features for Google Cloud Platform.
              Managed team of 5 engineers and coordinated with product managers.
            </Text>
          </View>
          <View style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.companyName}>Facebook</Text>
              <TouchableOpacity>
                <Feather name="edit-2" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.position}>Software Engineer</Text>
            <Text style={styles.period}>2018 - 2020</Text>
            <Text style={styles.description}>
              Developed and maintained core features of Facebook's news feed.
              Improved performance metrics by 40%.
            </Text>
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#4834d4" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Skills</Text>
            </View>
            <TouchableOpacity>
              <Icon name="add" size={24} color="#4834d4" />
            </TouchableOpacity>
          </View>
          <View style={styles.skillsContainer}>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>React Native</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>JavaScript</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Python</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>Node.js</Text>
            </View>
            <View style={styles.skillTag}>
              <Text style={styles.skillText}>AWS</Text>
            </View>
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
  profileContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarContainer: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
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
    opacity: 0.9,
    textAlign: 'center',
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
  educationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  degree: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  period: {
    fontSize: 12,
    color: '#999',
  },
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  position: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginTop: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  skillTag: {
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skillText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '500',
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
});

export default CandidatProfile;
