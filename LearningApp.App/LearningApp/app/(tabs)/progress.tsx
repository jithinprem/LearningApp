import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TrendingUp } from 'lucide-react-native';

export default function ProgressScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Progress</ThemedText>
      <ThemedText style={styles.subtitle}>Track your learning journey</ThemedText>
      
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.stat}>
          <TrendingUp size={32} color="#007AFF" />
          <ThemedText style={styles.statNumber}>42</ThemedText>
          <ThemedText style={styles.statLabel}>Concepts Learned</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stat}>
          <TrendingUp size={32} color="#32CD32" />
          <ThemedText style={styles.statNumber}>15</ThemedText>
          <ThemedText style={styles.statLabel}>Days Streak</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stat}>
          <TrendingUp size={32} color="#FFA500" />
          <ThemedText style={styles.statNumber}>78%</ThemedText>
          <ThemedText style={styles.statLabel}>Completion Rate</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
});