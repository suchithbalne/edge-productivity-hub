
import React from 'react';
import { Search, Globe, Play, Shield } from 'lucide-react';

const searchEngines = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: Globe,
    gradient: 'from-blue-500 to-green-500',
    hoverGradient: 'from-blue-600 to-green-600',
    shortcut: 'G'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: Search,
    gradient: 'from-blue-500 to-cyan-500',
    hoverGradient: 'from-blue-600 to-cyan-600',
    shortcut: 'B'
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: Shield,
    gradient: 'from-orange-500 to-red-500',
    hoverGradient: 'from-orange-600 to-red-600',
    shortcut: 'D'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=',
    icon: Play,
    gradient: 'from-red-500 to-pink-500',
    hoverGradient: 'from-red-600 to-pink-600',
    shortcut: 'Y'
  }
];

const SearchEngines = () => {
  const [query, setQuery] = React.useState('');

  const handleSearch = (engineUrl: string) => {
    if (query.trim()) {
      window.open(engineUrl + encodeURIComponent(query.trim()), '_blank');
      setQuery('');
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4 text-primary flex items-center justify-center">
        <Search className="w-5 h-5 mr-2" />
        Quick Search
      </h3>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchEngines[0].url);
              }
            }}
            placeholder="Search anything..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {searchEngines.map((engine) => {
          const IconComponent = engine.icon;
          return (
            <button
              key={engine.name}
              onClick={() => handleSearch(engine.url)}
              className={`bg-gradient-to-r ${engine.gradient} hover:bg-gradient-to-r hover:${engine.hoverGradient} text-white p-4 rounded-xl transition-all duration-300 hover-scale flex flex-col items-center justify-center space-y-2 group shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="font-medium text-sm">{engine.shortcut}</span>
              </div>
              <span className="text-xs opacity-90 group-hover:opacity-100 transition-opacity">
                {engine.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchEngines;
