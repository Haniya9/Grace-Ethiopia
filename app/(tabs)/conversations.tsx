import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Conversation {
  id: string;
  title: string;
  type: string;
  context: string;
  createdAt: string;
}

export default function Conversations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const conversationsJson = await SecureStore.getItemAsync('conversations');
      if (conversationsJson) {
        const loadedConversations: Conversation[] = JSON.parse(conversationsJson);
        setConversations(loadedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleDeleteConversation = async (conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = conversations.filter(conv => conv.id !== conversationId);
            await SecureStore.setItemAsync('conversations', JSON.stringify(updated));
            setConversations(updated);
          }
        }
      ]
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.context.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      work: 'briefcase-outline',
      creative: 'create-outline',
      learning: 'school-outline',
      'problem-solving': 'bulb-outline',
      personal: 'person-outline',
      default: 'chatbubble-outline'
    };
    return icons[type] || icons.default;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      work: '#FF9500',
      creative: '#AF52DE',
      learning: '#34C759',
      'problem-solving': '#FF3B30',
      personal: '#5856D6',
      default: '#2D8CFF'
    };
    return colors[type] || colors.default;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Ionicons name="add-circle-outline" size={28} color="#2D8CFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <Text style={styles.statusText}>Loading...</Text>
        ) : filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={80} color="#333" />
            <Text style={styles.emptyStateTitle}>No conversations found</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton} 
              onPress={() => router.push('/home')}
            >
              <Text style={styles.emptyStateButtonText}>Start New Chat</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredConversations.map((conv) => (
            <TouchableOpacity 
              key={conv.id} 
              style={styles.conversationItem}
              onLongPress={() => handleDeleteConversation(conv.id)}
            >
              <View style={[styles.iconCircle, { backgroundColor: getTypeColor(conv.type) + '20' }]}>
                <Ionicons name={getTypeIcon(conv.type)} size={20} color={getTypeColor(conv.type)} />
              </View>
              <View style={styles.content}>
                <View style={styles.itemHeader}>
                  <Text style={styles.conversationTitle}>{conv.title}</Text>
                  <Text style={styles.timeText}>{formatTimeAgo(conv.createdAt)}</Text>
                </View>
                <Text style={styles.previewText} numberOfLines={2}>{conv.context}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#444" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333'
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    margin: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  searchInput: { flex: 1, marginLeft: 10, color: '#FFFFFF', fontSize: 16 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  statusText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
  conversationItem: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center'
  },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  content: { flex: 1 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  conversationTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  timeText: { color: '#8E8E93', fontSize: 12 },
  previewText: { color: '#8E8E93', fontSize: 14, lineHeight: 20 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyStateTitle: { color: '#FFFFFF', fontSize: 18, marginTop: 20 },
  emptyStateButton: { backgroundColor: '#2D8CFF', padding: 15, borderRadius: 10, marginTop: 20 },
  emptyStateButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});