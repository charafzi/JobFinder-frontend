import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Color } from '../constants/Color';
import { Controller, useFormContext } from 'react-hook-form';

const LocationMapModal = ({
  showModal,
  handleCloseModal,
  control,
  handleSetLocation,
  initialLocation = {
    latitude: 31.7917, // Latitude du Maroc
    longitude: -7.0926, // Longitude du Maroc
    latitudeDelta: 10, // Niveau de zoom
    longitudeDelta: 10, // Niveau de zoom
  }
}) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Reset selected location when modal is opened
  useEffect(() => {
    if (showModal) {
      setSelectedLocation(null);
    }
  }, [showModal]);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      handleSetLocation(selectedLocation);
      handleCloseModal();
    }
  };

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <MapView
            style={styles.map}
            initialRegion={initialLocation}
            onPress={handleMapPress}
            zoomEnabled={true}
            rotateEnabled={false}
            scrollEnabled={true}
            pitchEnabled={false}
            toolbarEnabled={false}
            moveOnMarkerPress={false}
          >
            {selectedLocation && (
              <Marker 
                coordinate={selectedLocation}
                draggable
                onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
              />
            )}
          </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCloseModal}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, !selectedLocation && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={!selectedLocation}
            >
              <Text style={styles.buttonText}>Confirmer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    height: '80%',
  },
  map: {
    width: '100%',
    height: '85%',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Color.red,
  },
  confirmButton: {
    backgroundColor: Color.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LocationMapModal;