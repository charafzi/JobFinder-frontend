import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';

const CompanyProfile = () => {
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/google.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.companyName}>Google</Text>
          <Text style={styles.location}>12, StreetFight Building, California, US</Text>
          <Text style={styles.followers}>120k Follower</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Icon name="info-outline" size={24} color="#FF6B6B" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>About</Text>
            </View>
            <TouchableOpacity>
              <Icon name="edit" size={20} color="#FF6B6B" />
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
              <Icon name="business" size={24} color="#FF8C42" style={styles.sectionIcon} />
              <Text style={styles.sectionTitleText}>Industries</Text>
            </View>
            <TouchableOpacity>
              <Icon name="add" size={20} color="#FF8C42" />
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
              <Icon name="edit" size={20} color="#FF6B6B" />
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
                  latitude: 37.78825,
                  longitude: -122.4324,
                }}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.addButton}>
            <Icon name="add" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="grid-view" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#6B4EFF',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 24,
    height: 24,
  },
  companyName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 4,
  },
  followers: {
    color: '#FFF',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    color: '#666',
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFE5CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FF8C42',
    fontSize: 14,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  addressSubText: {
    color: '#666',
    marginBottom: 12,
  },
  mapContainer: {
    height: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompanyProfile;
