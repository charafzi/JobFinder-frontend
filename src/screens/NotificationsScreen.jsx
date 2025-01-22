import React, {useEffect, useRef, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Image, SafeAreaView} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingIndicator } from '../components';
import showToast from "../utils/showToast";
import {
    deleteNotification,
    getNotifications,
    getUnreadNotificationsCount,
    markNotificationSeen
} from "../redux/slices/notifications/notificationsThunks";
import {clearNotifications} from "../redux/slices/notifications/notificationsSlice";
import TopNavBar from "../components/TopNavBar";
import NotificationItem from "../components/NotificationItem";
import {useScrollToTop} from "@react-navigation/native";

const NotificationsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const {notifications, error, isLoading,last, totalPages,currentPage, unreadCount} = useSelector(state => state.notifications);
    const currentScrollPosition = useRef(0);
    const { id } = useSelector((state) => state.auth);
    const flatListRef = useRef(null);
    const isLoadingMore = useRef(false);
    useScrollToTop(flatListRef);

    const params = {
        userId: id,
        page: 0,
        size: 6
    };

    useEffect(() => {
        clearNotifications();
        loadNotifications();
        if (id) {
            dispatch(getUnreadNotificationsCount(id));
        }
    }, []);

    useEffect(() => {
        if (error) {
            showToast("error", "Login failed", error);
        }
    }, [error]);

    const loadNotifications = () => {
        dispatch(getNotifications(params));
    };

    // this for storing the position of scrolling
    const handleScroll = (event) => {
        currentScrollPosition.current = event.nativeEvent.contentOffset.y;
    };

    useEffect(() => {
        if(currentPage === 0){
            currentScrollPosition.current=0;
        }
    }, [currentPage]);

    // save the current position at scrolling list when new data is fetched
    useEffect(() => {
        if (flatListRef.current && currentScrollPosition.current > 0 && currentPage > 0) {
            flatListRef.current.scrollToOffset({
                offset: currentScrollPosition.current,
                animated: false
            });
        }
    }, [currentPage]);

    const handleDeleteNotification = (notificationId) => {
        dispatch(deleteNotification(notificationId));
    };

    const handleMarkAsSeen = async (notification) => {
        if (!notification.seen) {
            dispatch(markNotificationSeen(notification.id));
        }
    };

    const handleNotificationPress = async (notification) => {
        if (!notification.seen) {
            await dispatch(markNotificationSeen(notification.id));
            dispatch(getUnreadNotificationsCount(id));
        }
        // Handle navigation or other actions based on notification type
        // ...
    };

    const renderEmpty = () =>{
        return<View style={styles.container}>
            <View style={styles.centered}>
                <Image
                  source={require('../../assets/notifications.png')}
                  style={styles.noNotificationImage}
                />
                <Text style={styles.noNotificationText}>
                    You have no notifications at this time
                </Text>
            </View>
        </View>
    }

    const handleLoadMore = () => {
        if (!totalPages) return;
        if (!isLoading && !last && currentPage < totalPages - 1 && !isLoadingMore.current) {
            try {
                isLoadingMore.current = true;
                dispatch(getNotifications({
                    ...params,
                    page: currentPage + 1,
                }));
            } finally {
                isLoadingMore.current = false;
            }
        }
    };

    return (
      <SafeAreaView style={styles.mainContainer}>
          <TopNavBar></TopNavBar>
          <View style={{ flex: 1 }}>
              {isLoading &&
                <View style={styles.loadingContainer}>
                    <LoadingIndicator size={"large"} isLoading={isLoading} ></LoadingIndicator>
                </View>}

              {!isLoading && <FlatList
                data={notifications}
                renderItem={({ item }) => (
                  <NotificationItem
                    item={item}
                    onMarkAsSeen={handleMarkAsSeen}
                    onDelete={handleDeleteNotification}
                    onPress={handleNotificationPress}
                  />
                )}
                keyExtractor={item => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.listContainer}
                ListFooterComponentStyle={styles.footerList}
                ref={flatListRef}
                onScroll={handleScroll}
                ListEmptyComponent={renderEmpty}
                style={styles.flatListStyle}
              />}
          </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer:{
        flex : 1
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1,
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    noNotificationImage: {
        width: 200,
        height: 200,
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
        width: '100%'
    }
});

export default NotificationsScreen;
