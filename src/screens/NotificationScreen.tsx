import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
} from 'react-native';

const notifications = [
    {
        id: 1,
        title: 'Match Found!',
        message: 'You have been matched with a new opponent.',
        time: '2 mins ago',
    },
    {
        id: 2,
        title: 'Reward Claimed',
        message: 'You successfully claimed your daily reward.',
        time: '15 mins ago',
    },
    {
        id: 3,
        title: 'Friend Request',
        message: 'John Doe sent you a friend request.',
        time: '1 hour ago',
    },
    {
        id: 4,
        title: 'Tournament Update',
        message: 'The Chess Masters tournament starts tomorrow.',
        time: '3 hours ago',
    },
    {
        id: 5,
        title: 'Rematch Invitation',
        message: 'Player Name invited you for a rematch.',
        time: 'Yesterday',
    },
];

const NotificationScreen = () => {
    return (
        <ImageBackground
            source={require('../assets/images/bg-login2.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.heading}>Notifications</Text>

                {notifications.map(item => (
                    <View key={item.id} style={styles.notificationCard}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    container: {
        padding: 20,
        paddingTop: 50,
    },

    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },

    notificationCard: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },

    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
    },

    message: {
        color: '#ddd',
        fontSize: 14,
        marginBottom: 8,
    },

    time: {
        color: '#aaa',
        fontSize: 12,
        textAlign: 'right',
    },
});