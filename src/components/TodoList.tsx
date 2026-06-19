import React, { useState } from "react";
import { TodoItem } from "../types";
import { Plus, Trash2, Check, X, Edit2 } from "lucide-react";
import { cn } from "../utils/cn";
import { format } from "date-fns";

interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, text: string) => void;
}

export default function TodoList({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
}: TodoListProps) {
  const [newTaskText, setNewTaskText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTodo(newTaskText.trim());
      setNewTaskText("");
    }
  };

  const startEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onUpdateTodo(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditText("");
    }
  };

  // Sort todos: incomplete first, then by creation date (newest first)
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt - a.createdAt;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleAdd} className="relative">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-shadow"
          />
          <button
            type="submit"
            disabled={!newTaskText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-50 transition-colors"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-8 text-sm text-zinc-500">
            No tasks yet. Add one above!
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                "group flex flex-col gap-1 p-3 rounded-lg transition-colors border",
                todo.completed
                  ? "bg-zinc-50 dark:bg-zinc-900/50 border-transparent opacity-75"
                  : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className={cn(
                    "mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                    todo.completed
                      ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100 text-white dark:text-zinc-900"
                      : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500"
                  )}
                >
                  {todo.completed && <Check size={12} strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEdit}
                        autoFocus
                        className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-500"
                      />
                    </div>
                  ) : (
                    <span
                      className={cn(
                        "text-sm block break-words",
                        todo.completed && "line-through text-zinc-500 dark:text-zinc-400"
                      )}
                    >
                      {todo.text}
                    </span>
                  )}
                  <div className="text-[10px] text-zinc-400 mt-1">
                    {format(todo.createdAt, "MMM d, h:mm a")}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  {!todo.completed && editingId !== todo.id && (
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Edit task"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
