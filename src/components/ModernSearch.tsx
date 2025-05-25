import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Play, Shield, Plus, X, Settings, Mic, MicOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon: React.ElementType;
  shortcut: string;
  color: string;
}

const defaultSearchEngines: SearchEngine[] = [
  {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: Globe,
    shortcut: 'G',
    color: 'from-blue-500 to-green-500'
  },
  {
    id: 'bing',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    icon: Search,
    shortcut: 'B',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    icon: Shield,
    shortcut: 'D',
    color: 'from-orange-500 to-red-500'
  }
];

const ModernSearch = () => {
  const [query, setQuery] = useState('');
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>(() => {
    const saved = localStorage.getItem('edge-homepage-search-engines');
    return saved ? JSON.parse(saved) : defaultSearchEngines;
  });
  const [newEngine, setNewEngine] = useState({
    id: '',
    name: '',
    url: '',
    shortcut: '',
    color: 'from-gray-500 to-gray-700'
  });
  const [isManaging, setIsManaging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
    }
  }, []);

  const handleSearch = (engineUrl: string) => {
    if (query.trim()) {
      window.open(engineUrl + encodeURIComponent(query.trim()), '_blank');
      setQuery('');
    }
  };
  
  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!speechSupported) return;
    
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      // Start listening
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    }
  };

  const addSearchEngine = () => {
    if (newEngine.name && newEngine.url && newEngine.shortcut) {
      const updatedEngines = [...searchEngines, {
        ...newEngine,
        id: newEngine.name.toLowerCase().replace(/\s/g, '-'),
        icon: Globe
      }];
      setSearchEngines(updatedEngines);
      localStorage.setItem('edge-homepage-search-engines', JSON.stringify(updatedEngines));
      setNewEngine({
        id: '',
        name: '',
        url: '',
        shortcut: '',
        color: 'from-gray-500 to-gray-700'
      });
    }
  };

  const removeSearchEngine = (id: string) => {
    const updatedEngines = searchEngines.filter(engine => engine.id !== id);
    setSearchEngines(updatedEngines);
    localStorage.setItem('edge-homepage-search-engines', JSON.stringify(updatedEngines));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-4 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-primary flex items-center">
            <Search className="w-3 h-3 mr-1" />
            Quick Search
          </h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Search Engines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newEngine.name} 
                    onChange={(e) => setNewEngine({...newEngine, name: e.target.value})}
                    placeholder="Google"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Search URL</Label>
                  <Input 
                    id="url" 
                    value={newEngine.url} 
                    onChange={(e) => setNewEngine({...newEngine, url: e.target.value})}
                    placeholder="https://www.google.com/search?q="
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shortcut">Shortcut (1 letter)</Label>
                  <Input 
                    id="shortcut" 
                    value={newEngine.shortcut} 
                    onChange={(e) => setNewEngine({...newEngine, shortcut: e.target.value.substring(0, 1).toUpperCase()})}
                    placeholder="G"
                    maxLength={1}
                  />
                </div>
                <Button onClick={addSearchEngine} className="w-full">Add Search Engine</Button>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Current Search Engines</h4>
                  <div className="space-y-2">
                    {searchEngines.map((engine) => (
                      <div key={engine.id} className="flex items-center justify-between bg-background/50 p-2 rounded-md">
                        <div className="flex items-center">
                          <Globe className="w-3 h-3 mr-2" />
                          <span>{engine.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeSearchEngine(engine.id)}
                          className="h-6 w-6 text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchEngines[0].url);
                }
              }}
              placeholder="Search anything..."
              className="w-full pl-9 pr-10 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground text-sm"
            />
            {speechSupported && (
              <button 
                onClick={toggleSpeechRecognition}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {searchEngines.map((engine) => {
            const IconComponent = engine.icon;
            return (
              <button
                key={engine.id}
                onClick={() => handleSearch(engine.url)}
                className={`bg-gradient-to-r ${engine.color} text-white p-2 rounded-lg transition-all duration-300 hover:shadow-md flex items-center justify-start w-full`}
              >
                <IconComponent className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium mr-1">{engine.shortcut}</span>
                <span className="text-xs opacity-90 transition-opacity">
                  {engine.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernSearch;
