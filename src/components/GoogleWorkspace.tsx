
import React from 'react';
import { Mail, Calendar, Cloud, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const googleApps = [
  { name: 'Gmail', url: 'https://gmail.com', icon: Mail, color: 'hover:bg-red-600' },
  { name: 'Calendar', url: 'https://calendar.google.com', icon: Calendar, color: 'hover:bg-blue-600' },
  { name: 'Drive', url: 'https://drive.google.com', icon: Cloud, color: 'hover:bg-yellow-600' }
];

interface GoogleWorkspaceProps {
  onClose?: () => void;
}

const GoogleWorkspace = ({ onClose }: GoogleWorkspaceProps) => {
  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-primary">Google</h3>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost" className="h-6 w-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {googleApps.map((app) => {
          const IconComponent = app.icon;
          return (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-2 rounded-lg bg-white/5 transition-all hover-scale ${app.color} group`}
            >
              <IconComponent className="w-4 h-4 mb-1 group-hover:text-white transition-colors" />
              <span className="text-xs group-hover:text-white transition-colors">{app.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GoogleWorkspace;
