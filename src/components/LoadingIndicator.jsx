import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Color } from "../constants/Color";

const LoadingIndicator = ({ isLoading, size = "small", color = Color.spinner }) => {
    if (!isLoading) return null;

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingIndicator;