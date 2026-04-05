import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppSettings {
    defaultModel: string;
    responseStyle: string;
    conversationLength: string;
}

export default function Preferences() {
    const [settings, setSettings] = useState<AppSettings>({
        defaultModel: 'gpt-3.5-turbo',
        responseStyle: 'Friendly',
        conversationLength: 'Medium'
    });

    const models = [
        { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        { label: 'GPT-4', value: 'gpt-4' },
        { label: 'GPT-4o-mini', value: 'gpt-4o-mini' }
    ];

    const responseStyles = [
        { label: 'Friendly', value: 'Friendly' },
        { label: 'Concise', value: 'Concise' },
        { label: 'Detailed', value: 'Detailed' }
    ];

    const conversationLengths = [
        { label: 'Short', value: 'Short' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Long', value: 'Long' }
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await SecureStore.getItemAsync('app_settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (newSettings: AppSettings) => {
        try {
            await SecureStore.setItemAsync('app_settings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    const clearAllData = async () => {
        Alert.alert(
            'Clear All Data',
            'This will permanently delete all your conversations, user information, and settings. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All Data',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const keys = ['conversations', 'userInfo', 'hasCompletedOnboarding', 'openai_api_key', 'app_settings'];
                            await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
                            await AsyncStorage.removeItem('authorized');

                            Alert.alert('Data Cleared', 'The app will now restart.', [
                                { text: 'OK', onPress: () => router.replace('/') }
                            ]);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear data.');
                        }
                    }
                }
            ]
        );
    };

    // Helper for URLs
    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
    };

    const renderSettingItem = (
        title: string,
        subtitle: string,
        value: string,
        options: { label: string; value: string }[],
        onSelect: (val: string) => void
    ) => (
        <View style={styles.settingItem}>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                    Alert.alert(
                        title,
                        'Choose an option:',
                        options.map(option => ({
                            text: option.label,
                            onPress: () => onSelect(option.value)
                        })),
                        { cancelable: true }
                    );
                }}
            >
                <Text style={styles.selectText}>
                    {options.find(opt => opt.value === value)?.label || 'Select'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#111111" />
            </TouchableOpacity>
        </View>
    );

    const renderActionItem = (
        title: string,
        subtitle: string,
        icon: string,
        onPress: () => void,
        destructive = false
    ) => (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={styles.actionIcon}>
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={destructive ? '#FF3B30' : '#2D8CFF'}
                />
            </View>
            <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, destructive && styles.destructiveText]}>
                    {title}
                </Text>
                <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Preferences</Text>
                    <Text style={styles.headerSubtitle}>Customize your AI assistant experience</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={22} color="#2D8CFF" />
                        <Text style={styles.sectionTitle}>App Settings</Text>
                    </View>

                    {renderSettingItem(
                        'Default Model',
                        'Choose your preferred AI model',
                        settings.defaultModel,
                        models,
                        (value) => saveSettings({ ...settings, defaultModel: value })
                    )}

                    {renderSettingItem(
                        'Response Style',
                        'Tone of the AI responses',
                        settings.responseStyle,
                        responseStyles,
                        (value) => saveSettings({ ...settings, responseStyle: value })
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#2D8CFF" />
                        <Text style={styles.sectionTitle}>Privacy & Data</Text>
                    </View>

                    {renderActionItem(
                        'Clear All Data',
                        'Delete all local storage',
                        'trash-outline',
                        clearAllData,
                        true
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle-outline" size={22} color="#2D8CFF" />
                        <Text style={styles.sectionTitle}>App Information</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Version</Text>
                        <Text style={styles.infoValue}>1.2.0</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingVertical: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF', // Changed from #111111
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#A1A1A1', // Changed from #FFFFFF for better hierarchy
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF', // Changed from #111111
    },
    settingItem: {
        backgroundColor: '#1C1C1E', // Darker gray for cards
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
        marginTop: 2,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        gap: 4,
    },
    selectText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    actionSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
    },
    destructiveText: {
        color: '#FF453A',
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1C1C1E',
        borderRadius: 12,
        padding: 16,
    },
    infoLabel: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    infoValue: {
        fontSize: 16,
        color: '#8E8E93',
    },
});