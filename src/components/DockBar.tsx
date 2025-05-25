import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import icons
import { Youtube, Linkedin, Music, MessageCircle } from 'lucide-react';

interface DockIconProps {
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
}

const DockIcon: React.FC<DockIconProps> = ({ icon, label, url, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="flex flex-col items-center justify-center mx-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center w-12 h-12 rounded-full ${color} text-white shadow-lg`}
        initial={{ y: 0 }}
        animate={{ y: isHovered ? -10 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.a>
      
      {isHovered && (
        <motion.div 
          className="absolute -bottom-8 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.div>
      )}
    </motion.div>
  );
};

const DockBar: React.FC = () => {
  const dockItems = [
    { 
      icon: <MessageCircle size={24} />, 
      label: "WhatsApp", 
      url: "https://web.whatsapp.com/", 
      color: "bg-green-500 hover:bg-green-600" 
    },
    { 
      icon: <Youtube size={24} />, 
      label: "YouTube", 
      url: "https://youtube.com/", 
      color: "bg-red-500 hover:bg-red-600" 
    },
    { 
      icon: <Linkedin size={24} />, 
      label: "LinkedIn", 
      url: "https://linkedin.com/", 
      color: "bg-blue-600 hover:bg-blue-700" 
    },
    { 
      icon: <Music size={24} />, 
      label: "Spotify", 
      url: "https://open.spotify.com/", 
      color: "bg-green-600 hover:bg-green-700" 
    }
  ];

  return (
    <motion.div 
      className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-center px-4 py-2 bg-black/20 backdrop-blur-lg rounded-full shadow-xl">
        {dockItems.map((item, index) => (
          <DockIcon 
            key={index}
            icon={item.icon}
            label={item.label}
            url={item.url}
            color={item.color}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DockBar;
