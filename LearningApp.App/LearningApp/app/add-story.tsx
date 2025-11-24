import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { chipsApi } from '@/services/chipsApi';

export default function AddStoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [storyTitle, setStoryTitle] = useState('');
  const [chiefPlot, setChiefPlot] = useState('');
  const [storySummary, setStorySummary] = useState('');

  const handleCreateStory = async () => {
    if (!storyTitle.trim()) {
      Alert.alert('Error', 'Story title is required.');
      return;
    }
    if (!chiefPlot.trim()) {
      Alert.alert('Error', 'Chief plot is required.');
      return;
    }

    try {
      await chipsApi.createStoryCraft({
        story_title: storyTitle,
        chief_plot: chiefPlot,
        story_summary: storySummary || undefined,
      });
      Alert.alert('Success', 'Story created successfully!');
      router.back(); // Go back to previous screen
    } catch (error) {
      console.error('Error creating story:', error);
      Alert.alert('Error', 'Failed to create story.');
    }
  };

  const handleAutogenerate = async () => {
    try {
      const generated = await chipsApi.generateStoryCraft();
      setStoryTitle(generated.story_title);
      setChiefPlot(generated.chief_plot);
      setStorySummary(generated.story_summary || '');
    } catch (error) {
      console.error('Error generating story:', error);
      Alert.alert('Error', 'Failed to generate story.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Create New Story</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Story Title"
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={storyTitle}
          onChangeText={setStoryTitle}
        />
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000', height: 100 }]}
          placeholder="Chief Plot"
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={chiefPlot}
          onChangeText={setChiefPlot}
          multiline
        />
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000', height: 80 }]}
          placeholder="Story Summary (optional)"
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={storySummary}
          onChangeText={setStorySummary}
          multiline
        />

        <TouchableOpacity style={styles.autogenerateButton} onPress={handleAutogenerate}>
          <Text style={styles.autogenerateButtonText}>Autogenerate Story</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateStory}>
          <Text style={styles.createButtonText}>Create Story</Text>
        </TouchableOpacity>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  autogenerateButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  autogenerateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});