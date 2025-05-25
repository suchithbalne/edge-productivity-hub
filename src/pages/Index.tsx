
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
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

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Edge Productivity Hub
          </h1>
          <p className="text-muted-foreground">
            Your personalized dashboard for maximum productivity
          </p>
        </div>
        <Button
          onClick={() => setIsSettingsOpen(true)}
          variant="outline"
          size="sm"
          className="hover-scale"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Clock & Greeting - spans 2 columns on larger screens */}
        <div className="md:col-span-2">
          <ClockWidget />
        </div>

        {/* Todo Widget */}
        <div className="lg:col-span-1">
          <TodoWidget />
        </div>

        {/* Search Engines */}
        <div className="lg:col-span-1">
          <SearchEngines />
        </div>

        {/* AI Tools */}
        <div className="md:col-span-1">
          <AITools />
        </div>

        {/* Social Networking */}
        <div className="md:col-span-1">
          <SocialNetworking />
        </div>

        {/* Quick Apps */}
        <div className="md:col-span-1">
          <QuickApps />
        </div>

        {/* Bookmarks */}
        <div className="md:col-span-1">
          <BookmarksWidget />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-6 right-6 space-y-3">
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
