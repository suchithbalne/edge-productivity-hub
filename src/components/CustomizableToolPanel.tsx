import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, LayoutGrid, Briefcase, Plus, X, Edit, Check, ExternalLink, Mail, HardDrive, Calendar, Image, Map, Youtube, Cloud, FileText, Globe, Twitter, Facebook, Instagram, Linkedin, MessageCircle, MessageSquare, Sparkles, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Tool {
  id: string;
  name: string;
  url: string;
  icon?: React.ElementType;
  category: 'ai' | 'social' | 'google' | 'microsoft';
}

const defaultTools: Record<string, Tool[]> = {
  ai: [
    { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com', icon: Brain, category: 'ai' },
    { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: Sparkles, category: 'ai' },
    { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', icon: Star, category: 'ai' },
    { id: 'copilot', name: 'Copilot', url: 'https://copilot.microsoft.com', icon: Briefcase, category: 'ai' },
    { id: 'midjourney', name: 'Midjourney', url: 'https://www.midjourney.com', icon: Image, category: 'ai' },
  ],
  google: [
    { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', icon: Mail, category: 'google' },
    { id: 'gdrive', name: 'Drive', url: 'https://drive.google.com', icon: HardDrive, category: 'google' },
    { id: 'gcalendar', name: 'Calendar', url: 'https://calendar.google.com', icon: Calendar, category: 'google' },
    { id: 'gphotos', name: 'Photos', url: 'https://photos.google.com', icon: Image, category: 'google' },
    { id: 'gmaps', name: 'Maps', url: 'https://maps.google.com', icon: Map, category: 'google' },
    { id: 'gyoutube', name: 'YouTube', url: 'https://youtube.com', icon: Youtube, category: 'google' },
  ],
  microsoft: [
    { id: 'outlook', name: 'Outlook', url: 'https://outlook.office.com', icon: Mail, category: 'microsoft' },
    { id: 'onedrive', name: 'OneDrive', url: 'https://onedrive.live.com', icon: Cloud, category: 'microsoft' },
    { id: 'office', name: 'Office', url: 'https://www.office.com', icon: FileText, category: 'microsoft' },
    { id: 'teams', name: 'Teams', url: 'https://teams.microsoft.com', icon: Users, category: 'microsoft' },
    { id: 'todo', name: 'To Do', url: 'https://to-do.office.com', icon: Check, category: 'microsoft' },
    { id: 'edge', name: 'Edge', url: 'https://www.microsoft.com/edge', icon: Globe, category: 'microsoft' },
  ],
  social: [
    { id: 'x', name: 'X', url: 'https://x.com', icon: Twitter, category: 'social' },
    { id: 'facebook', name: 'Facebook', url: 'https://facebook.com', icon: Facebook, category: 'social' },
    { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', icon: Instagram, category: 'social' },
    { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin, category: 'social' },
    { id: 'reddit', name: 'Reddit', url: 'https://reddit.com', icon: MessageCircle, category: 'social' },
    { id: 'discord', name: 'Discord', url: 'https://discord.com/app', icon: MessageSquare, category: 'social' },
  ],
};

interface CustomizableToolPanelProps {
  category: 'ai' | 'social' | 'google' | 'microsoft';
  buttonIcon: React.ElementType;
  buttonText: string;
  position: 'left' | 'right';
}

const CustomizableToolPanel: React.FC<CustomizableToolPanelProps> = ({ 
  category, 
  buttonIcon: ButtonIcon, 
  buttonText,
  position
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tools, setTools] = useState<Tool[]>(() => {
    const savedTools = localStorage.getItem(`edge-homepage-${category}-tools`);
    if (savedTools) {
      return JSON.parse(savedTools);
    }
    return defaultTools[category] || [];
  });
  
  const [newTool, setNewTool] = useState({
    name: '',
    url: ''
  });

  // Track the global state of expanded panels
  useEffect(() => {
    if (isExpanded) {
      // Register this panel as expanded in a global event
      const event = new CustomEvent('tool-panel-expanded', { detail: { category, position } });
      window.dispatchEvent(event);
    }
  }, [isExpanded, category, position]);

  // Listen for dock bar clicks to expand this panel
  useEffect(() => {
    const handlePanelExpand = (e: CustomEvent) => {
      if (e.detail.category === category) {
        // Toggle the panel if it's already expanded
        setIsExpanded(prev => !prev);
      } else if (e.detail.category === 'none') {
        // Close all panels when 'none' category is specified
        setIsExpanded(false);
      } else {
        // If another panel is being expanded, collapse this one
        setIsExpanded(false);
      }
    };

    window.addEventListener('expandPanel', handlePanelExpand as EventListener);
    return () => window.removeEventListener('expandPanel', handlePanelExpand as EventListener);
  }, [category]);

  const saveTools = (updatedTools: Tool[]) => {
    setTools(updatedTools);
    localStorage.setItem(`edge-homepage-${category}-tools`, JSON.stringify(updatedTools));
  };

  const addTool = () => {
    if (newTool.name && newTool.url) {
      const id = newTool.name.toLowerCase().replace(/\s/g, '-');
      const updatedTools = [...tools, {
        id,
        name: newTool.name,
        url: newTool.url,
        category
      }];
      saveTools(updatedTools);
      setNewTool({ name: '', url: '' });
    }
  };

  const removeTool = (id: string) => {
    const updatedTools = tools.filter(tool => tool.id !== id);
    saveTools(updatedTools);
  };

  // Get the appropriate color based on category
  const getCategoryColor = () => {
    switch(category) {
      case 'ai': return 'bg-blue-500 hover:bg-blue-600';
      case 'google': return 'bg-red-500 hover:bg-red-600';
      case 'microsoft': return 'bg-blue-600 hover:bg-blue-700';
      case 'social': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-purple-500 hover:bg-purple-600';
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${getCategoryColor()} text-white shadow-lg`}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ButtonIcon className="w-5 h-5" />
        </motion.button>
        <span className="text-xs mt-1 dark:text-white/80 text-gray-800">{buttonText}</span>
      </div>

      {isExpanded && (
        <div className={`absolute ${position === 'left' ? 'left-0' : 'right-0'} bottom-full mb-2 animate-fade-in z-50`} style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <div className="glass-card p-3 rounded-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-primary flex items-center">
                <ButtonIcon className="w-3 h-3 mr-1" />
                {buttonText}
              </h3>
              <div className="flex space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New {buttonText} Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={newTool.name} 
                          onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                          placeholder="Tool Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input 
                          id="url" 
                          value={newTool.url} 
                          onChange={(e) => setNewTool({...newTool, url: e.target.value})}
                          placeholder="https://example.com"
                        />
                      </div>
                      <Button onClick={addTool} className="w-full">Add Link</Button>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Current Links</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {tools.map((tool) => (
                            <div key={tool.id} className="flex items-center justify-between bg-background/50 p-2 rounded-md">
                              <div className="flex items-center">
                                <ExternalLink className="w-3 h-3 mr-2" />
                                <span className="text-xs">{tool.name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeTool(tool.id)}
                                className="h-6 w-6 text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 max-w-xs">
              {tools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={tool.name}
                  className="px-3 py-2 rounded-md bg-background/30 hover:bg-background/50 transition-all hover:shadow-sm flex items-center whitespace-nowrap"
                >
                  <ExternalLink className="w-3 h-3 text-primary" />
                  <span className="text-xs ml-2">{tool.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizableToolPanel;
