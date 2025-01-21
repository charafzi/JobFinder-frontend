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
import { Color } from '../constants/Color';

const NotificationItem = React.memo(({ item, onMarkAsSeen, onDelete }) => {
	const translateX = useSharedValue(0);

	const panGesture = useAnimatedGestureHandler({
		onActive: (event) => {
			const x = Math.min(0, Math.max(-100, event.translationX));
			translateX.value = x;
		},
		onEnd: (event) => {
			const shouldMarkAsSeen = translateX.value < -50;
			if (shouldMarkAsSeen) {
				runOnJS(onMarkAsSeen)(item);
			}
			translateX.value = withSpring(0);
		},
	});

	const rStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	const rMarkAsSeenStyle = useAnimatedStyle(() => {
		const opacity = Math.min(1, -translateX.value / 50);
		return {
			opacity,
			transform: [{ translateX: Math.max(-100, translateX.value + 100) }],
		};
	});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={styles.notificationContainer}>
				<Animated.View style={[styles.markAsSeenButton, rMarkAsSeenStyle]}>
					<MaterialCommunityIcons name="check-circle" size={24} color="#fff" />
					<Text style={styles.markAsSeenText}>Mark as seen</Text>
				</Animated.View>

				<PanGestureHandler onGestureEvent={panGesture}>
					<Animated.View style={[rStyle]}>
						<TouchableOpacity
							style={[
								styles.notificationItem,
								!item.seen && { backgroundColor: Color.unSeen }
							]}
							onPress={() => onMarkAsSeen(item)}
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
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={() => onDelete(item.id)}
							>
								<Text style={styles.deleteText}>Delete</Text>
							</TouchableOpacity>
						</TouchableOpacity>
					</Animated.View>
				</PanGestureHandler>
			</View>
		</GestureHandlerRootView>
	);
});

const styles = StyleSheet.create({
	notificationContainer: {
		position: 'relative',
		backgroundColor: Color.primary,
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
		padding: 8,
	},
	deleteText: {
		color: Color.primary,
		fontWeight: '500',
	},
	markAsSeenButton: {
		position: 'absolute',
		right: 0,
		height: '100%',
		width: 100,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	markAsSeenText: {
		color: '#fff',
		marginLeft: 8,
		fontWeight: '600',
	},
});

export default NotificationItem;