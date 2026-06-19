/**
 * Type Definitions - Core interfaces for the app
 */

// Note object structure
export interface Note {
  id: string;          // Unique identifier (UUID)
  title: string;       // Note title
  content: string;     // Markdown content
  createdAt: number;   // Timestamp when created
  updatedAt: number;   // Timestamp when last modified
}

// Todo item structure
export interface TodoItem {
  id: string;         // Unique identifier (UUID)
  text: string;       // Task description
  completed: boolean; // Completion state
  createdAt: number;  // Timestamp when created
}
