import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Color } from '../../constants/Color'

const LogoScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('welcome');
        }, 2000);
    },[navigation])
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo}/>
            <Text style={styles.logoText}>JobFinder</Text>
        </View>
    )
}

export default LogoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.selectedbutton,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 60,
        height: 60,
    },
    logoText: {
        marginTop: 10,
        color: 'white',
        fontSize: 26,
        fontWeight: '700',
    },
})