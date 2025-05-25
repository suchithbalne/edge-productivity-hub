
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoWidgetProps {
  onClose?: () => void;
}

const TodoWidget = ({ onClose }: TodoWidgetProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('edge-homepage-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('edge-homepage-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Quick Tasks</h3>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button onClick={addTodo} size="sm" className="px-3">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-primary border-primary text-white'
                  : 'border-muted-foreground hover:border-primary'
              }`}
            >
              {todo.completed && <Check className="w-3 h-3" />}
            </button>
            <span
              className={`flex-1 transition-all ${
                todo.completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No tasks yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoWidget;
