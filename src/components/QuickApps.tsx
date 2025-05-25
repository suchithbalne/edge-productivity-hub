
import React from 'react';
import { Mail, Calendar, Cloud, FileText, Video, Presentation } from 'lucide-react';

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

const QuickApps = () => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-primary">Quick Apps</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Google Workspace</h4>
          <div className="grid grid-cols-3 gap-2">
            {googleApps.map((app) => {
              const IconComponent = app.icon;
              return (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-3 rounded-lg bg-white/5 transition-all hover-scale ${app.color} group`}
                >
                  <IconComponent className="w-5 h-5 mb-1 group-hover:text-white transition-colors" />
                  <span className="text-xs group-hover:text-white transition-colors">{app.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Microsoft 365</h4>
          <div className="grid grid-cols-3 gap-2">
            {microsoftApps.map((app) => {
              const IconComponent = app.icon;
              return (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-3 rounded-lg bg-white/5 transition-all hover-scale ${app.color} group`}
                >
                  <IconComponent className="w-5 h-5 mb-1 group-hover:text-white transition-colors" />
                  <span className="text-xs group-hover:text-white transition-colors">{app.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickApps;
