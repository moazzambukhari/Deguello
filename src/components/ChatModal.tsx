import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
} from 'react-native';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

interface ChatModalProps {
    visible: boolean;
    onClose: () => void;
}

const QUICK_ACTIONS = [
    'Attack',
    'Defend',
    'Help',
    'Back',
];

const ChatModal: React.FC<ChatModalProps> = ({
    visible,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState<'quick' | 'text'>('quick');

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hey Buddy!',
            sender: 'user',
        },
        {
            id: '2',
            text: 'Hello...',
            sender: 'bot',
        },
    ]);

    const handleQuickAction = (action: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: action,
            sender: 'user',
        };

        const botMessage: Message = {
            id: `${Date.now()}-bot`,
            text: getBotReply(action),
            sender: 'bot',
        };

        setMessages(prev => [...prev, userMessage, botMessage]);
        setActiveTab('text');
    };

    const getBotReply = (action: string) => {
        switch (action) {
            case 'Attack':
                return 'Team Player will attack.';
            case 'Defend':
                return 'Team Player will defend.';
            case 'Help':
                return 'Team Player is coming to help.';
            case 'Back':
                return 'Team Player is moving back.';
            default:
                return 'Roger that.';
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === 'user'
                    ? styles.userContainer
                    : styles.botContainer,
            ]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.chatButton}>
                            <Text style={styles.headerText}>Chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {activeTab === 'quick' ? (
                            <View style={styles.quickContainer}>
                                {QUICK_ACTIONS.map(item => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.quickButton}
                                        onPress={() => handleQuickAction(item)}>
                                        <Text style={styles.quickText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <FlatList
                                data={messages}
                                renderItem={renderMessage}
                                keyExtractor={item => item.id}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        )}
                    </View>

                    {/* Bottom Tabs */}
                    <View style={styles.footer}>
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === 'quick' && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab('quick')}>
                                <Text style={styles.tabText}>Quick</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tab,
                                    activeTab === 'text' && styles.activeTabRed,
                                ]}
                                onPress={() => setActiveTab('text')}>
                                <Text style={styles.tabText}>Text</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputRow}>
                            <TextInput
                                placeholder="Type text here..."
                                style={styles.input}
                            />

                            <TouchableOpacity style={styles.sendButton}>
                                <Text style={styles.sendText}>➤</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ChatModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    modalContainer: {
        width: '85%',
        height: '75%',
        // backgroundColor: '#0A3A73',
        borderWidth: 5,
        borderRadius: 30,
        borderColor: '#fff',
        // opacity: 0.5,
        padding: 12,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    chatButton: {
        backgroundColor: '#0088CC',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },

    headerText: {
        color: '#fff',
        fontWeight: '700',
    },

    closeButton: {
        width: 32,
        height: 32,
        backgroundColor: '#E11D48',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    content: {
        flex: 1,
    },

    quickContainer: {
        gap: 12,
    },

    quickButton: {
        backgroundColor: '#D90429',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },

    quickText: {
        color: '#fff',
        fontWeight: '700',
    },

    messageContainer: {
        maxWidth: '75%',
        padding: 10,
        marginVertical: 6,
        borderRadius: 12,
    },

    userContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#38BDF8',
    },

    botContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#DC2626',
    },

    messageText: {
        color: '#fff',
    },

    footer: {
        marginTop: 10,
    },

    tabContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },

    tab: {
        flex: 1,
        backgroundColor: '#38BDF8',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 4,
    },

    activeTab: {
        backgroundColor: '#0284C7',
    },

    activeTabRed: {
        backgroundColor: '#DC2626',
    },

    tabText: {
        color: '#fff',
        fontWeight: '700',
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    input: {
        flex: 1,
        backgroundColor: '#E0F2FE',
        borderRadius: 20,
        paddingHorizontal: 14,
        height: 42,
    },

    sendButton: {
        marginLeft: 8,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },

    sendText: {
        fontSize: 16,
    },
});