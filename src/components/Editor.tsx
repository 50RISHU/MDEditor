import React, { useRef } from 'react';
import { Note } from '../types';
import { Bold, Italic, List, ListOrdered, Link, Code, Quote } from 'lucide-react';

interface EditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export default function Editor({ note, onUpdate }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(note.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    onUpdate(note.id, { content: newText });

    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const ToolbarButton = ({ icon: Icon, onClick, title }: { icon: any, onClick: () => void, title: string }) => (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
    >
      <Icon size={16} />
    </button>
  );

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
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />
        <ToolbarButton icon={List} onClick={() => insertText('- ')} title="Bullet List" />
        <ToolbarButton icon={ListOrdered} onClick={() => insertText('1. ')} title="Numbered List" />
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1 shrink-0" />
        <ToolbarButton icon={Link} onClick={() => insertText('[', '](url)')} title="Link" />
        <ToolbarButton icon={Code} onClick={() => insertText('`', '`')} title="Code" />
        <ToolbarButton icon={Quote} onClick={() => insertText('> ')} title="Quote" />
      </div>
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          className="w-full h-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 font-mono text-sm leading-relaxed placeholder-zinc-400 dark:placeholder-zinc-600"
        />
      </div>
    </div>
  );
}
