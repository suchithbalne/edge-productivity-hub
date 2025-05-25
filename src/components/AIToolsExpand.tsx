import React, { useState } from 'react';
import { Bot, Brain, MessageSquare, Code } from 'lucide-react';
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

const AIToolsExpand = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        size="sm"
        className="glass-card hover-scale"
      >
        <Brain className="w-3 h-3 mr-1" />
        <span className="text-xs">AI Tools</span>
      </Button>

      {isExpanded && (
        <div className="absolute left-full top-0 ml-2 animate-fade-in">
          <div className="glass-card p-2 rounded-lg flex items-center space-x-2">
            {aiTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${tool.name}: ${tool.description}`}
                  className={`px-3 py-2 rounded-md bg-white/5 transition-all hover-scale ${tool.color} group flex items-center whitespace-nowrap`}
                >
                  <IconComponent className="w-3 h-3 group-hover:text-white transition-colors" />
                  <span className="text-xs ml-2 group-hover:text-white transition-colors">{tool.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIToolsExpand;
