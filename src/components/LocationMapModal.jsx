import React, { useState } from 'react';
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
          <Controller
            control={control}
            name="longitude"
            render={() => (
              <Controller
                control={control}
                name="latitude"
                render={() => (
                  <MapView
                    style={styles.map}
                    initialRegion={initialLocation}
                    onPress={handleMapPress}
                  >
                    {selectedLocation && (
                      <Marker coordinate={selectedLocation} />
                    )}
                  </MapView>
                )}
              />
            )}
          />
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
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Color.text,
  },
  confirmButton: {
    backgroundColor: Color.link,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LocationMapModal;