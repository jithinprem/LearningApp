import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { chipsApi, Chip } from '@/services/chipsApi';

export default function ChipDashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [chips, setChips] = useState<Chip[]>([]);

  const fetchChips = async () => {
    try {
      const data = await chipsApi.fetchChips();
      setChips(data);
    } catch (error) {
      console.error('Error fetching chips:', error);
    }
  };

  useEffect(() => {
    fetchChips();
  }, []);

  const renderChip = ({ item }: { item: Chip }) => (
    <View style={[styles.chipItem, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
      <ThemedText style={styles.chipText}>{item.title}</ThemedText>
      <ThemedText style={styles.chipDescription}>{item.description}</ThemedText>
      <ThemedText style={styles.chipCategory}>{item.category}</ThemedText>
      <ThemedText style={styles.chipTags} lightColor="#007AFF" darkColor="#5AC8FA">Tags: {item.tags.join(', ')}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Your Chip Collections</ThemedText>
      <FlatList
        data={chips}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderChip}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No chips found. Create some in the Chip Learnings tab!</ThemedText>}
      />
      <TouchableOpacity style={styles.refreshButton} onPress={fetchChips}>
        <ThemedText style={styles.refreshButtonText}>Refresh</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chipItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chipDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  chipCategory: {
    fontSize: 14,
    marginTop: 5,
  },
  chipTags: {
    fontSize: 14,
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
