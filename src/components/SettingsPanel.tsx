
import React, { useState } from 'react';
import { Settings, X, Palette, Layout, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [userName, setUserName] = useState(() => 
    localStorage.getItem('edge-homepage-username') || 'User'
  );
  const [compactMode, setCompactMode] = useState(() => 
    localStorage.getItem('edge-homepage-compact') === 'true'
  );

  const saveUserName = () => {
    localStorage.setItem('edge-homepage-username', userName);
  };

  const toggleCompactMode = (enabled: boolean) => {
    setCompactMode(enabled);
    localStorage.setItem('edge-homepage-compact', enabled.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </h2>
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <User className="w-4 h-4 mr-2" />
              Display Name
            </label>
            <div className="flex gap-2">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name..."
              />
              <Button onClick={saveUserName} size="sm">Save</Button>
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Layout className="w-4 h-4 mr-2" />
              Layout Options
            </label>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">Compact Mode</span>
              <Switch
                checked={compactMode}
                onCheckedChange={toggleCompactMode}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </label>
            <div className="text-sm text-muted-foreground p-3 bg-white/5 rounded-lg">
              Dark theme is currently active. Light theme coming soon!
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground text-center">
            Edge Productivity Homepage v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
