
import React, { useState } from 'react';
import { Settings, X, Palette, Layout, User, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorThemes = [
  { name: 'Green', primary: '142 86% 28%', accent: '142 76% 36%' },
  { name: 'Blue', primary: '217 91% 60%', accent: '217 81% 70%' },
  { name: 'Purple', primary: '262 83% 58%', accent: '262 73% 68%' },
  { name: 'Orange', primary: '25 95% 53%', accent: '25 85% 63%' },
  { name: 'Pink', primary: '330 81% 60%', accent: '330 71% 70%' },
  { name: 'Red', primary: '0 84% 60%', accent: '0 74% 70%' }
];

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [userName, setUserName] = useState(() => 
    localStorage.getItem('edge-homepage-username') || 'User'
  );
  const [compactMode, setCompactMode] = useState(() => 
    localStorage.getItem('edge-homepage-compact') === 'true'
  );
  const [digitalClock, setDigitalClock] = useState(() => 
    localStorage.getItem('edge-homepage-digital-clock') !== 'false'
  );
  const [selectedTheme, setSelectedTheme] = useState(() => 
    localStorage.getItem('edge-homepage-theme') || 'Green'
  );

  const saveUserName = () => {
    localStorage.setItem('edge-homepage-username', userName);
    // Trigger custom event to update display name
    window.dispatchEvent(new CustomEvent('userNameChanged', { detail: { userName } }));
  };

  const toggleCompactMode = (enabled: boolean) => {
    setCompactMode(enabled);
    localStorage.setItem('edge-homepage-compact', enabled.toString());
  };

  const toggleClockType = (isDigital: boolean) => {
    setDigitalClock(isDigital);
    localStorage.setItem('edge-homepage-digital-clock', isDigital.toString());
    window.dispatchEvent(new CustomEvent('clockTypeChanged', { detail: { isDigital } }));
  };

  const changeTheme = (theme: typeof colorThemes[0]) => {
    setSelectedTheme(theme.name);
    localStorage.setItem('edge-homepage-theme', theme.name);
    
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--ring', theme.primary);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--sidebar-ring', theme.primary);
    
    // Trigger theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-md mx-4 animate-fade-in max-h-[90vh] overflow-y-auto">
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
              <Palette className="w-4 h-4 mr-2" />
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => changeTheme(theme)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.name 
                      ? 'border-primary bg-primary/10' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: `hsl(${theme.primary})` }}
                  />
                  <span className="text-xs">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Clock className="w-4 h-4 mr-2" />
              Clock Type
            </label>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm">Digital Clock</span>
              <Switch
                checked={digitalClock}
                onCheckedChange={toggleClockType}
              />
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
