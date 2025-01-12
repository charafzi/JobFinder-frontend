import React from 'react';
import { View, StyleSheet } from 'react-native';
import CompanyProfileComponent from '../components/CompanyProfile';
import MapView, { Marker } from 'react-native-maps';

const CompanyProfile = () => {
  return (
    <View style={styles.container}>
      <CompanyProfileComponent />
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        loadingEnabled={true}
      >
        <Marker
          coordinate={{
            latitude: 33.706515226499995,
            longitude:7.353300889739835,
          }}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default CompanyProfile;