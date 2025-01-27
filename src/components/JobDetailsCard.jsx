import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {ENTREPRISE_IMAGE_URL} from "../config/axiosConfig";
import {Color} from "../constants/Color";
import formatDate from "../utils/formatDate";

const JobDetailsCard =  React.memo( ({
                            offre
}) => {
    const [showFullResponse, setShowFullResponse] = useState(false);

    const toggleResponseView = () => {
        setShowFullResponse(!showFullResponse);
    };

    return (
    <ScrollView
        style={styles.container}
    >
      <View style={styles.header}>
          <Image source={{ uri: ENTREPRISE_IMAGE_URL+offre.company.id }} style={styles.logo} />
        <Text style={styles.title}>{offre.title || 'UI/UX Designer'}</Text>
        <View style={styles.headerInfo}>
            <Text style={styles.company}>{offre.company.name || 'Google'}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.location}>{offre.adress.adress|| '12, Block 13'}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.city}>{offre.adress.city || 'California'}</Text>
        </View>
      </View>

      {/* Job Description */}
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>

          <Text
              style={styles.description}
              numberOfLines={showFullResponse ? undefined : 2}
          >
              {offre.description || 'Sed ut perspiciakjnjjkjhhgv'}
          </Text>
          {offre.description?.length > 80 && (
              <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={toggleResponseView}
              >
                  <Text style={styles.readMoreText}>
                      {showFullResponse ? 'Read less' : 'Read more'}
                  </Text>
              </TouchableOpacity>
          )}
      </View>

        {/* Informations */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            <View style={styles.informationsGrid}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoTitle}>Position</Text>
                    <View style={styles.positionBox}>
                        <Text style={styles.position}>{offre.position}</Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoTitle}>Salary</Text>
                    <View style={styles.salaryBox}>
                        <Text style={styles.salary}>{offre.salary} Dh</Text>
                        <Text style={styles.month}>
                            /Mo
                        </Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoTitle}>Contract Type</Text>
                    <View style={styles.contractTypeBox}>
                        <Text style={styles.contractTypeText}>{offre.contractType}</Text>
                    </View>
                </View>
                {/*<View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Specialization</Text>
            <Text style={styles.infoValue}>{offre.specialization || 'Design'}</Text>
          </View>*/}
            </View>
        </View>

      {/* Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        <View style={styles.requirementsList}>
          {(offre.requirements || [
            'Sed ut perspiciatis unde omnis iste natus error sit.',
            'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur & adipisci velit.',
            'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
            'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur'
          ]).map((req, index) => (
            <Text key={index} style={styles.requirement}>• {req}</Text>
          ))}
        </View>
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.address}>{offre.adress.adress || 'Overlook Avenue, Belleville, NJ, USA'}</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: offre.adress.latitude || 40.7128,
              longitude: offre.adress.longitude || -74.0060,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: offre.adress.latitude || 40.7128,
                longitude: offre.adress.longitude || -74.0060,
              }}
            />
          </MapView>
        </View>
      </View>

    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Question</Text>
        <Text style={styles.infoItem}>{offre.question}</Text>
    </View>

        {/* Dates */}
        <View style={styles.detailsContainer}>
            <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Publication Date</Text>
                <View style={styles.publicationDateBox}>
                    <Text style={styles.dateText}>{formatDate(offre.publicationDate)}</Text>
                </View>
            </View>
            <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Deadline Date</Text>
                <View style={styles.deadlineDateBox}>
                    <Text style={styles.dateText}>{formatDate(offre.deadlineDate)}</Text>
                </View>
            </View>
        </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal : 25
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
      textAlign: "center",
      color: Color.text,
      minWidth : '20%',
      maxWidth : '20%',
  },
  dot: {
    marginHorizontal: 8,
    color: Color.secondary,
  },
  location: {
      textAlign: "center",
      minWidth : '55%',
      maxWidth : '55%',
    color: Color.text,
  },
    city: {
        textAlign: "center",
        minWidth : '20%',
        maxWidth : '20%',
        color: Color.text,
    },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
      alignItems : "center"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#666',
    lineHeight: 22,
  },
    readMoreButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    readMoreText: {
        color: Color.primary,
        fontSize: 12,
        fontWeight: '600',
    },
  requirementsList: {
    marginTop: 10,
  },
  requirement: {
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  address: {
    color: '#666',
    marginBottom: 15,
  },
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
    informationsGrid : {
      display : "flex",
      flexDirection : "row",
      justifyContent : "space-evenly",
    },
  infoItem: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize : 12,
    fontWeight : "bold",
    color: Color.text,
    marginBottom: 5
  },
  dateLabel : {
      fontSize : 12,
      fontWeight : "bold",
      color: Color.text,
      marginBottom: 5
  },
  infoValue: {
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: Color.primary,
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsContainer: {
      width : '100%',
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      gap: 15,
      paddingHorizontal : 20,
      marginVertical : 15,
  },
  dateContainer: {
      flex : 1,
  },
  publicationDateBox: {
      backgroundColor: Color.purple,
      paddingVertical: 5,
      borderRadius: 5,
      padding : 10,
  },
  deadlineDateBox: {
      backgroundColor: Color.red,
      paddingVertical: 5,
      borderRadius: 5,
      padding : 10,
  },
  dateText:{
      textAlign : "center",
      fontSize: 12,
      fontWeight: "600",
      color : Color.background
  },
  contractTypeBox: {
      minHeight: 30,
      backgroundColor: Color.secondary,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5
  },
  contractTypeText:{
      fontSize: 11,
      fontWeight: "bold",
      color : Color.background
  },
  position: {
      color: Color.background,
      fontWeight: "bold",
      fontSize: 12,
      textAlign : "center"
  },
  positionBox: {
      minHeight: 30,
      maxWidth : 200,
      backgroundColor: Color.primary,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5,
  },
  salaryBox : {
      flexDirection: "row",
      alignContent : "center",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "space-evenly",
      minWidth: 50,
      height: 30,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5,
      backgroundColor : Color.boxBackground,
      gap : 5
  },
  salary :{
      fontSize: 11,
      fontWeight: "bold",
      color : Color.text,
  },
  month :{
      fontSize: 10,
      fontWeight: "bold",
      paddingTop: -10,
      color :  Color.text,
  },
});

export default JobDetailsCard;