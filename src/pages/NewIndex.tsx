import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/lib/ThemeContext';
import { Moon, Sun, Settings, Brain, Users, LayoutGrid, Briefcase, Bookmark, X, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ModernClock from '@/components/ModernClock';
import ModernSearch from '@/components/ModernSearch';
import ModernTasks from '@/components/ModernTasks';
import ModernBookmarks from '@/components/ModernBookmarks';
import CustomizableToolPanel from '@/components/CustomizableToolPanel';
import WeatherWidget from '@/components/WeatherWidget';
import SettingsPanel from '@/components/SettingsPanel';
import DockBar from '@/components/DockBar';
import WebsiteAnalytics from '@/components/WebsiteAnalytics';

const NewIndex = () => {
  const [clockStyle, setClockStyle] = useState<'digital' | 'analog'>('digital');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [greeting, setGreeting] = useState('Hello');
  const [userName, setUserName] = useState('User');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => 
    localStorage.getItem('edge-homepage-theme-mode') as 'dark' | 'light' || 'dark'
  );
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(() => 
    localStorage.getItem('edge-homepage-advanced-features') === 'true'
  );

  // Add click handler to close panels when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Get the clicked element
      const target = event.target as HTMLElement;
      
      // Check if the click is outside of any panel
      const isClickInsidePanel = (
        // Check if click is inside a panel or button
        target.closest('.glass-card') || 
        target.closest('.rounded-full') ||
        target.closest('[role="dialog"]')
      );
      
      // If click is outside panels and not on a button, close all panels
      if (!isClickInsidePanel) {
        // Dispatch event to close all tool panels
        window.dispatchEvent(new CustomEvent('expandPanel', { detail: { category: 'none' } }));
        // Close bookmarks panel
        setIsBookmarksOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Load user name from localStorage
    const savedName = localStorage.getItem('edge-homepage-username');
    if (savedName) setUserName(savedName);

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Listen for user name changes from settings
    const handleUserNameChange = (e: CustomEvent) => {
      setUserName(e.detail.userName);
    };

    // Listen for clock type changes from settings
    const handleClockTypeChange = (e: CustomEvent) => {
      setClockStyle(e.detail.isDigital ? 'digital' : 'analog');
    };

    // Listen for theme changes from settings
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme.name === 'Dark' ? 'dark' : 'light');
    };
    
    // Listen for advanced features changes from settings
    const handleAdvancedFeaturesChange = (e: CustomEvent) => {
      setAdvancedFeaturesEnabled(e.detail.enabled);
    };

    window.addEventListener('userNameChanged', handleUserNameChange as EventListener);
    window.addEventListener('clockTypeChanged', handleClockTypeChange as EventListener);
    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    window.addEventListener('advancedFeaturesChanged', handleAdvancedFeaturesChange as EventListener);

    return () => {
      window.removeEventListener('userNameChanged', handleUserNameChange as EventListener);
      window.removeEventListener('clockTypeChanged', handleClockTypeChange as EventListener);
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
      window.removeEventListener('advancedFeaturesChanged', handleAdvancedFeaturesChange as EventListener);
    };
  }, []);

  const toggleClockStyle = () => {
    setClockStyle(prev => prev === 'digital' ? 'analog' : 'digital');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('edge-homepage-theme-mode', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <ThemeProvider>
      <div className={`min-h-screen overflow-hidden relative ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50 text-gray-900'}`}>
        {/* Multiple animated gradient backgrounds - different for dark/light themes */}
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 animate-gradient-x"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-cyan-500/10 to-teal-500/10 animate-gradient-y"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
            
            {/* Secondary accent gradients - dark theme */}
            <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-tr from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
            
            {/* Additional subtle gradients - dark theme */}
            <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-2/3 left-1/4 w-48 h-48 bg-gradient-to-l from-pink-500/5 to-purple-500/5 rounded-full blur-3xl animate-float"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20 animate-gradient-x"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-sky-200/10 via-indigo-200/10 to-emerald-200/10 animate-gradient-y"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/5 via-purple-200/5 to-pink-200/5"></div>
            
            {/* Secondary accent gradients - light theme */}
            <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-bl from-sky-300/5 to-indigo-300/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-gradient-to-tr from-emerald-300/5 to-blue-300/5 rounded-full blur-3xl animate-pulse-slow"></div>
            
            {/* Additional subtle gradients - light theme */}
            <div className="absolute top-2/3 right-1/4 w-48 h-48 bg-gradient-to-r from-amber-300/5 to-rose-300/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-2/3 left-1/4 w-48 h-48 bg-gradient-to-l from-fuchsia-300/5 to-violet-300/5 rounded-full blur-3xl animate-float"></div>
          </>
        )}
        
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          
          {/* Main content container with two columns */}
          <div className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left column - Clock */}
            <div>
              <ModernClock clockStyle={clockStyle} />
            </div>
            
            {/* Right column - Weather */}
            <div>
              <WeatherWidget />
            </div>
          </div>
          
          {/* Search and Greeting row */}
          <div className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Left column - Greeting */}
            <div className="md:col-span-1">
              <div className="glass-card p-6 h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 text-transparent bg-clip-text">Hey, {userName}!</h1>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-primary text-transparent bg-clip-text">{greeting}</h1>
              </div>
            </div>
            
            {/* Right column - Search */}
            <div className="md:col-span-2">
              <ModernSearch />
            </div>
          </div>
          
          {/* Website Analytics */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <WebsiteAnalytics isVisible={advancedFeaturesEnabled} />
          </div>
        </div>
        
        {/* Top left - Tasks */}
        <div className="absolute top-6 left-6">
          <ModernTasks />
        </div>
        
        {/* Bookmarks panel - Only shown when isBookmarksOpen is true */}
        {isBookmarksOpen && (
          <div className="fixed top-12 right-4 z-30">
            <div className="glass-card p-3 rounded-lg backdrop-blur-md animate-fade-in w-72">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-primary flex items-center">
                  <Bookmark className="w-3 h-3 mr-1" />
                  Bookmarks
                </h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsBookmarksOpen(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'google', name: 'Google', url: 'https://google.com' },
                    { id: 'github', name: 'GitHub', url: 'https://github.com' },
                    { id: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com' },
                    { id: 'youtube', name: 'YouTube', url: 'https://youtube.com' },
                    { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com' },
                    { id: 'drive', name: 'Drive', url: 'https://drive.google.com' }
                  ].map((bookmark) => (
                    <a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1.5 rounded-md bg-background/30 hover:bg-background/50 transition-all hover:shadow-sm flex items-center"
                    >
                      <ExternalLink className="w-3 h-3 text-primary" />
                      <span className="text-xs ml-1.5 truncate">{bookmark.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Bookmarks, Settings, and Theme toggle buttons */}
        <div className="fixed top-4 right-4 flex space-x-2 z-20">
          <button
            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Settings Panel */}
        <SettingsPanel 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
        
        {/* Bottom left - AI Tools */}
        <div className="absolute bottom-6 left-6">
          <CustomizableToolPanel 
            category="ai" 
            buttonIcon={Brain} 
            buttonText="AI Tools" 
            position="left"
          />
        </div>
        
        {/* Bottom right - Social */}
        <div className="absolute bottom-6 right-6">
          <CustomizableToolPanel 
            category="social" 
            buttonIcon={Users} 
            buttonText="Social" 
            position="right"
          />
        </div>
        
        {/* Bottom left - Google Workspace (positioned to the right of AI Tools) */}
        <div className="absolute bottom-6 left-36">
          <CustomizableToolPanel 
            category="google" 
            buttonIcon={LayoutGrid} 
            buttonText="Google" 
            position="left"
          />
        </div>
        
        {/* Bottom right - Microsoft (positioned to the left of Social) */}
        <div className="absolute bottom-6 right-36">
          <CustomizableToolPanel 
            category="microsoft" 
            buttonIcon={Briefcase} 
            buttonText="Microsoft" 
            position="right"
          />
        </div>
        
        {/* Dock Bar */}
        <DockBar />
      </div>
    </ThemeProvider>
  );
};

export default NewIndex;
