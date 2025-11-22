import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  ScrollView 
} from 'react-native';
import { Link } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const API_BASE = 'http://192.168.31.42:8001'; // Change to your backend IP

export default function ChipLearningScreen() {
  const [chips, setChips] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [appTitle, setAppTitle] = useState('Fetching title...');
  const [selectedStory, setSelectedStory] = useState('The Binge Story');

  const stories: Record<string, { text1: string; text2: string }> = {
    'The Binge Story': {
      text1: 'In the bustling city of Codeville, a young developer named Alex discovered the magic of React Hooks. One day, while building an app, Alex learned about useState, which allowed components to remember values without classes. This was like having a magical notebook that kept track of thoughts.',
      text2: 'As Alex delved deeper, they encountered useEffect, a hook that managed side effects like fetching data from afar. It was as if the app could now listen to the whispers of the internet. With these tools, Alex created interactive experiences that danced with user input, turning static pages into living stories.',
    },
    'The Adventure Tale': {
      text1: 'Embark on a journey through the digital wilderness with our hero, the API Fetcher. Armed with async and await, they ventured into the unknown realms of servers, retrieving treasures of data. Each request was a quest, each response a victory.',
      text2: 'Along the way, they learned about error handling, like shields protecting against unexpected foes. Promises became their loyal companions, ensuring that adventures never ended abruptly. In this tale, every concept is a landmark, every bug a dragon to slay.',
    },
    'The Mystery Novel': {
      text1: 'In the shadowy corridors of Component Castle, a detective named State Inspector unraveled the mysteries of component lifecycles. Props were clues, state was the hidden motive. useEffect was the butler who knew too much.',
      text2: 'As the plot thickened, they discovered the secrets of conditional rendering, where elements appeared and disappeared like ghosts. Event handlers were the triggers, navigation the plot twists. Each chapter revealed a new layer of the React enigma.',
    },
  };

  const fetchChips = async () => {
    try {
      const response = await fetch(`${API_BASE}/chips`);
      const data = await response.json();
      setChips(data);
    } catch (error) {
      console.error('Error fetching chips:', error);
    }
  };

  const fetchTitle = async () => {
    try {
      const response = await fetch(`${API_BASE}/title`);
      const data = await response.json();
      setAppTitle(data.title);
    } catch (error) {
      console.error('Error fetching title:', error);
    }
  };

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
      const response = await fetch(`${API_BASE}/chips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
          category: category,
          tags: tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        setTitle('');
        setDescription('');
        setTags([]);
        fetchChips();
      }
    } catch (error) {
      console.error('Error adding chip:', error);
    }
  };

  const deleteChip = async (id: number) => {
    try {
      await fetch(`${API_BASE}/chips/${id}`, {
        method: 'DELETE',
      });
      fetchChips();
    } catch (error) {
      console.error('Error deleting chip:', error);
    }
  };

  useEffect(() => {
    fetchChips();
    fetchTitle();
  }, []);

  const renderChip = ({ item }: any) => (
    <View style={styles.chip}>
      <View style={styles.chipContent}>
        <Text style={styles.chipText}>{item.title}</Text>
        <Text style={styles.chipDescription}>{item.description}</Text>
        <Text style={styles.chipCategory}>{item.category}</Text>
        <Text style={styles.chipTags}>Tags: {item.tags.join(', ')}</Text>
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
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{appTitle}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter chip title..."
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter description..."
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.categoryInput}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <View style={styles.tagsContainer}>
          <TextInput
            style={styles.tagInput}
            placeholder="Enter a tag..."
            value={currentTag}
            onChangeText={setCurrentTag}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
            <Text style={styles.addTagButtonText}>Add Tag</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagsList}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
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

      <View style={styles.storyCard}>
        <Text style={styles.storyTitle}>Today&apos;s Story to Remember</Text>
        <Picker
          selectedValue={selectedStory}
          onValueChange={(itemValue: string) => setSelectedStory(itemValue)}
          style={styles.picker}
        >
          {Object.keys(stories).map((storyKey) => (
            <Picker.Item key={storyKey} label={storyKey} value={storyKey} />
          ))}
        </Picker>
        <Text style={styles.storyText}>
          {stories[selectedStory].text1}
        </Text>
        <Text style={styles.storyText}>
          {stories[selectedStory].text2}
        </Text>
        <Text style={styles.storyText}>...</Text>
        <Text style={styles.storyNote}>
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
});