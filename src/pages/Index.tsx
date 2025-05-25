
import React, { useState, useEffect } from 'react';
import { Settings, CheckSquare, Bookmark, Brain, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClockWidget from "@/components/ClockWidget";
import TodoWidget from "@/components/TodoWidget";
import SearchEngines from "@/components/SearchEngines";
import SocialNetworking from "@/components/SocialNetworking";
import AITools from "@/components/AITools";
import QuickApps from "@/components/QuickApps";
import BookmarksWidget from "@/components/BookmarksWidget";
import SettingsPanel from "@/components/SettingsPanel";
import SocialButtonsExpand from "@/components/SocialButtonsExpand";
import WorkspaceButtons from "@/components/WorkspaceButtons";
import AIToolsExpand from "@/components/AIToolsExpand";

const colorThemes = [
  { name: 'Green', primary: '142 86% 28%', accent: '142 76% 36%' },
  { name: 'Blue', primary: '217 91% 60%', accent: '217 81% 70%' },
  { name: 'Purple', primary: '262 83% 58%', accent: '262 73% 68%' },
  { name: 'Orange', primary: '25 95% 53%', accent: '25 85% 63%' },
  { name: 'Pink', primary: '330 81% 60%', accent: '330 71% 70%' },
  { name: 'Red', primary: '0 84% 60%', accent: '0 74% 70%' }
];

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTodos, setShowTodos] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('edge-homepage-theme') || 'Green';
    const theme = colorThemes.find(t => t.name === savedTheme) || colorThemes[0];
    
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--ring', theme.primary);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--sidebar-ring', theme.primary);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Settings button in original position */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="outline"
          size="sm"
          className="hover-scale glass-card"
        >
          <Settings className="w-3 h-3 mr-1" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
      
      {/* Equidistant buttons across right edge */}
      <div className="fixed right-0 top-0 bottom-0 flex flex-col justify-center items-end z-40">
        <div className="flex flex-col space-y-[30vh]">
          <div className="pr-6">
            <SocialButtonsExpand />
          </div>
          
          <div className="pr-6">
            <WorkspaceButtons type="google" />
          </div>
          
          <div className="pr-6">
            <WorkspaceButtons type="microsoft" />
          </div>
        </div>
      </div>

      {/* Center - Clock and Search */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="mb-8">
          <ClockWidget />
        </div>
        <div className="w-[500px]">
          <SearchEngines />
        </div>
      </div>

      {/* Top Left - Quick Tasks (expandable) - Adjusted positioning */}
      <div className="absolute top-6 left-6">
        {!showTodos ? (
          <Button
            onClick={() => setShowTodos(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale"
          >
            <CheckSquare className="w-3 h-3 mr-1" />
            <span className="text-xs">Tasks</span>
          </Button>
        ) : (
          <div className="w-80 animate-fade-in">
            <TodoWidget onClose={() => setShowTodos(false)} />
          </div>
        )}
      </div>

      {/* Top Right - Bookmarks (expandable) - Increased spacing from settings */}
      <div className="absolute top-6 right-36">
        {!showBookmarks ? (
          <Button
            onClick={() => setShowBookmarks(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale"
          >
            <Bookmark className="w-3 h-3 mr-1" />
            <span className="text-xs">Bookmarks</span>
          </Button>
        ) : (
          <div className="w-80 animate-fade-in">
            <BookmarksWidget onClose={() => setShowBookmarks(false)} />
          </div>
        )}
      </div>

      {/* Bottom Left - AI Tools (expandable horizontally) */}
      <div className="absolute bottom-6 left-6">
        <AIToolsExpand />
      </div>

      {/* Bottom Right - Social & Professional (expandable) */}
      <div className="absolute bottom-6 right-36">
        {!showSocial ? (
          <Button
            onClick={() => setShowSocial(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale"
          >
            <Users className="w-3 h-3 mr-1" />
            <span className="text-xs">Apps</span>
          </Button>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="w-80">
              <SocialNetworking onClose={() => setShowSocial(false)} />
            </div>
            <div className="w-80">
              <QuickApps />
            </div>
          </div>
        )}
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 space-x-3 flex">
        <div className="w-3 h-3 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="w-4 h-4 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
