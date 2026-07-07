import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { addTutorialVideo } from '../firebase/videos';

const AddVideoScreen = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim() || !description.trim() || !videoUrl.trim()) {
            Alert.alert('Missing Fields', 'Title, description, and video URL are required.');
            return;
        }

        setSaving(true);

        try {
            await addTutorialVideo({
                title: title.trim(),
                description: description.trim(),
                videoUrl: videoUrl.trim(),
                thumbnailUrl: thumbnailUrl.trim() || undefined,
                order: 0,
            });

            Alert.alert('Success', 'Tutorial video added successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message ?? 'Failed to add tutorial video.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <LinearGradient colors={['#00084D', '#0010A0']} style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Add Tutorial Video</Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    <Text style={styles.subtitle}>
                        Save a tutorial video to Firestore. Use a direct MP4 URL or Firebase Storage link.
                    </Text>

                    <Field label="Title" value={title} onChangeText={setTitle} />
                    <Field
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                    <Field
                        label="Video URL"
                        value={videoUrl}
                        onChangeText={setVideoUrl}
                        autoCapitalize="none"
                    />
                    <Field
                        label="Thumbnail URL (optional)"
                        value={thumbnailUrl}
                        onChangeText={setThumbnailUrl}
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        <Text style={styles.saveText}>
                            {saving ? 'Saving...' : 'Save Video'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

function Field({
    label,
    value,
    onChangeText,
    multiline = false,
    autoCapitalize = 'sentences',
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    multiline?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={[styles.input, multiline && styles.inputMultiline]}
                placeholderTextColor="#8B8DB6"
                multiline={multiline}
                autoCapitalize={autoCapitalize}
            />
        </View>
    );
}

export default AddVideoScreen;

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1 },
    content: {
        paddingHorizontal: 18,
        paddingTop: 30,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerSpacer: {
        width: 24,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
    },
    subtitle: {
        color: '#D0D0D0',
        fontSize: 13,
        marginBottom: 20,
        lineHeight: 20,
    },
    fieldWrap: {
        marginBottom: 14,
    },
    fieldLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#8B8DB6',
        borderRadius: 14,
        color: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
    },
    inputMultiline: {
        minHeight: 90,
        textAlignVertical: 'top',
    },
    saveButton: {
        marginTop: 10,
        height: 55,
        borderRadius: 12,
        backgroundColor: '#E30016',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
