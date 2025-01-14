import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const TopNavBar = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.topNavBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const UploadCVSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fileName, fileSize, fileDate } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/google.png')}
            style={styles.companyLogo}
          />
          <Text style={styles.jobTitle}>UI/UX Designer</Text>
          <View style={styles.jobInfo}>
            <Text style={styles.companyName}>Google</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.location}>California</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.time}>1 day ago</Text>
          </View>
        </View>

        <View style={styles.fileContainer}>
          <View style={styles.pdfIconContainer}>
            <Icon name="picture-as-pdf" size={24} color="#FF4757" />
          </View>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
            <Text style={styles.fileInfo}>{fileSize} • {fileDate}</Text>
          </View>
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successImageContainer}>
            {/* Document icon */}
            <View style={styles.documentIcon}>
              <Icon name="description" size={40} color="#FFA94D" />
              {/* Check mark circle */}
              <View style={styles.checkCircle}>
                <Icon name="check" size={16} color="#fff" />
              </View>
            </View>
          </View>
          <Text style={styles.successTitle}>Successful</Text>
          <Text style={styles.successMessage}>
            Congratulations, your application has been sent
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.findButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.findButtonText}>FIND A SIMILAR JOB</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 70,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 14,
    color: '#666',
  },
  dot: {
    marginHorizontal: 8,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#eee',
  },
  pdfIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFE2E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  fileInfo: {
    fontSize: 12,
    color: '#666',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successImageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  documentIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 32,
    height: 32,
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  findButton: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  findButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: '#1A1047',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadCVSuccess;
