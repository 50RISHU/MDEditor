import React, { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import { loadData, saveData } from "./utils/storage";
import { Note } from "./types";
import {
  Menu,
  Plus,
  Trash2,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Edit3,
  Columns,
  Download,
  Upload,
  Moon,
  Sun,
  SquarePen,
  Search,
} from "lucide-react";
import { cn } from "./utils/cn";
import { format } from "date-fns";

/**
 * Main App Component - Markdown Note Editor
 * Manages notes, theme, search, and responsive layout
 */
export default function App() {
  // State management
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [desktopViewMode, setDesktopViewMode] = useState<"edit" | "read" | "both">("both");
  const [isSidebarVisibleDesktop, setIsSidebarVisibleDesktop] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Downloads active note as markdown file
  const handleExport = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "note"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Imports markdown files and creates new notes from them
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newNote: Note = {
          id: uuidv4(),
          title: file.name.replace(".md", ""),
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setNotes((prev) => [newNote, ...prev]);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Load saved notes and theme on mount
  useEffect(() => {
    const data = loadData();
    setNotes(data.notes);
    setActiveNoteId(data.activeNoteId);

    const savedTheme = localStorage.getItem("notes-theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Apply theme to DOM and save to localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("notes-theme", theme);
  }, [theme]);

  // Auto-save with 500ms debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveData({ notes, activeNoteId });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [notes, activeNoteId]);

  // Get current active note
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  // Select a note and close mobile sidebar
  const handleSelectNote = useCallback((id: string | null) => {
    setActiveNoteId(id);
    setIsSidebarOpen(false);
  }, []);

  // Create new blank note with default template
  const handleCreateNote = useCallback(() => {
    const newNote: Note = {
      id: uuidv4(),
      title: "Untitled Note",
      content: "# Untitled Note\n\nStart typing here...",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setIsSidebarOpen(false);
    setMobileTab("edit");
  }, []);

  // Update note content and timestamp
  const handleUpdateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note,
      ),
    );
  }, []);

  // Delete note and deselect if active
  const handleDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    },
    [activeNoteId],
  );

  // Keyboard shortcuts: Ctrl+N (new), Ctrl+S (save), Ctrl+D (delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            handleCreateNote();
            break;
          case "s":
            e.preventDefault();
            saveData({ notes, activeNoteId });
            break;
          case "d":
            e.preventDefault();
            if (activeNoteId) {
              handleDeleteNote(activeNoteId);
            }
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notes, activeNoteId, handleDeleteNote]);

  // Toggle between light and dark theme
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarVisibleDesktop ? "md:translate-x-0 md:flex" : "md:hidden",
        )}
      >
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          onExport={handleExport}
          onImportClick={() => fileInputRef.current?.click()}
        />
      </div>

      {/* Narrow Sidebar (Desktop when main sidebar hidden) */}
      {!isSidebarVisibleDesktop && (
        <div className="hidden md:flex flex-col items-center py-4 gap-6 w-16 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 h-full flex-shrink-0">
          <button
            onClick={() => setIsSidebarVisibleDesktop(true)}
            className="p-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
            title="Show Sidebar"
          >
            <PanelLeftOpen size={20} />
          </button>

          <div className="flex flex-col items-center gap-4 mt-2">
            <button
              onClick={handleCreateNote}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="New Note"
            >
              <SquarePen size={20} />
            </button>
            <button
              onClick={() => setIsSidebarVisibleDesktop(true)}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => handleSelectNote(null)}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Home"
            >
              <Home size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={handleExport}
              disabled={!activeNote}
              className={cn(
                "p-2 rounded-lg transition-colors",
                activeNote
                  ? "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  : "text-zinc-300 dark:text-zinc-700 cursor-not-allowed",
              )}
              title={activeNote ? "Export Note" : "Open a note to export"}
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              title="Import Notes"
            >
              <Upload size={20} />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Menu size={20} />
            </button>
            {activeNote && (
              <button
                onClick={() => handleSelectNote(null)}
                className="p-2 -ml-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                title="Home"
              >
                <Home size={20} />
              </button>
            )}
            {!activeNote && <span className="font-semibold">My Notes</span>}
          </div>

          {activeNote && (
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1">
                <button
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-all",
                    mobileTab === "edit"
                      ? "bg-white dark:bg-zinc-950 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                  onClick={() => setMobileTab("edit")}
                >
                  Edit
                </button>
                <button
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-all",
                    mobileTab === "preview"
                      ? "bg-white dark:bg-zinc-950 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                  onClick={() => setMobileTab("preview")}
                >
                  Preview
                </button>
              </div>
              <button
                onClick={() => handleDeleteNote(activeNote.id)}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Delete note"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            {isSidebarVisibleDesktop && (
              <button
                onClick={() => setIsSidebarVisibleDesktop(false)}
                className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                title="Hide Sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            )}
          </div>
          {activeNote && (
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
              <button
                onClick={() => setDesktopViewMode("edit")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-all",
                  desktopViewMode === "edit"
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                )}
              >
                <Edit3 size={14} /> Edit
              </button>
              <button
                onClick={() => setDesktopViewMode("both")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-all",
                  desktopViewMode === "both"
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                )}
              >
                <Columns size={14} /> Both
              </button>
              <button
                onClick={() => setDesktopViewMode("read")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-all",
                  desktopViewMode === "read"
                    ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
                )}
              >
                <BookOpen size={14} /> Read
              </button>
            </div>
          )}
          <div className="w-8"></div> {/* Spacer for balance */}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-row min-h-0 relative">
          {activeNote ? (
            <>
              <div
                className={cn(
                  "flex-col min-w-0 border-r border-zinc-200 dark:border-zinc-800 h-full",
                  mobileTab === "edit" ? "flex flex-1" : "hidden",
                  desktopViewMode === "edit" || desktopViewMode === "both"
                    ? "md:flex md:flex-1"
                    : "md:hidden",
                )}
              >
                <Editor note={activeNote} onUpdate={handleUpdateNote} />
              </div>
              <div
                className={cn(
                  "flex-col min-w-0 bg-zinc-50 dark:bg-zinc-900/50 h-full",
                  mobileTab === "preview" ? "flex flex-1" : "hidden",
                  desktopViewMode === "read" || desktopViewMode === "both"
                    ? "md:flex md:flex-1"
                    : "md:hidden",
                )}
              >
                <Preview note={activeNote} />
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 hidden md:block">
                  All Notes
                </h1>
                {notes.length === 0 ? (
                  <div className="text-center py-20 text-zinc-500">
                    <div className="text-4xl mb-4">📝</div>
                    <h2 className="text-xl font-medium mb-2">No Notes Yet</h2>
                    <p>Create your first note to get started.</p>
                    <p className="hidden md:block text-sm mt-4 opacity-70">
                      Ctrl + N to create
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => handleSelectNote(note.id)}
                        className="bg-white dark:bg-zinc-950 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-48 group"
                      >
                        <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {note.title || "Untitled Note"}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm flex-1 overflow-hidden line-clamp-4">
                          {note.content.replace(/[#*`_]/g, "") || "Empty note"}
                        </p>
                        <div className="mt-4 text-xs text-zinc-400 font-medium">
                          {format(note.updatedAt, "MMM d, yyyy")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAB for mobile */}
          {!activeNote && (
            <button
              onClick={handleCreateNote}
              className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30"
            >
              <Plus size={24} />
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".md"
          multiple
          className="hidden"
        />
      </main>
    </div>
  );
}
