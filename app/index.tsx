 import useAuthorized from '@/hooks/useAuthorized';
 import OnboardingScreen from '@/screens/onboarding';
 import { Redirect } from 'expo-router';
 import React from 'react';

 export default function Index() {
     const { authorized } = useAuthorized();

    if (authorized) {
        return <Redirect href="/(tabs)/home" />
    }

    return (
         <OnboardingScreen />
     )
 }


 import { Text, View } from "react-native";

 export default function Index() {
   return (
     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
       <Text>Home works 🎉</Text>
     </View>
   );
 }

 import useAuthorized from '@/hooks/useAuthorized';
 import OnboardingScreen from '@/screens/onboarding';
 import { Redirect } from 'expo-router';

 export default function Index() {
   const { authorized } = useAuthorized();

   if (authorized) {
     return <Redirect href="/(tabs)/home" />;
   }

   return <OnboardingScreen />;
 }

 import { Text, View } from "react-native";

 export default function Index() {
   return (
<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
       <Text>App is working ✅</Text>
     </View>
   );
 }


import useAuthorized from '@/hooks/useAuthorized';
import OnboardingScreen from '@/screens/onboarding';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
    const { authorized } = useAuthorized();

    if (authorized) {
        return <Redirect href="/(tabs)/home" />
    }

    return (
        <OnboardingScreen />
    )
}

