import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import CVUploadInput from '../components/CVUploadInput';

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

const UploadCV = () => {
  const navigation = useNavigation();
  const [cvFile, setCvFile] = useState(null);

  const pickDocument = async () => {
    try {
      console.log('Starting document picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        multiple: false
      });
      
      console.log('Document picker result:', result);
      
      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log('Selected file:', selectedFile);
        
        setCvFile({
          name: selectedFile.name,
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          size: selectedFile.size
        });
      } else if (result.type === 'success') {
        console.log('Direct success result:', result);
        
        setCvFile({
          name: result.name,
          uri: result.uri,
          type: result.mimeType,
          size: result.size
        });
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  console.log('Current cvFile:', cvFile);

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      
      <ScrollView style={styles.content}>
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

        <CVUploadInput 
          cvFile={cvFile}
          onFileSelect={setCvFile}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Explain why you are the right person for this job"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.applyButton, !cvFile && styles.applyButtonDisabled]}
        onPress={() => cvFile && navigation.navigate('UploadCVSuccess', {
          fileName: cvFile.name,
          fileSize: `${Math.round(cvFile.size / 1024)} Kb`,
          fileDate: new Date().toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
        })}
        disabled={!cvFile}
      >
        <Text style={[styles.applyButtonText, !cvFile && styles.applyButtonTextDisabled]}>
          APPLY NOW
        </Text>
      </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
    marginBottom:70,
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
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    height: 120,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
  },
  applyButton: {
    backgroundColor: '#1A1047',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButtonTextDisabled: {
    color: '#999',
  },
});

export default UploadCV;