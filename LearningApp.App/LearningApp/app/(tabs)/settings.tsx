import React from 'react';
import { StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Bell, Shield, HelpCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [privacy, setPrivacy] = React.useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Settings</ThemedText>
      
      <ThemedView style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Bell size={24} color="#007AFF" />
          <ThemedText style={styles.settingText}>Notifications</ThemedText>
          <Switch value={notifications} onValueChange={setNotifications} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Shield size={24} color="#32CD32" />
          <ThemedText style={styles.settingText}>Privacy Mode</ThemedText>
          <Switch value={privacy} onValueChange={setPrivacy} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <HelpCircle size={24} color="#FFA500" />
          <ThemedText style={styles.settingText}>Help & Support</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    borderRadius: 10,
    padding: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
});