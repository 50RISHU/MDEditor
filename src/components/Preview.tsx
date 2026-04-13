import React from 'react';
import { Note } from '../types';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

interface PreviewProps {
  note: Note;
}

export default function Preview({ note }: PreviewProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Preview</h2>
        <div className="text-xs text-zinc-400">
          {note.content.split(/\s+/).filter(w => w.length > 0).length} words
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto prose prose-zinc dark:prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {note.content}
        </Markdown>
      </div>
    </div>
  );
}
