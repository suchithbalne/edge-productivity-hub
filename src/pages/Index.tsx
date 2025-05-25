
import React, { useState } from 'react';
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

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTodos, setShowTodos] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header with Settings - Moved further right to avoid overlap */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="outline"
          size="sm"
          className="hover-scale glass-card"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Center - Clock and Search */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="mb-8">
          <ClockWidget />
        </div>
        <div className="w-96">
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
            <CheckSquare className="w-4 h-4 mr-2" />
            Tasks
          </Button>
        ) : (
          <div className="w-80 animate-fade-in">
            <TodoWidget onClose={() => setShowTodos(false)} />
          </div>
        )}
      </div>

      {/* Top Right - Bookmarks (expandable) - Increased spacing from settings */}
      <div className="absolute top-6 right-24">
        {!showBookmarks ? (
          <Button
            onClick={() => setShowBookmarks(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmarks
          </Button>
        ) : (
          <div className="w-80 animate-fade-in">
            <BookmarksWidget onClose={() => setShowBookmarks(false)} />
          </div>
        )}
      </div>

      {/* Bottom Left - AI Tools (expandable) */}
      <div className="absolute bottom-6 left-6">
        {!showAITools ? (
          <Button
            onClick={() => setShowAITools(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Tools
          </Button>
        ) : (
          <div className="w-80 animate-fade-in">
            <AITools onClose={() => setShowAITools(false)} />
          </div>
        )}
      </div>

      {/* Bottom Right - Social & Professional (expandable) */}
      <div className="absolute bottom-6 right-6">
        {!showSocial ? (
          <Button
            onClick={() => setShowSocial(true)}
            variant="outline"
            size="sm"
            className="glass-card hover-scale"
          >
            <Users className="w-4 h-4 mr-2" />
            Social & Apps
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
