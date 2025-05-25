
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
    <div className="glass-card p-4 animate-fade-in">
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
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {searchEngines.map((engine) => {
          const IconComponent = engine.icon;
          return (
            <button
              key={engine.name}
              onClick={() => handleSearch(engine.url)}
              className={`bg-gradient-to-r ${engine.gradient} hover:bg-gradient-to-r hover:${engine.hoverGradient} text-white p-2 rounded-lg transition-all duration-300 hover-scale flex items-center justify-center group shadow-md hover:shadow-lg min-w-[2.5rem] h-10`}
              title={engine.name}
            >
              <IconComponent className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchEngines;
