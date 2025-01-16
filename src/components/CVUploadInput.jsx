import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';

const CVUploadInput = ({ onFileSelect, cvFile, fileName="Resume", opt=false }) => {
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
        
        onFileSelect({
          name: selectedFile.name,
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          size: selectedFile.size
        });
      } else if (result.type === 'success') {
        console.log('Direct success result:', result);
        
        onFileSelect({
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

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Upload {fileName}</Text>
      <Text style={styles.sectionSubtitle}>Add your {fileName} to apply for a job {opt ? '(opt.)' : ''}</Text>
      
      {!cvFile ? (
        <TouchableOpacity 
          style={styles.uploadBox}
          onPress={pickDocument}
        >
          <Icon name="upload-file" size={24} color="#FF4757" />
          <Text style={styles.uploadText}>Upload {fileName}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.filePreview}>
          <Icon name="description" size={24} color="#FF4757" />
          <Text style={styles.fileName} numberOfLines={1}>
            {cvFile.name}
          </Text>
          <TouchableOpacity onPress={() => onFileSelect(null)}>
            <Icon name="close" size={24} color="#FF4757" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  fileName: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
  },
});

export default CVUploadInput;
