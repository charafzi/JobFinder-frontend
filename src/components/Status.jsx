import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

const Status = React.memo(({ status }) => {
    const getStatusStyle = () => {
        switch(status) {
            case 'ENVOYEE':
                return {
                    container: styles.statusBoxSent,
                    text: styles.statusTextSent,
                    icon: <MaterialIcons name="send" size={16} color="#2196F3" />,
                    label: 'Sent'
                };
            case 'ACCEPTE':
                return {
                    container: styles.statusBoxAccepted,
                    text: styles.statusTextAccepted,
                    icon: <AntDesign name="checkcircle" size={16} color="#4CAF50" />,
                    label: 'Accepted'
                };
            case 'REJETEE':
                return {
                    container: styles.statusBoxRejected,
                    text: styles.statusTextRejected,
                    icon: <AntDesign name="closecircle" size={16} color="#F44336" />,
                    label: 'Rejected'
                };
            default:
                return {
                    container: styles.statusBoxDefault,
                    text: styles.statusTextDefault,
                    icon: null,
                    label: status
                };
        }
    };

    const statusConfig = getStatusStyle();

    return (
        <View style={[styles.statusBox, statusConfig.container]}>
            {statusConfig.icon}
            <Text style={[styles.statusText, statusConfig.text]}>
                {statusConfig.label}
            </Text>
        </View>
    );
});

const styles = StyleSheet.create({
    statusBox: {
        minWidth: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusBoxSent: {
        backgroundColor: '#E3F2FD',
    },
    statusTextSent: {
        color: '#2196F3',
    },
    statusBoxAccepted: {
        backgroundColor: '#E8F5E9',
    },
    statusTextAccepted: {
        color: '#4CAF50',
    },
    statusBoxRejected: {
        backgroundColor: '#FFEBEE',
    },
    statusTextRejected: {
        color: '#F44336',
    },
    statusBoxDefault: {
        backgroundColor: '#F5F5F5',
    },
    statusTextDefault: {
        color: '#9E9E9E',
    }
});

export default Status;