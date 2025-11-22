import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View as RNView, Appearance } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FileText, Youtube, Headphones, Image as ImageIcon, BookOpen, Users, Lightbulb, Target, Zap, Heart, Moon, Sun } from 'lucide-react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const toggleTheme = () => {
    Appearance.setColorScheme(isDark ? 'light' : 'dark');
  };

  const quickActions = [
    { name: 'Story', icon: BookOpen },
    { name: 'Connect', icon: Users },
    { name: 'Ideas', icon: Lightbulb },
    { name: 'Goals', icon: Target },
    { name: 'Flashcards', icon: Zap },
    { name: 'Favorites', icon: Heart },
  ];

  const todaysReview = [
    { id: 1, title: 'React Hooks', progress: '80%' },
    { id: 2, title: 'API Integration', progress: '60%' },
    { id: 3, title: 'State Management', progress: '90%' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <RNView style={styles.header}>
          <ThemedText type="title" style={styles.title}>MindForge</ThemedText>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
            {isDark ? <Sun size={24} color="#FFA500" /> : <Moon size={24} color="#666" />}
          </TouchableOpacity>
        </RNView>
        <ThemedText style={styles.subtitle}>daily learning goals: 3/5 concepts</ThemedText>

        <RNView style={styles.mediaButtons}>
          <TouchableOpacity style={[styles.mediaButton, { backgroundColor: isDark ? '#333' : '#fff' }]}>
            <FileText size={24} color="#007AFF" />
            <ThemedText style={styles.mediaText}>PDF</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mediaButton, { backgroundColor: isDark ? '#333' : '#fff' }]}>
            <Youtube size={24} color="#FF0000" />
            <ThemedText style={styles.mediaText}>YouTube</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mediaButton, { backgroundColor: isDark ? '#333' : '#fff' }]}>
            <Headphones size={24} color="#32CD32" />
            <ThemedText style={styles.mediaText}>Audio</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.mediaButton, { backgroundColor: isDark ? '#333' : '#fff' }]}>
            <ImageIcon size={24} color="#FFA500" />
            <ThemedText style={styles.mediaText}>Image</ThemedText>
          </TouchableOpacity>
        </RNView>

        <ThemedView style={styles.dashboard}>
          <ThemedText type="subtitle" style={styles.dashboardTitle}>Learning Dashboard</ThemedText>
          <ThemedText style={styles.reviewTitle}>Today&apos;s review</ThemedText>
          {todaysReview.map(item => (
            <RNView key={item.id} style={styles.reviewItem}>
              <ThemedText>{item.title}</ThemedText>
              <ThemedText style={styles.progress}>{item.progress}</ThemedText>
            </RNView>
          ))}
          <TouchableOpacity style={styles.practiceButton}>
            <ThemedText style={styles.practiceText}>Practice Now</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.quickActions}>
          <ThemedText type="subtitle" style={styles.quickTitle}>Quick Actions</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={[styles.actionButton, { backgroundColor: isDark ? '#333' : '#fff' }]}>
                <action.icon size={24} color="#007AFF" />
                <ThemedText style={styles.actionText}>{action.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mediaButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    width: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediaText: {
    fontSize: 12,
    marginTop: 5,
  },
  dashboard: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  progress: {
    color: '#007AFF',
  },
  practiceButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  practiceText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 20,
  },
  quickTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginRight: 15,
    width: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    marginTop: 5,
  },
});