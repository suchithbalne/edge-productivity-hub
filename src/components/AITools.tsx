
import React from 'react';
import { Bot, Brain, MessageSquare, Code, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const aiTools = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: MessageSquare,
    description: 'AI Chat Assistant',
    color: 'hover:bg-green-600'
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    icon: Bot,
    description: 'Anthropic AI',
    color: 'hover:bg-orange-600'
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com',
    icon: Brain,
    description: 'Google AI',
    color: 'hover:bg-blue-600'
  },
  {
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    icon: Code,
    description: 'AI Coding',
    color: 'hover:bg-purple-600'
  }
];

interface AIToolsProps {
  onClose?: () => void;
}

const AITools = ({ onClose }: AIToolsProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          AI Tools
        </h3>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {aiTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-4 rounded-lg bg-white/5 transition-all hover-scale ${tool.color} group`}
            >
              <IconComponent className="w-5 h-5 mb-1 group-hover:text-white transition-colors" />
              <span className="text-xs font-medium group-hover:text-white transition-colors text-center">
                {tool.name}
              </span>
              <span className="text-[10px] text-muted-foreground group-hover:text-gray-200 transition-colors text-center">
                {tool.description}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default AITools;
