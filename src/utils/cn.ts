/**
 * Utility - Merges CSS class names with Tailwind conflict resolution
 */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine classes and resolve Tailwind conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
