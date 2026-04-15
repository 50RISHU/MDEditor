/**
 * Editor Component - Markdown editor with formatting toolbar
 * Supports image upload (paste/drag-drop), markdown formatting
 */
import React, { useRef, memo, useCallback } from 'react';
import { Note } from '../types';
import { Bold, Italic, List, ListOrdered, Link, Code, Quote, Image as ImageIcon, Highlighter } from 'lucide-react';

interface EditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

// Memoized toolbar button - prevents unnecessary re-renders
const ToolbarButton = memo(({ icon: Icon, onClick, title }: { icon: any, onClick: () => void, title: string }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
  >
    <Icon size={16} />
  </button>
));

export default function Editor({ note, onUpdate }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update note title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(note.id, { title: e.target.value });
  };

  // Update note content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
  };

  // Insert markdown syntax around selected text
  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    onUpdate(note.id, { content: newText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [note.id, onUpdate]);

  // Convert image to base64 and insert markdown image syntax
  const processImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      // Insert the markdown image syntax with the base64 string
      insertText(`![${file.name}](${base64String})`);
    };
    reader.readAsDataURL(file);
  }, [insertText]);

  // Handle pasted images
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault(); // Prevent default paste behavior
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
        }
      }
    }
  };

  // Handle dropped images
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); // Prevent opening the image in the browser
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.indexOf('image') !== -1) {
        processImageFile(files[i]);
      }
    }
  };

  // Allow dropping on textarea
  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full text-2xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder-zinc-400 dark:placeholder-zinc-600"
        />
      </div>
      
      <div className="flex items-center gap-1 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <ToolbarButton icon={Bold} onClick={() => insertText('**', '**')} title="Bold" />
        <ToolbarButton icon={Italic} onClick={() => insertText('_', '_')} title="Italic" />
        <ToolbarButton icon={Highlighter} onClick={() => insertText('<mark>', '</mark>')} title="Highlight Text" />
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />
        <ToolbarButton icon={List} onClick={() => insertText('- ')} title="Bullet List" />
        <ToolbarButton icon={ListOrdered} onClick={() => insertText('1. ')} title="Numbered List" />
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />
        <ToolbarButton icon={Link} onClick={() => insertText('[', '](url)')} title="Link" />
        <ToolbarButton icon={ImageIcon} onClick={() => insertText('![alt text](', 'image_url)')} title="Image" />
        <ToolbarButton icon={Code} onClick={() => insertText('```\n', '\n```')} title="Code Block" />
        <ToolbarButton icon={Quote} onClick={() => insertText('> ')} title="Quote" />
      </div>

      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={note.content}
          onChange={handleContentChange}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          placeholder="Start writing... (You can paste or drag & drop images here)"
          className="w-full h-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed placeholder-zinc-400 dark:placeholder-zinc-600"
        />
      </div>
    </div>
  );
}