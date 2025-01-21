import { Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Color } from '../constants/Color';

const TabBarButton = ({ buildHref, route, isFocused, onPress, onLongPress, options, label, icon }) => {
    const scale = useSharedValue(0);
    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused,
            { duration: 350 }
        );
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 10]);
        return {
            transform: [{ scale: scaleValue }],
            top
        }
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0]);
        return {
            opacity
        }
    });

    return (
        <Pressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
        >
            <Animated.View style={animatedIconStyle}>
                {icon}
            </Animated.View>
            <Animated.Text style={[{ color: isFocused ? Color.background : Color.selectedbutton, fontSize: 12, marginTop: 5 }, animatedTextStyle]}>
                {label}
            </Animated.Text>
        </Pressable>
    )
}

export default TabBarButton

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})