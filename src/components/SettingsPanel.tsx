
import React, { useState, useEffect } from 'react';
import { Settings, X, Palette, Layout, User, Clock, MapPin, Sun } from 'lucide-react';
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
  const [clock24Hour, setClock24Hour] = useState(() => 
    localStorage.getItem('edge-homepage-24hour-clock') === 'true'
  );
  const [selectedTheme, setSelectedTheme] = useState(() => 
    localStorage.getItem('edge-homepage-theme') || 'Green'
  );
  const [weatherLocation, setWeatherLocation] = useState(() => 
    localStorage.getItem('edge-homepage-weather-location') || ''
  );
  const [useCustomLocation, setUseCustomLocation] = useState(() => 
    localStorage.getItem('edge-homepage-use-custom-location') === 'true'
  );
  const [weatherApiKey, setWeatherApiKey] = useState(() => 
    localStorage.getItem('edge-homepage-weather-api-key') || ''
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
  
  const toggleClockFormat = (is24Hour: boolean) => {
    setClock24Hour(is24Hour);
    localStorage.setItem('edge-homepage-24hour-clock', is24Hour.toString());
    window.dispatchEvent(new CustomEvent('clockFormatChanged', { detail: { is24Hour } }));
  };
  
  const saveWeatherLocation = () => {
    localStorage.setItem('edge-homepage-weather-location', weatherLocation);
    localStorage.setItem('edge-homepage-use-custom-location', useCustomLocation.toString());
    localStorage.setItem('edge-homepage-weather-api-key', weatherApiKey);
    window.dispatchEvent(new CustomEvent('weatherLocationChanged', { 
      detail: { 
        location: weatherLocation,
        useCustomLocation,
        apiKey: weatherApiKey
      } 
    }));
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
              Clock Settings
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Digital Clock</span>
                <Switch
                  checked={digitalClock}
                  onCheckedChange={toggleClockType}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">24-Hour Format</span>
                <Switch
                  checked={clock24Hour}
                  onCheckedChange={toggleClockFormat}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <Sun className="w-4 h-4 mr-2" />
              Weather Settings
            </label>
            <div className="space-y-2">
              <div className="p-3 bg-white/5 rounded-lg space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">OpenWeatherMap API Key</label>
                  <div className="flex items-center">
                    <Input
                      type="password"
                      value={weatherApiKey}
                      onChange={(e) => setWeatherApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenWeatherMap</a>. Without an API key, mock weather data will be used.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-sm">Use Custom Location</span>
                <Switch
                  checked={useCustomLocation}
                  onCheckedChange={setUseCustomLocation}
                />
              </div>
              {useCustomLocation && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <Input
                      value={weatherLocation}
                      onChange={(e) => setWeatherLocation(e.target.value)}
                      placeholder="City name (e.g., New York)"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a city name to get weather for that location.
                  </p>
                </div>
              )}
              
              <Button onClick={saveWeatherLocation} size="sm" className="w-full">
                Save Weather Settings
              </Button>
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
