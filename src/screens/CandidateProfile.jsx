import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CandidateProfile = ({ navigation }) => {
  // Sample candidate data - in a real app, this would come from props or an API
  const candidate = {
    name: 'Christie Dagen',
    stats: {
      views: 120,
      followers: 350,
    },
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    workExperience: [
      {
        title: 'Manager',
        company: 'Tech Company',
        duration: 'Jan 2022 - Present',
      }
    ],
    education: [
      {
        school: 'Information Technology',
        degree: "Bachelor's Degree",
        duration: 'Sep 2015 - Jul 2019',
      }
    ],
    skills: ['SQL', 'JavaScript', 'React Native'],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Spanish', level: 'Intermediate' },
    ],
  };

  // Handle accept and decline actions
  const handleAccept = () => {
    console.log('Candidate accepted');
    // Add your accept logic here
  };

  const handleDecline = () => {
    console.log('Candidate declined');
    // Add your decline logic here
  };

  // Reusable section header component
  const SectionHeader = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={24} color="#FF9F1C" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={['#FF9F1C', '#F8D49A']}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{candidate.name}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{candidate.stats.views}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{candidate.stats.followers}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <SectionHeader icon="account" title="About me" />
          <Text style={styles.sectionText}>{candidate.about}</Text>

          <SectionHeader icon="briefcase" title="Work experience" />
          {candidate.workExperience.map((work, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{work.title}</Text>
              <Text style={styles.companyName}>{work.company}</Text>
              <Text style={styles.duration}>{work.duration}</Text>
            </View>
          ))}

          <SectionHeader icon="school" title="Education" />
          {candidate.education.map((edu, index) => (
            <View key={index} style={styles.educationItem}>
              <Text style={styles.schoolName}>{edu.school}</Text>
              <Text style={styles.degree}>{edu.degree}</Text>
              <Text style={styles.duration}>{edu.duration}</Text>
            </View>
          ))}

          <SectionHeader icon="check-circle" title="Skills" />
          <View style={styles.skillsContainer}>
            {candidate.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <SectionHeader icon="translate" title="Languages" />
          {candidate.languages.map((lang, index) => (
            <View key={index} style={styles.languageItem}>
              <Text style={styles.languageName}>{lang.name}</Text>
              <Text style={styles.languageLevel}>{lang.level}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons Container */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={handleDecline}
        >
          <Text style={styles.actionButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
        >
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Add padding to account for action buttons
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#666',
  },
  duration: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  educationItem: {
    marginBottom: 15,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  degree: {
    fontSize: 14,
    color: '#666',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    color: '#666',
    fontSize: 14,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  languageLevel: {
    fontSize: 14,
    color: '#666',
  },
  // New styles for action buttons
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50', // Green color for accept
  },
  declineButton: {
    backgroundColor: '#F44336', // Red color for decline
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CandidateProfile;