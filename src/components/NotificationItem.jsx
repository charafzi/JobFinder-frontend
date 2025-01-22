import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import {Color} from "../constants/Color";

const SWIPE_THRESHOLD = -75;

const NotificationItem = React.memo(({
																			 item,
																			 onDelete,
																			 onPress,
																			 onGestureStart,
																			 onGestureEnd
																		 }) => {
	const translateX = useSharedValue(0);

	const panGesture = useAnimatedGestureHandler({
		onStart: () => {
			runOnJS(onGestureStart)();
		},
		onActive: (event) => {
			const x = Math.min(0, Math.max(-100, event.translationX));
			translateX.value = x;
		},
		onEnd: (event) => {
			if (translateX.value < SWIPE_THRESHOLD) {
				translateX.value = withSpring(-100);
				runOnJS(onDelete)(item.id);
			} else {
				translateX.value = withSpring(0);
			}
			runOnJS(onGestureEnd)();
		},
	});

	const rStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	const rDeleteStyle = useAnimatedStyle(() => {
		const opacity = Math.min(1, -translateX.value / 50);
		return {
			opacity,
			transform: [{ translateX: Math.max(-100, translateX.value + 100) }],
		};
	});

	return (
		<GestureHandlerRootView style={styles.container}>
			<View style={styles.notificationContainer}>
				<Animated.View style={[styles.deleteButton, rDeleteStyle]}>
					<MaterialCommunityIcons name="delete" size={24} color="#fff" />
					<Text style={styles.deleteText}>Delete</Text>
				</Animated.View>

				<PanGestureHandler onGestureEvent={panGesture}>
					<Animated.View style={[rStyle]}>
						<TouchableOpacity
							style={[
								styles.notificationItem,
								!item.seen && { backgroundColor: Color.unSeen }
							]}
							onPress={() => onPress(item)}
						>
							<View style={styles.iconContainer}>
								<MaterialCommunityIcons
									name={item.seen ? "bell-outline" : "bell-ring"}
									size={24}
									color={item.seen ? "#666" : Color.primary}
								/>
							</View>
							<View style={styles.notificationContent}>
								<Text style={styles.title}>{item.title}</Text>
								<Text style={styles.body}>{item.body}</Text>
							</View>
						</TouchableOpacity>
					</Animated.View>
				</PanGestureHandler>
			</View>
		</GestureHandlerRootView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	notificationContainer: {
		position: 'relative',
		backgroundColor: Color.red,
	},
	notificationItem: {
		flexDirection: 'row',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	iconContainer: {
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	notificationContent: {
		flex: 1,
		marginRight: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: '500',
		marginBottom: 4,
	},
	body: {
		fontSize: 14,
		color: '#666',
	},
	deleteButton: {
		position: 'absolute',
		right: 0,
		height: '100%',
		width: 100,
		backgroundColor: Color.red,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	deleteText: {
		color: '#fff',
		marginLeft: 8,
		fontWeight: '600',
	},
});

export default NotificationItem;