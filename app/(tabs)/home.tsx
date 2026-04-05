import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { getAIResponse } from "../../services/ai"

interface Conversation {
  id: string;
  title: string;
  type: string;
  context: string;
  createdAt: string;
  lastMessage?: string;
}

export default function Home() {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)
  const [showEditConversationModal, setShowEditConversationModal] = useState(false)
  const [editingConversation, setEditingConversation] = useState<Conversation | null>(null)
  const [userInfo, setUserInfo] = useState({
    name: '',
    profession: '',
    interests: '',
    goals: ''
  });
  const [currentStep, setCurrentStep] = useState(0)
  const [newConversation, setNewConversation] = useState({ title: '', type: 'general', context: '' })
  const [conversations, setConversations] = useState<Conversation[]>([])

  const memoryItems = [
    { label: "Profile", status: "✓" },
    { label: "Expertise", status: "✓" },
    { label: "Focus Areas", status: "✓" },
    { label: "Goals", status: "✓" }
  ]

  const conversationTypes = [
    { label: "General", value: "general", icon: "chatbubble-outline" },
    { label: "Work", value: "work", icon: "briefcase-outline" },
    { label: "Creative", value: "creative", icon: "create-outline" },
    { label: "Study", value: "learning", icon: "school-outline" },
    { label: "Logic", value: "problem-solving", icon: "bulb-outline" }
  ]

  useEffect(() => {
    checkFirstTimeUser()
    loadConversations()
    loadUserInfo()
  }, [])

  const checkFirstTimeUser = async () => {
    const hasCompleted = await SecureStore.getItemAsync('hasCompletedOnboarding')
    if (!hasCompleted) setShowOnboardingModal(true)
  }

  const loadConversations = async () => {
    const json = await SecureStore.getItemAsync('conversations')
    if (json) setConversations(JSON.parse(json))
  }

  const loadUserInfo = async () => {
    const json = await SecureStore.getItemAsync('userInfo')
    if (json) setUserInfo(JSON.parse(json))
  }

  const saveUserInfo = async () => {
    await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo))
    await SecureStore.setItemAsync('hasCompletedOnboarding', 'true')
    setShowOnboardingModal(false)
    Alert.alert('Welcome!', `Ready to work, ${userInfo.name}!`)
  }

  const handleCreateConversation = async () => {
    if (!newConversation.title.trim()) return;

    const conversation: Conversation = {
      id: Date.now().toString(),
      title: newConversation.title.trim(),
      type: newConversation.type,
      context: newConversation.context.trim(),
      createdAt: new Date().toISOString(),
    }

    const updated = [conversation, ...conversations]
    await SecureStore.setItemAsync('conversations', JSON.stringify(updated))
    setConversations(updated)
    setShowNewConversationModal(false)
    setNewConversation({ title: '', type: 'general', context: '' })
    
    // Navigate to the new conversation
    router.push(`/conversation/${conversation.id}`)
  }

  const getTime = () => {
    const hours = new Date().getHours()
    if (hours < 12) return "Morning"
    if (hours < 18) return "Afternoon"
    return "Evening"
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Habesha AI</Text>
          <Text style={styles.headerSubtitle}>Good {getTime()}, {userInfo.name || "User"} 👋</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => setShowNewConversationModal(true)}>
          <Ionicons name="add-circle" size={24} color="#FFF" />
          <Text style={styles.primaryButtonText}>New Conversation</Text>
        </TouchableOpacity>

        {/* Memory Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Knowledge Base</Text>
          <View style={styles.memoryGrid}>
            {memoryItems.map((item, i) => (
              <View key={i} style={styles.memoryItem}>
                <Text style={styles.memoryStatus}>{item.status}</Text>
                <Text style={styles.memoryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Recent Activity</Text>
        {conversations.length > 0 ? (
          conversations.slice(0, 5).map((conv) => (
            <TouchableOpacity 
              key={conv.id} 
              style={styles.conversationItem}
              onPress={() => router.push(`/conversation/${conv.id}`)}
            >
              <View style={styles.convInfo}>
                <Text style={styles.convTitle}>{conv.title}</Text>
                <Text style={styles.convPreview} numberOfLines={1}>{conv.context}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#444" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent chats. Start one above!</Text>
        )}
      </ScrollView>

      {/* New Chat Modal */}
      <Modal visible={showNewConversationModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Conversation</Text>
            <TouchableOpacity onPress={() => setShowNewConversationModal(false)}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{padding: 20}}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput 
              style={styles.input} 
              placeholder="E.g. React Project Help" 
              placeholderTextColor="#444"
              value={newConversation.title}
              onChangeText={(t) => setNewConversation({...newConversation, title: t})}
            />
            
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.typeGrid}>
              {conversationTypes.map(t => (
                <TouchableOpacity 
                  key={t.value} 
                  style={[styles.typeBadge, newConversation.type === t.value && styles.activeBadge]}
                  onPress={() => setNewConversation({...newConversation, type: t.value})}
                >
                  <Text style={{color: '#FFF'}}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.createBtn} onPress={handleCreateConversation}>
              <Text style={styles.createBtnText}>Start Conversation</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Onboarding Flow would go here - following same pattern */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollView: { paddingHorizontal: 20 },
  header: { paddingVertical: 30 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: 18, color: '#8E8E93', marginTop: 4 },
  primaryButton: { 
    backgroundColor: '#2D8CFF', 
    padding: 18, 
    borderRadius: 15, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30 
  },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  card: { backgroundColor: '#1C1C1E', padding: 20, borderRadius: 20, marginBottom: 30 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  memoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  memoryItem: { flexDirection: 'row', alignItems: 'center' },
  memoryStatus: { color: '#2D8CFF', marginRight: 5, fontWeight: 'bold' },
  memoryLabel: { color: '#8E8E93' },
  sectionLabel: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  conversationItem: { 
    backgroundColor: '#1C1C1E', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10 
  },
  convInfo: { flex: 1 },
  convTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  convPreview: { color: '#8E8E93', fontSize: 12, marginTop: 2 },
  emptyText: { color: '#444', textAlign: 'center', marginTop: 20 },
  modalBg: { flex: 1, backgroundColor: '#111' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  inputLabel: { color: '#8E8E93', marginBottom: 8, marginTop: 20 },
  input: { backgroundColor: '#1C1C1E', color: '#FFF', padding: 15, borderRadius: 10 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeBadge: { padding: 10, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  activeBadge: { backgroundColor: '#2D8CFF', borderColor: '#2D8CFF' },
  createBtn: { backgroundColor: '#2D8CFF', padding: 18, borderRadius: 15, marginTop: 40, alignItems: 'center' },
  createBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
})