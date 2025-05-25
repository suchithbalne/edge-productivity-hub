import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";

const socialPlatforms = [
  { name: 'Facebook', url: 'https://facebook.com', icon: Facebook, color: 'hover:bg-blue-600' },
  { name: 'Instagram', url: 'https://instagram.com', icon: Instagram, color: 'hover:bg-pink-600' },
  { name: 'Twitter', url: 'https://twitter.com', icon: Twitter, color: 'hover:bg-blue-400' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin, color: 'hover:bg-blue-700' },
  { name: 'YouTube', url: 'https://youtube.com', icon: Youtube, color: 'hover:bg-red-600' },
  { name: 'GitHub', url: 'https://github.com', icon: Github, color: 'hover:bg-gray-700' }
];

const SocialButtonsExpand = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        size="sm"
        className="glass-card hover-scale absolute right-0"
      >
        <Users className="w-3 h-3 mr-1" />
        <span className="text-xs">Social</span>
      </Button>

      {isExpanded && (
        <div className="fixed right-24 top-1/2 transform -translate-y-1/2 animate-fade-in z-50">
          <div className="glass-card p-2 rounded-lg flex flex-col space-y-1">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform.name}
                  className={`p-1.5 rounded-md bg-white/5 transition-all hover-scale ${platform.color} group flex items-center`}
                >
                  <IconComponent className="w-3 h-3 group-hover:text-white transition-colors" />
                  <span className="ml-2 text-[10px] group-hover:text-white transition-colors">{platform.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialButtonsExpand;
