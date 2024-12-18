import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Color } from '../../constants/Color'
import AntDesign from '@expo/vector-icons/AntDesign';

const Welcome = ({ navigation }) => {
    const pressHandler = () => {
        navigation.navigate("login");
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Color.background} />
            <Text style={styles.title}>JobFinder</Text>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image source={require('../../assets/welcome.png')} style={styles.image} />
            </View>
            <View>
                <Text style={styles.text}>Find Your</Text>
                <Text style={styles.textLink}>Dream Job</Text>
                <Text style={styles.text}>Here!</Text>
                <Text style={styles.subText}>Explore all the most exciting job roles based on your interest and study major.</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={pressHandler}>
                <AntDesign
                    name="arrowright" size={30}
                    color="white"
                    style={{ transform: [{ translateX: 15 }] }}
                />
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.background,
        padding: 20,
    },
    title: {
        textAlign: 'right',
        fontWeight: '700',
        fontSize: 18,
        paddingTop: 30,
    },
    image: {
        alignSelf: 'center',
    },
    text: {
        fontSize: 40,
        fontWeight: '700',
        color: Color.text,
    },
    textLink: {
        fontSize: 40,
        fontWeight: '700',
        color: Color.link,
        textDecorationLine: 'underline',
    },
    subText: {
        fontSize: 14,
        fontWeight: '400',
        color: Color.subtitle,
    },
    button: {
        backgroundColor: Color.selectedbutton,
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignSelf: 'flex-end',
    }
})