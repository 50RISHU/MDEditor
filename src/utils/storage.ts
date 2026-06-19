/**
 * Storage Utility - Manages localStorage for notes persistence
 */
import { Note, TodoItem } from '../types';


const STORAGE_KEY = 'notes-app-data';

export interface StorageData {
  notes: Note[];
  activeNoteId: string | null;
  todos: TodoItem[];
}


// Load notes and active note state from localStorage
export const loadData = (): StorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse local storage data', e);
    }
  }
  return { notes: [], activeNoteId: null, todos: [] };

};

// Save notes and active note state to localStorage
export const saveData = (data: StorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
