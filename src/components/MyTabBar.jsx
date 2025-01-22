import { View, StyleSheet } from 'react-native';
import { useLinkBuilder} from '@react-navigation/native';
import { Color } from '../constants/Color';
import TabBarButton from './TabBarButton';
import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


export function MyTabBar({ state, descriptors, navigation }) {
    const { buildHref } = useLinkBuilder();
    const [dimensions, setDimensions] = useState({ width: 100, height: 20 });

    useEffect(() => {
        tabPositionX.value = withSpring(buttonWith * state.index, { duration: 1500 });
    }, [state.index]);

    const buttonWith = dimensions.width / state.routes.length;

    const onTabBarLayout = (e) => {
        setDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height
        })
    }

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tabPositionX.value }]
    }))


    return (
        <View onLayout={onTabBarLayout} style={styles.tabBar}>
            <Animated.View style={[{
                position: 'absolute',
                width: buttonWith - 25,
                height: dimensions.height - 15,
                borderRadius: 30,
                marginHorizontal: 12,
                backgroundColor: Color.unselectedbutton,
            }, animatedStyle]} />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const icon = options.tabBarIcon(isFocused ? { size: 24, color: Color.background } : { size: 24, color: Color.selectedbutton });

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarButton
                        key={route.key}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        route={route}
                        color={isFocused ? Color.selectedbutton : Color.unselectedbutton}
                        label={label}
                        buildHref={buildHref}
                        options={options}
                        icon={icon}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 50,
        paddingVertical: 15,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },

});