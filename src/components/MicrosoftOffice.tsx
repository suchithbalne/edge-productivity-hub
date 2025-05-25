
import React from 'react';
import { Mail, FileText, Video, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const microsoftApps = [
  { name: 'Outlook', url: 'https://outlook.live.com', icon: Mail, color: 'hover:bg-blue-700' },
  { name: 'Word', url: 'https://office.live.com/start/Word.aspx', icon: FileText, color: 'hover:bg-blue-800' },
  { name: 'Teams', url: 'https://teams.microsoft.com', icon: Video, color: 'hover:bg-purple-600' }
];

interface MicrosoftOfficeProps {
  onClose?: () => void;
}

const MicrosoftOffice = ({ onClose }: MicrosoftOfficeProps) => {
  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-primary">Microsoft</h3>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost" className="h-6 w-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {microsoftApps.map((app) => {
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

export default MicrosoftOffice;
