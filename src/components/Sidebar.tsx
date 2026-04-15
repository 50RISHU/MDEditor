/**
 * Sidebar Component - Lists notes with search, filters, theme toggle
 * Handles note selection, creation, deletion, and import/export
 */
import React, { useMemo } from "react";
import { Note } from "../types";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Trash2,
  FileDown,
  FileUp,
  Moon,
  Sun,
  Home,
} from "lucide-react";
import { cn } from "../utils/cn";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string | null) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export default function Sidebar({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
  theme,
  toggleTheme,
  onExport,
  onImportClick,
}: SidebarProps) {
  // Filter notes by search query (searches title and content)
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [notes, searchQuery]);

  return (
    <div className="w-64 md:w-80 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 h-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Notes</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectNote(null)}
              className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Home (All Notes)"
            >
              <Home size={16} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={onCreateNote}
              className="p-2 rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
              title="New Note (Ctrl+N)"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-shadow"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-sm text-zinc-500">
            No notes found.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={cn(
                "group flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors",
                activeNoteId === note.id
                  ? "bg-zinc-200 dark:bg-zinc-800"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate pr-4">
                  {note.title || "Untitled Note"}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-all rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
                  title="Delete note (Ctrl+D)"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="truncate max-w-35">
                  {note.content.replace(/[#*`_]/g, "").slice(0, 40) ||
                    "Empty note"}
                </span>
                <span>{format(note.updatedAt, "MMM d")}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-zinc-500">
        <div className="flex gap-2">
          <button
            onClick={onExport}
            disabled={!activeNoteId}
            className={cn(
              "p-2 rounded-md transition-colors",
              activeNoteId
                ? "hover:bg-zinc-200 dark:hover:bg-zinc-800"
                : "opacity-50 cursor-not-allowed",
            )}
            title={
              activeNoteId ? "Export current note" : "Open a note to export"
            }
          >
            <FileDown size={16} />
          </button>
          <button
            onClick={onImportClick}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
            title="Import markdown files"
          >
            <FileUp size={16} />
          </button>
        </div>
        <span className="text-xs">{notes.length} notes</span>
      </div>
    </div>
  );
}
