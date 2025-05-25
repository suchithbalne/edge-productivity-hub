
import React from 'react';
import { Search, Globe, Shield } from 'lucide-react';

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
    <div className="glass-card p-4 animate-fade-in">
      <h3 className="text-sm font-medium mb-2 text-primary flex items-center justify-center">
        <Search className="w-4 h-4 mr-1" />
        Quick Search
      </h3>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
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
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {searchEngines.map((engine) => {
          const IconComponent = engine.icon;
          return (
            <button
              key={engine.name}
              onClick={() => handleSearch(engine.url)}
              className={`bg-gradient-to-r ${engine.gradient} hover:bg-gradient-to-r hover:${engine.hoverGradient} text-white p-2 rounded-lg transition-all duration-300 hover-scale flex items-center justify-start shadow-md hover:shadow-lg w-full`}
            >
              <IconComponent className="w-3 h-3 mr-1" />
              <span className="text-xs font-medium mr-1">{engine.shortcut}</span>
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
