import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, SafeAreaView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingIndicator } from '../components';
import showToast from "../utils/showToast";
import {
    deleteNotification,
    getNotifications,
    getUnreadNotificationsCount,
    markNotificationSeen
} from "../redux/slices/notifications/notificationsThunks";
import { clearNotifications } from "../redux/slices/notifications/notificationsSlice";
import TopNavBar from "../components/TopNavBar";
import NotificationItem from "../components/NotificationItem";
import { useScrollToTop } from "@react-navigation/native";
import {Color} from "../constants/Color";

const NotificationsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { notifications, error, isLoading, last, totalPages, currentPage, unreadCount } = useSelector(state => state.notifications);
    const { id } = useSelector((state) => state.auth);
    const flatListRef = useRef(null);
    const isLoadingMore = useRef(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    useScrollToTop(flatListRef);

    const params = {
        userId: id,
        page: 0,
        size: 6
    };

    const initialLoad = async () => {
        try {
            dispatch(clearNotifications());
            await dispatch(getNotifications(params));
            if (id) {
                await dispatch(getUnreadNotificationsCount(id));
            }
        } finally {
            setIsInitialLoad(false);
        }
    };

    useEffect(() => {
        initialLoad();
    }, [id]);

    useEffect(() => {
        if (error) {
            showToast("error", "Loading notifications failed", error);
        }
    }, [error]);

    const handleRefresh = useCallback(async () => {
        if (isLoading) return;

        setRefreshing(true);
        try {
            dispatch(clearNotifications());
            await dispatch(getNotifications(params));
            if (id) {
                await dispatch(getUnreadNotificationsCount(id));
            }
        } finally {
            setRefreshing(false);
        }
    }, [isLoading, id]);

    const handleLoadMore = useCallback(async () => {
        if (!totalPages || isLoadingMore.current || isLoading || last || currentPage >= totalPages - 1) {
            return;
        }

        try {
            isLoadingMore.current = true;
            await dispatch(getNotifications({
                ...params,
                page: currentPage + 1,
            }));
        } finally {
            isLoadingMore.current = false;
        }
    }, [totalPages, isLoading, last, currentPage, params]);

    const handleDeleteNotification = useCallback(async (notificationId) => {
        await dispatch(deleteNotification(notificationId));
        if (id) {
            dispatch(getUnreadNotificationsCount(id));
        }
    }, [id]);

    const handleNotificationPress = useCallback(async (notification) => {
        if (!notification.seen) {
            await dispatch(markNotificationSeen(notification.id));
            dispatch(getUnreadNotificationsCount(id));
        }
    }, [id]);

    const renderEmpty = useCallback(() => (
      <View style={styles.centered}>
          <Image
            source={require('../../assets/notifications.png')}
            style={styles.noNotificationImage}
          />
          <Text style={styles.noNotificationText}>
              You have no notifications at this time
          </Text>
      </View>
    ), []);

    const renderItem = useCallback(({ item }) => (
      <NotificationItem
        item={item}
        onDelete={handleDeleteNotification}
        onPress={handleNotificationPress}
        onGestureStart={() => setIsScrollEnabled(false)}
        onGestureEnd={() => setIsScrollEnabled(true)}
      />
    ), [handleDeleteNotification, handleNotificationPress]);

    if (isInitialLoad && isLoading) {
        return (
          <SafeAreaView style={styles.mainContainer}>
              <TopNavBar />
              <View style={styles.loadingContainer}>
                  <LoadingIndicator size="large" />
              </View>
          </SafeAreaView>
        );
    }

    return (
      <SafeAreaView style={styles.mainContainer}>
          <TopNavBar />
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmpty}
            style={styles.flatListStyle}
            ref={flatListRef}
            scrollEnabled={isScrollEnabled}
            refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[Color.spinner]}
                  tintColor={Color.spinner}
                />
            }
          />
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    noNotificationImage: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },
    noNotificationText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    flatListStyle: {
        flex: 1,
        width: '100%',
    }
});

export default NotificationsScreen;