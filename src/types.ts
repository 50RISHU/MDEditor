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
