import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus, X, Check, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface ModernTasksProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ModernTasks: React.FC<ModernTasksProps> = ({ isOpen: propIsOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Listen for dock bar events
  useEffect(() => {
    const handlePanelExpand = (e: CustomEvent) => {
      if (e.detail.category === 'tasks') {
        // Toggle the panel if it's already expanded
        setIsExpanded(prev => !prev);
      } else if (e.detail.category === 'none') {
        // Close the panel when 'none' category is specified
        setIsExpanded(false);
      }
    };

    window.addEventListener('expandPanel', handlePanelExpand as EventListener);
    return () => window.removeEventListener('expandPanel', handlePanelExpand as EventListener);
  }, []);
  
  // Sync with the prop if provided
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsExpanded(propIsOpen);
    }
  }, [propIsOpen]);
  
  // Call onClose when the panel is closed internally
  useEffect(() => {
    if (!isExpanded && onClose && propIsOpen) {
      onClose();
    }
  }, [isExpanded, onClose, propIsOpen]);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('edge-homepage-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('edge-homepage-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        createdAt: Date.now()
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (editingTaskId && editText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTaskId ? { ...task, text: editText.trim() } : task
      ));
      setEditingTaskId(null);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingTaskId(null);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckSquare className="w-5 h-5" />
        </motion.button>
        <span className="text-xs mt-1 dark:text-white/80 text-gray-800">Tasks</span>
      </div>

      {isExpanded && (
        <div className="absolute left-0 top-full mt-2 animate-fade-in z-50 w-72">
          <div className="glass-card p-3 rounded-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-primary flex items-center">
                <CheckSquare className="w-3 h-3 mr-1" />
                Quick Tasks
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new task..."
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={addTask} className="h-8 w-8 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No tasks yet. Add one above!
                </p>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                      task.completed ? 'bg-primary/10' : 'bg-background/30 hover:bg-background/40'
                    }`}
                  >
                    {editingTaskId === task.id ? (
                      <div className="flex items-center flex-1 mr-2">
                        <Input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={handleEditKeyPress}
                          className="h-7 text-xs"
                          autoFocus
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={saveEdit}
                          className="h-6 w-6 ml-1"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center flex-1">
                          <Checkbox 
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mr-2 h-3.5 w-3.5"
                          />
                          <label 
                            htmlFor={`task-${task.id}`}
                            className={`text-xs cursor-pointer ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {task.text}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => startEditing(task)}
                            className="h-6 w-6"
                          >
                            <Edit className="h-2.5 w-2.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteTask(task.id)}
                            className="h-6 w-6 text-destructive"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTasks;
