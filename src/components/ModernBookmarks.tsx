import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, X, ExternalLink, Folder, Edit, Check, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BookmarkItem {
  id: string;
  name: string;
  url: string;
  category?: string;
  dateAdded?: number;
}

interface ModernBookmarksProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Chrome bookmark node interface
interface ChromeBookmarkNode {
  id: string;
  title: string;
  url?: string;
  dateAdded?: number;
  children?: ChromeBookmarkNode[];
}

const defaultBookmarks: BookmarkItem[] = [
  { id: 'google', name: 'Google', url: 'https://google.com' },
  { id: 'github', name: 'GitHub', url: 'https://github.com' },
  { id: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com' },
];

const ModernBookmarks: React.FC<ModernBookmarksProps> = ({ isOpen: propIsOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Sync with the prop if provided
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsExpanded(propIsOpen);
    }
  }, [propIsOpen]);
  
  // Call onClose when the panel is closed internally
  useEffect(() => {
    if (!isExpanded && onClose && propIsOpen) {
      onClose();
    }
  }, [isExpanded, onClose, propIsOpen]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('edge-homepage-bookmarks');
    return saved ? JSON.parse(saved) : defaultBookmarks;
  });
  
  const [newBookmark, setNewBookmark] = useState({
    name: '',
    url: '',
    category: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [usingBrowserBookmarks, setUsingBrowserBookmarks] = useState(false);

  const saveBookmarks = (updatedBookmarks: BookmarkItem[]) => {
    setBookmarks(updatedBookmarks);
    localStorage.setItem('edge-homepage-bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Function to fetch bookmarks from Chrome browser API
  const fetchBrowserBookmarks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if Chrome extension API is available
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        // Using Chrome bookmarks API
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          const extractedBookmarks: BookmarkItem[] = [];
          const extractedCategories = new Set<string>();
          
          // Function to recursively process bookmark nodes
          const processNode = (node: ChromeBookmarkNode, parentCategory?: string) => {
            // Skip the root nodes (they're just containers)
            if (node.children) {
              // If this is a folder, use its title as category
              const currentCategory = node.title ? node.title : parentCategory;
              
              if (currentCategory && currentCategory !== 'Bookmarks Bar' && 
                  currentCategory !== 'Other Bookmarks' && currentCategory !== 'Mobile Bookmarks') {
                extractedCategories.add(currentCategory);
              }
              
              // Process all children
              node.children.forEach(child => processNode(child, currentCategory));
            } 
            // If it's a bookmark (has URL)
            else if (node.url) {
              extractedBookmarks.push({
                id: node.id,
                name: node.title,
                url: node.url,
                category: parentCategory !== 'Bookmarks Bar' && 
                          parentCategory !== 'Other Bookmarks' && 
                          parentCategory !== 'Mobile Bookmarks' ? 
                          parentCategory : 'General',
                dateAdded: node.dateAdded
              });
            }
          };
          
          // Start processing from the root
          bookmarkTreeNodes.forEach(node => processNode(node));
          
          // Sort bookmarks by date added (newest first)
          extractedBookmarks.sort((a, b) => {
            if (a.dateAdded && b.dateAdded) {
              return b.dateAdded - a.dateAdded;
            }
            return 0;
          });
          
          setBookmarks(extractedBookmarks);
          setCategories(Array.from(extractedCategories));
          setUsingBrowserBookmarks(true);
          localStorage.setItem('edge-homepage-using-browser-bookmarks', 'true');
        });
      } else {
        // Fallback for when browser API is not available
        throw new Error('Browser bookmarks API not available');
      }
    } catch (err) {
      console.error('Error fetching browser bookmarks:', err);
      setError('Could not access browser bookmarks. Using local bookmarks instead.');
      setUsingBrowserBookmarks(false);
      localStorage.setItem('edge-homepage-using-browser-bookmarks', 'false');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if we should use browser bookmarks on component mount
  useEffect(() => {
    const shouldUseBrowserBookmarks = localStorage.getItem('edge-homepage-using-browser-bookmarks') === 'true';
    if (shouldUseBrowserBookmarks) {
      fetchBrowserBookmarks();
    }
  }, []);
  
  // Setup a listener for bookmark changes if using browser bookmarks
  useEffect(() => {
    if (usingBrowserBookmarks && typeof chrome !== 'undefined' && chrome.bookmarks) {
      const handleBookmarkChange = () => {
        fetchBrowserBookmarks();
      };
      
      // Add listeners for bookmark changes
      chrome.bookmarks.onCreated.addListener(handleBookmarkChange);
      chrome.bookmarks.onRemoved.addListener(handleBookmarkChange);
      chrome.bookmarks.onChanged.addListener(handleBookmarkChange);
      chrome.bookmarks.onMoved.addListener(handleBookmarkChange);
      
      return () => {
        // Remove listeners when component unmounts
        chrome.bookmarks.onCreated.removeListener(handleBookmarkChange);
        chrome.bookmarks.onRemoved.removeListener(handleBookmarkChange);
        chrome.bookmarks.onChanged.removeListener(handleBookmarkChange);
        chrome.bookmarks.onMoved.removeListener(handleBookmarkChange);
      };
    }
  }, [usingBrowserBookmarks]);

  const addBookmark = () => {
    if (newBookmark.name && newBookmark.url) {
      const id = newBookmark.name.toLowerCase().replace(/\s/g, '-');
      const updatedBookmarks = [...bookmarks, {
        id,
        name: newBookmark.name,
        url: newBookmark.url,
        category: newBookmark.category || undefined
      }];
      saveBookmarks(updatedBookmarks);
      setNewBookmark({ name: '', url: '', category: '' });
    }
  };

  const removeBookmark = (id: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    saveBookmarks(updatedBookmarks);
  };

  // Group bookmarks by category
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    const category = bookmark.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(bookmark);
    return acc;
  }, {} as Record<string, BookmarkItem[]>);

  // Only show the button if we're not controlled by props
  const renderButton = propIsOpen === undefined;
  
  return (
    <div className="relative">
      {renderButton && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                size="sm"
                className="glass-card hover-scale"
              >
                <Bookmark className="w-3 h-3 mr-1" />
                <span className="text-xs">Bookmarks</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to expand bookmarks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {isExpanded && (
        <div className={`animate-fade-in z-50 w-72 ${renderButton ? 'absolute right-full top-0 mr-2' : 'fixed top-12 right-4'}`}>
          <div className="glass-card p-3 rounded-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-primary flex items-center">
                <Bookmark className="w-3 h-3 mr-1" />
                Bookmarks
              </h3>
              <div className="flex space-x-1">
                {!usingBrowserBookmarks && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={fetchBrowserBookmarks}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      disabled={usingBrowserBookmarks}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Bookmark</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={newBookmark.name} 
                          onChange={(e) => setNewBookmark({...newBookmark, name: e.target.value})}
                          placeholder="Bookmark Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input 
                          id="url" 
                          value={newBookmark.url} 
                          onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category (optional)</Label>
                        <Input 
                          id="category" 
                          value={newBookmark.category} 
                          onChange={(e) => setNewBookmark({...newBookmark, category: e.target.value})}
                          placeholder="Work, Personal, etc."
                        />
                      </div>
                      <Button onClick={addBookmark} className="w-full">Add Bookmark</Button>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Current Bookmarks</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {bookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="flex items-center justify-between bg-background/50 p-2 rounded-md">
                              <div className="flex items-center">
                                <ExternalLink className="w-3 h-3 mr-2" />
                                <span className="text-xs">{bookmark.name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => removeBookmark(bookmark.id)}
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
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(false)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {Object.entries(groupedBookmarks).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground flex items-center">
                    <Folder className="w-3 h-3 mr-1" />
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((bookmark) => (
                      <a
                        key={bookmark.id}
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 rounded-md bg-background/30 hover:bg-background/50 transition-all hover:shadow-sm flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 text-primary" />
                        <span className="text-xs ml-1.5 truncate">{bookmark.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernBookmarks;
