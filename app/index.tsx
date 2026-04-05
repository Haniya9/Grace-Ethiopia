import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import useAuthorized from '@/hooks/useAuthorized';
import OnboardingScreen from '@/screens/onboarding';

export default function Index() {
    const { authorized, isLoading } = useAuthorized();

    // 1. Show a loader while checking the auth status
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
                <ActivityIndicator size="large" color="#2D8CFF" />
            </View>
        );
    }

    // 2. If authorized, send them straight to the main app tabs
    if (authorized) {
        return <Redirect href="/(tabs)/home" />;
    }

    // 3. Otherwise, show the onboarding flow
    return <OnboardingScreen />;
}