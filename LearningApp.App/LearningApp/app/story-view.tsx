import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { chipsApi, Story } from '@/services/chipsApi';
import MarkdownViewer from '@/components/markdown-viewer';

export default function StoryViewScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { storyId } = useLocalSearchParams<{ storyId: string }>();

  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [storyContent, setStoryContent] = useState('Loading story...');
  const [loading, setLoading] = useState(true);

  const fetchStory = useCallback(async () => {
    if (!storyId || storyId === '0') {
      Alert.alert('Error', 'Invalid story ID');
      router.back();
      return;
    }

    try {
      setLoading(true);
      const storyParts: Story[] = await chipsApi.fetchStory(parseInt(storyId));
      setStories(storyParts);
      if (storyParts.length > 0) {
        setStoryContent(storyParts[0].story_content);
      } else {
        setStoryContent('No story content found.');
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      Alert.alert('Error', 'Failed to load story');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  // Update content when page or explanation changes
  useEffect(() => {
    if (stories.length > 0 && currentPage < stories.length) {
      const currentStory = stories[currentPage];
      setStoryContent(showExplanation ? currentStory.explanation : currentStory.story_content);
    }
  }, [currentPage, showExplanation, stories]);

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const nextPage = () => {
    if (currentPage < stories.length - 1) {
      setCurrentPage(currentPage + 1);
      setShowExplanation(false);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setShowExplanation(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f5f5f5' }]}>
        <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>Loading story...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f5f5f5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          Story View
        </Text>
        <TouchableOpacity onPress={toggleExplanation} style={styles.explanationButton}>
          <Text style={styles.explanationButtonText}>💡 {showExplanation ? 'Content' : 'Explanation'}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <MarkdownViewer content={storyContent} />
      </ScrollView>

      {/* Pagination - Fixed at bottom */}
      {stories.length > 1 && (
        <View style={[styles.paginationContainer, { backgroundColor: isDark ? 'rgba(21, 23, 24, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
          <TouchableOpacity
            onPress={prevPage}
            disabled={currentPage === 0}
            style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>

          <View style={styles.pageIndicator}>
            <Text style={[styles.pageIndicatorText, { color: isDark ? '#fff' : '#000' }]}>
              Part {currentPage + 1} of {stories.length}
            </Text>
          </View>

          <TouchableOpacity
            onPress={nextPage}
            disabled={currentPage === stories.length - 1}
            style={[styles.pageButton, currentPage === stories.length - 1 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  explanationButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  explanationButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 35, // Extra padding to avoid phone navigation buttons
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 20, // Add space between content and pagination
  },
  pageButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pageIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  pageIndicatorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});