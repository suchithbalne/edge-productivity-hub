
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const socialPlatforms = [
  { name: 'Facebook', url: 'https://facebook.com', icon: Facebook, color: 'hover:bg-blue-600' },
  { name: 'Instagram', url: 'https://instagram.com', icon: Instagram, color: 'hover:bg-pink-600' },
  { name: 'Twitter', url: 'https://twitter.com', icon: Twitter, color: 'hover:bg-blue-400' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin, color: 'hover:bg-blue-700' },
  { name: 'YouTube', url: 'https://youtube.com', icon: Youtube, color: 'hover:bg-red-600' },
  { name: 'GitHub', url: 'https://github.com', icon: Github, color: 'hover:bg-gray-700' }
];

interface SocialNetworkingProps {
  onClose?: () => void;
}

const SocialNetworking = ({ onClose }: SocialNetworkingProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Social & Professional</h3>
        {onClose && (
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {socialPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center p-4 rounded-lg bg-white/5 transition-all hover-scale ${platform.color} group`}
            >
              <IconComponent className="w-6 h-6 mb-2 group-hover:text-white transition-colors" />
              <span className="text-xs text-center group-hover:text-white transition-colors">
                {platform.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialNetworking;
