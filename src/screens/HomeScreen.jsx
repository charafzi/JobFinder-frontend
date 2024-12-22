import { ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Color } from '../constants/Color'
import { HomeAnnonce } from '../../assets';

const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };

const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <View>
                <Text>Hello</Text>
                <ImageBackground source={HomeAnnonce} resizeMode="cover" style={styles.image}>
                    <Text style={styles.text}>50% off</Text>
                    <Text style={styles.text}>take any courses</Text>
                    <TouchableOpacity style={styles.button}>                        
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 20,
    },
    text: {
      color: 'white',
      fontSize: 18,
      fontWeight: '400',
      paddingHorizontal: 20,
    },
    button: {
        backgroundColor: 'orange',
        padding: 10,
        width: 90,
        height:26,
        justifyContent:'center',
        borderRadius:10,
    }
  });