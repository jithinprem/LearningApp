import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const API_BASE = 'http://192.168.31.42:8001'; // Change to your backend IP

export default function ChipDashboardScreen() {
  const [chips, setChips] = useState([]);

  const fetchChips = async () => {
    try {
      const response = await fetch(`${API_BASE}/chips`);
      const data = await response.json();
      setChips(data);
    } catch (error) {
      console.error('Error fetching chips:', error);
    }
  };

  useEffect(() => {
    fetchChips();
  }, []);

  const renderChip = ({ item }) => (
    <View style={styles.chipItem}>
      <Text style={styles.chipText}>{item.title}</Text>
      <Text style={styles.chipDescription}>{item.description}</Text>
      <Text style={styles.chipCategory}>{item.category}</Text>
      <Text style={styles.chipTags}>Tags: {item.tags.join(', ')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chip Collections</Text>
      <FlatList
        data={chips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderChip}
        ListEmptyComponent={<Text style={styles.emptyText}>No chips found. Create some in the Chip Learnings tab!</Text>}
      />
      <TouchableOpacity style={styles.refreshButton} onPress={fetchChips}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chipItem: {
    backgroundColor: '#f0f0f0',
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
    color: '#333',
    marginTop: 5,
  },
  chipCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  chipTags: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
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
