
import React, { useState, useEffect } from 'react';
import { Settings, CheckSquare, Bookmark, Brain, Users, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClockWidget from "@/components/ClockWidget";
import TodoWidget from "@/components/TodoWidget";
import SearchEngines from "@/components/SearchEngines";
import SocialNetworking from "@/components/SocialNetworking";
import AITools from "@/components/AITools";
import GoogleWorkspace from "@/components/GoogleWorkspace";
import MicrosoftOffice from "@/components/MicrosoftOffice";
import BookmarksWidget from "@/components/BookmarksWidget";
import SettingsPanel from "@/components/SettingsPanel";

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
  const [showGoogleWorkspace, setShowGoogleWorkspace] = useState(false);
  const [showMicrosoftOffice, setShowMicrosoftOffice] = useState(false);

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
      {/* Top Right - Settings and other buttons */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-2">
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="outline"
          size="sm"
          className="hover-scale glass-card h-8 w-8 p-0"
        >
          <Settings className="w-3 h-3" />
        </Button>
        
        {/* Social Button */}
        {!showSocial ? (
          <Button
            onClick={() => setShowSocial(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale h-8 w-8 p-0"
          >
            <Users className="w-3 h-3" />
          </Button>
        ) : null}
        
        {/* Google Workspace Button */}
        {!showGoogleWorkspace ? (
          <Button
            onClick={() => setShowGoogleWorkspace(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale h-8 w-8 p-0"
          >
            <Globe className="w-3 h-3" />
          </Button>
        ) : null}
        
        {/* Microsoft Office Button */}
        {!showMicrosoftOffice ? (
          <Button
            onClick={() => setShowMicrosoftOffice(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale h-8 w-8 p-0"
          >
            <FileText className="w-3 h-3" />
          </Button>
        ) : null}
      </div>

      {/* Center - Clock and Search */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="mb-8">
          <ClockWidget />
        </div>
        <div className="w-80">
          <SearchEngines />
        </div>
      </div>

      {/* Top Left - Quick Tasks */}
      <div className="absolute top-6 left-6">
        {!showTodos ? (
          <Button
            onClick={() => setShowTodos(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale h-8 w-8 p-0"
          >
            <CheckSquare className="w-3 h-3" />
          </Button>
        ) : (
          <div className="w-72 animate-fade-in">
            <TodoWidget onClose={() => setShowTodos(false)} />
          </div>
        )}
      </div>

      {/* Top Right - Bookmarks */}
      <div className="absolute top-6 right-20">
        {!showBookmarks ? (
          <Button
            onClick={() => setShowBookmarks(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale h-8 w-8 p-0"
          >
            <Bookmark className="w-3 h-3" />
          </Button>
        ) : (
          <div className="w-72 animate-fade-in">
            <BookmarksWidget onClose={() => setShowBookmarks(false)} />
          </div>
        )}
      </div>

      {/* Bottom Left - AI Tools */}
      <div className="absolute bottom-6 left-6">
        {!showAITools ? (
          <Button
            onClick={() => setShowAITools(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale h-8 w-8 p-0"
          >
            <Brain className="w-3 h-3" />
          </Button>
        ) : (
          <div className="w-60 animate-fade-in">
            <AITools onClose={() => setShowAITools(false)} />
          </div>
        )}
      </div>

      {/* Right Side Expanded Panels */}
      {showSocial && (
        <div className="absolute top-20 right-6 w-60 animate-fade-in">
          <SocialNetworking onClose={() => setShowSocial(false)} />
        </div>
      )}

      {showGoogleWorkspace && (
        <div className="absolute top-32 right-6 w-52 animate-fade-in">
          <GoogleWorkspace onClose={() => setShowGoogleWorkspace(false)} />
        </div>
      )}

      {showMicrosoftOffice && (
        <div className="absolute top-44 right-6 w-52 animate-fade-in">
          <MicrosoftOffice onClose={() => setShowMicrosoftOffice(false)} />
        </div>
      )}

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
