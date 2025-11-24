const API_BASE = 'http://192.168.31.42:8001'; // Change to your backend IP

export interface Chip {
  id?: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  storyid: number;
  story_driving_prompt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StoryCraft {
  storyid: number;
  story_title: string;
  chief_plot: string;
  story_summary?: string;
}

export interface Story {
  id: number;
  storyid: number;
  story_content: string;
  story_driving_prompt?: string;
  explanation: string;
  created_time: string;
}

export const chipsApi = {
  // Fetch all chips
  fetchChips: async (): Promise<Chip[]> => {
    try {
      const response = await fetch(`${API_BASE}/chips`);
      if (!response.ok) throw new Error('Failed to fetch chips');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chips:', error);
      throw error;
    }
  },

  // Fetch app title
  fetchTitle: async (): Promise<{ title: string }> => {
    try {
      const response = await fetch(`${API_BASE}/title`);
      if (!response.ok) throw new Error('Failed to fetch title');
      return await response.json();
    } catch (error) {
      console.error('Error fetching title:', error);
      throw error;
    }
  },

  // Fetch all stories
  fetchStoryCrafts: async (): Promise<StoryCraft[]> => {
    try {
      const response = await fetch(`${API_BASE}/storycraft`);
      if (!response.ok) throw new Error('Failed to fetch stories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  },

  // Fetch a single story by ID
  fetchStory: async (storyId: number): Promise<Story[]> => {
    try {
      const response = await fetch(`${API_BASE}/stories/${storyId}`);
      if (!response.ok) throw new Error('Failed to fetch story');
      return await response.json();
    } catch (error) {
      console.error('Error fetching story:', error);
      throw error;
    }
  },

  // Add a new chip
  addChip: async (chip: Omit<Chip, 'id' | 'created_at' | 'updated_at'>): Promise<Chip> => {
    try {
      const response = await fetch(`${API_BASE}/chips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chip),
      });
      if (!response.ok) throw new Error('Failed to add chip');
      return await response.json();
    } catch (error) {
      console.error('Error adding chip:', error);
      throw error;
    }
  },

  // Delete a chip
  deleteChip: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/chips/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete chip');
    } catch (error) {
      console.error('Error deleting chip:', error);
      throw error;
    }
  },

  // Future: Add update, search, etc.
  // updateChip: async (id: number, updates: Partial<Chip>): Promise<Chip> => { ... }
  // searchChips: async (query: string): Promise<Chip[]> => { ... }
  createStoryCraft: async (story: { story_title: string; chief_plot: string; story_summary?: string }): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE}/storycraft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story),
      });
      if (!response.ok) throw new Error('Failed to create story');
      return await response.json();
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  // Generate a story
  generateStoryCraft: async (): Promise<{ story_title: string; chief_plot: string; story_summary?: string }> => {
    try {
      const response = await fetch(`${API_BASE}/storycraft/generate`, {
        method: 'POST', // Assuming POST, adjust if GET
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to generate story');
      return await response.json();
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  },
};