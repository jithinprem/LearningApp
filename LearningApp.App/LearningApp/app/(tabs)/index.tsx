import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  ScrollView 
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { chipsApi, Chip, StoryCraft, Story } from '@/services/chipsApi';
import MarkdownViewer from '../../components/markdown-viewer';

export default function ChipLearningScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [chips, setChips] = useState<Chip[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [appTitle, setAppTitle] = useState('Fetching title...');
  const [selectedStory, setSelectedStory] = useState<string>('0');
  const [storyid, setStoryid] = useState(0);
  const [storyDrivingPrompt, setStoryDrivingPrompt] = useState('');
  const [storyOptions, setStoryOptions] = useState<{ id: number; title: string }[]>([{ id: 0, title: 'New Story' }]);
  const [storyContent, setStoryContent] = useState('story loading...');
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const fetchStoryContent = useCallback(async (storyId: number) => {
    if (storyId === 0) {
      setStories([]);
      setCurrentPage(0);
      setShowExplanation(false);
      setStoryContent('No story selected. Create a new story or select an existing one.');
      return;
    }
    try {
      const storyParts: Story[] = await chipsApi.fetchStory(storyId);
      setStories(storyParts);
      setCurrentPage(0);
      setShowExplanation(false);
      if (storyParts.length > 0) {
        setStoryContent(storyParts[0].story_content);
      } else {
        setStoryContent('No story parts found.');
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      setStories([]);
      setCurrentPage(0);
      setShowExplanation(false);
      setStoryContent('Failed to load story.');
    }
  }, []);

  const fetchChips = async () => {
    try {
      const data = await chipsApi.fetchChips();
      setChips(data);
    } catch (error) {
      console.error('Error fetching chips:', error);
    }
  };

  const fetchTitle = async () => {
    try {
      const data = await chipsApi.fetchTitle();
      setAppTitle(data.title);
    } catch (error) {
      console.error('Error fetching title:', error);
    }
  };

  const fetchStories = useCallback(async () => {
    try {
      const stories: StoryCraft[] = await chipsApi.fetchStoryCrafts();
      const options = [{ id: 0, title: 'New Story' }, ...stories.map(story => ({ id: story.storyid, title: story.story_title }))];
      setStoryOptions(options);
      // Fetch content for default selected story (0)
      fetchStoryContent(0);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  }, [fetchStoryContent]);

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

  // Update content when page or explanation changes
  useEffect(() => {
    if (stories.length > 0 && currentPage < stories.length) {
      const currentStory = stories[currentPage];
      setStoryContent(showExplanation ? currentStory.explanation : currentStory.story_content);
    }
  }, [currentPage, showExplanation, stories]);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addChip = async () => {
    if (!title.trim()) return;

    try {
      await chipsApi.addChip({
        title,
        description,
        category,
        tags,
        storyid,
        story_driving_prompt: storyDrivingPrompt || undefined,
      });
      
      setTitle('');
      setDescription('');
      setTags([]);
      setStoryid(0);
      setStoryDrivingPrompt('');
      fetchChips();
    } catch (error) {
      console.error('Error adding chip:', error);
    }
  };

  const deleteChip = async (id: number) => {
    try {
      await chipsApi.deleteChip(id);
      fetchChips();
    } catch (error) {
      console.error('Error deleting chip:', error);
    }
  };

  useEffect(() => {
    fetchChips();
    fetchTitle();
    fetchStories();
  }, [fetchStories]);

  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, [fetchStories])
  );

  const renderChip = ({ item }: any) => (
    <View style={[styles.chip, { backgroundColor: isDark ? '#333' : '#fff' }]}>
      <View style={styles.chipContent}>
        <Text style={[styles.chipText, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
        <Text style={[styles.chipDescription, { color: isDark ? '#ccc' : '#333' }]}>{item.description}</Text>
        <Text style={[styles.chipCategory, { color: isDark ? '#ccc' : '#666' }]}>{item.category}</Text>
        <Text style={[styles.chipTags, { color: isDark ? '#007AFF' : '#007AFF' }]}>Tags: {item.tags.join(', ')}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteChip(item.id)}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Link href="/dashboard/chipdashboard" asChild>
        <TouchableOpacity style={styles.dashboardButton}>
          <Text style={styles.dashboardButtonText}>View Dashboard</Text>
        </TouchableOpacity>
      </Link>
      <ScrollView style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f5f5f5' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{appTitle}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Enter chip title..."
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Enter description..."
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.categoryInput, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Category"
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={category}
          onChangeText={setCategory}
        />
        <View style={styles.storyRow}>
          <Picker
            selectedValue={storyid}
            onValueChange={(itemValue: number) => setStoryid(itemValue)}
            style={[styles.picker, { color: isDark ? '#fff' : '#000', flex: 1 }]}
          >
            {storyOptions.map((story) => (
              <Picker.Item key={story.id} label={story.title} value={story.id} />
            ))}
          </Picker>
          <Link href="/add-story" asChild>
            <TouchableOpacity style={styles.addStoryButton}>
              <Text style={styles.addStoryButtonText}>Add Storycraft</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000', height: 80 }]}
          placeholder="Story driving prompt (optional)..."
          placeholderTextColor={isDark ? '#ccc' : '#666'}
          value={storyDrivingPrompt}
          onChangeText={setStoryDrivingPrompt}
          multiline
        />
        <View style={styles.tagsContainer}>
          <TextInput
            style={[styles.tagInput, { backgroundColor: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#000' }]}
            placeholder="Enter a tag..."
            placeholderTextColor={isDark ? '#ccc' : '#666'}
            value={currentTag}
            onChangeText={setCurrentTag}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
            <Text style={styles.addTagButtonText}>Add Tag</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagsList}>
          {tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: isDark ? '#444' : '#e1f5fe' }]}>
              <Text style={[styles.tagText, { color: isDark ? '#fff' : '#000' }]}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Text style={styles.removeTagText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addChip}>
          <Text style={styles.addButtonText}>Add Chip</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.storyCard, { backgroundColor: isDark ? '#333' : '#fff' }]}>
        <View style={styles.storyHeader}>
          <Text style={[styles.storyTitle, { color: isDark ? '#fff' : '#000' }]}>Today&apos;s Story to Remember</Text>
          <TouchableOpacity onPress={toggleExplanation} style={styles.bulbButton}>
            <Text style={styles.bulbText}>💡</Text>
          </TouchableOpacity>
        </View>
        <Picker
          selectedValue={selectedStory}
          onValueChange={(itemValue: string) => {
            setSelectedStory(itemValue);
            fetchStoryContent(parseInt(itemValue));
          }}
          style={[styles.picker, { color: isDark ? '#fff' : '#000' }]}
        >
          {storyOptions.map((story) => (
            <Picker.Item key={story.id} label={story.title} value={story.id.toString()} />
          ))}
        </Picker>
        <MarkdownViewer content={storyContent} />
        {stories.length > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity onPress={prevPage} disabled={currentPage === 0} style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}>
              <Text style={styles.pageButtonText}>Prev</Text>
            </TouchableOpacity>
            <Text style={[styles.pageIndicator, { color: isDark ? '#fff' : '#000' }]}>
              {currentPage + 1} / {stories.length}
            </Text>
            <TouchableOpacity onPress={nextPage} disabled={currentPage === stories.length - 1} style={[styles.pageButton, currentPage === stories.length - 1 && styles.disabledButton]}>
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={[styles.storyNote, { color: isDark ? '#ccc' : '#666' }]}>
          This presents to you the concepts you learnt like a story that you can remember and never forget.
        </Text>
      </View>

      <FlatList
        data={chips}
        renderItem={renderChip}
        keyExtractor={(item: any) => item.id?.toString()}
        style={styles.chipsList}
        scrollEnabled={false}
      />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  dashboardButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  addTagButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addTagButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#e1f5fe',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    marginRight: 5,
  },
  removeTagText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chipsList: {
    flex: 1,
  },
  chip: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipContent: {
    flex: 1,
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
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chipTags: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  storyCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  storyNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addStoryButton: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addStoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bulbButton: {
    padding: 5,
  },
  bulbText: {
    fontSize: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});