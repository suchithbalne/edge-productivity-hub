import React, { useState } from 'react';
import { Mail, Calendar, Cloud, FileText, Video, Presentation, LayoutGrid, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";

const googleApps = [
  { name: 'Gmail', url: 'https://gmail.com', icon: Mail, color: 'hover:bg-red-600' },
  { name: 'Calendar', url: 'https://calendar.google.com', icon: Calendar, color: 'hover:bg-blue-600' },
  { name: 'Drive', url: 'https://drive.google.com', icon: Cloud, color: 'hover:bg-yellow-600' }
];

const microsoftApps = [
  { name: 'Outlook', url: 'https://outlook.live.com', icon: Mail, color: 'hover:bg-blue-700' },
  { name: 'Word', url: 'https://office.live.com/start/Word.aspx', icon: FileText, color: 'hover:bg-blue-800' },
  { name: 'Teams', url: 'https://teams.microsoft.com', icon: Video, color: 'hover:bg-purple-600' }
];

interface WorkspaceButtonsProps {
  type: 'google' | 'microsoft';
}

const WorkspaceButtons = ({ type }: WorkspaceButtonsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const apps = type === 'google' ? googleApps : microsoftApps;
  const icon = type === 'google' ? LayoutGrid : Briefcase;
  const title = type === 'google' ? 'Google' : 'Microsoft';
  
  return (
    <div className="relative">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        size="sm"
        className="glass-card hover-scale absolute right-0"
      >
        {React.createElement(icon, { className: "w-3 h-3 mr-1" })}
        <span className="text-xs">{title}</span>
      </Button>

      {isExpanded && (
        <div className="fixed right-24 top-1/2 transform -translate-y-1/2 animate-fade-in z-50">
          <div className="glass-card p-2 rounded-lg flex flex-col space-y-1">
            {apps.map((app) => {
              const IconComponent = app.icon;
              return (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={app.name}
                  className={`p-1.5 rounded-md bg-white/5 transition-all hover-scale ${app.color} group flex items-center`}
                >
                  <IconComponent className="w-3 h-3 group-hover:text-white transition-colors" />
                  <span className="ml-2 text-[10px] group-hover:text-white transition-colors">{app.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceButtons;
