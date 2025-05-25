
import React from 'react';
import { Search } from 'lucide-react';

const searchEngines = [
  {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    color: 'bg-blue-600',
    shortcut: 'G'
  },
  {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    color: 'bg-orange-600',
    shortcut: 'B'
  },
  {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    color: 'bg-red-600',
    shortcut: 'D'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=',
    color: 'bg-red-500',
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
      <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
        <Search className="w-5 h-5 mr-2" />
        Quick Search
      </h3>
      
      <div className="mb-4">
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
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {searchEngines.map((engine) => (
          <button
            key={engine.name}
            onClick={() => handleSearch(engine.url)}
            className={`${engine.color} hover:opacity-80 text-white p-3 rounded-lg transition-all hover-scale flex items-center justify-center space-x-2`}
          >
            <span className="font-medium">{engine.shortcut}</span>
            <span className="text-sm">{engine.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchEngines;
