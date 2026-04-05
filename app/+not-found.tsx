import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      {/* This ensures the header title says Oops! even if the screen is missing */}
      <Stack.Screen options={{ title: 'Oops!', headerTintColor: '#FFFFFF', headerStyle: { backgroundColor: '#000000' } }} />
      
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={80} color="#2D8CFF" style={styles.icon} />
        
        <Text style={styles.title}>This screen does not exist.</Text>
        <Text style={styles.subtitle}>The page you are looking for might have been moved or deleted.</Text>
        
        <Link href="/" style={styles.link}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Go to home screen</Text>
          </View>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  link: {
    marginTop: 15,
  },
  button: {
    backgroundColor: '#2D8CFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});