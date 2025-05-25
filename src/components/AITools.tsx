
import React from 'react';
import { Bot, Brain, MessageSquare, Code, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const aiTools = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: MessageSquare,
    color: 'hover:bg-green-600'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    icon: Bot,
    color: 'hover:bg-orange-600'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    icon: Brain,
    color: 'hover:bg-blue-600'
  },
  {
    name: 'Copilot',
    url: 'https://github.com/features/copilot',
    icon: Code,
    color: 'hover:bg-purple-600'
  }
];

interface AIToolsProps {
  onClose?: () => void;
}

const AITools = ({ onClose }: AIToolsProps) => {
  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-primary flex items-center">
          <Brain className="w-3 h-3 mr-1" />
          AI Tools
        </h3>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost" className="h-6 w-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {aiTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-2 rounded-lg bg-white/5 transition-all hover-scale ${tool.color} group`}
            >
              <IconComponent className="w-4 h-4 mb-1 group-hover:text-white transition-colors" />
              <span className="text-xs font-medium group-hover:text-white transition-colors text-center">
                {tool.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AITools;
