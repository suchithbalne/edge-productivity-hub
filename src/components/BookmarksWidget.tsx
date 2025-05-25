
import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookmarkItem {
  id: string;
  name: string;
  url: string;
}

const BookmarksWidget = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('edge-homepage-bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    } else {
      // Default bookmarks
      setBookmarks([
        { id: '1', name: 'Google', url: 'https://google.com' },
        { id: '2', name: 'GitHub', url: 'https://github.com' },
        { id: '3', name: 'Stack Overflow', url: 'https://stackoverflow.com' }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('edge-homepage-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = () => {
    if (newName.trim() && newUrl.trim()) {
      setBookmarks([...bookmarks, {
        id: Date.now().toString(),
        name: newName.trim(),
        url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`
      }]);
      setNewName('');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary flex items-center">
          <Bookmark className="w-5 h-5 mr-2" />
          Bookmarks
        </h3>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      {isAdding && (
        <div className="mb-4 space-y-2 p-3 bg-white/5 rounded-lg">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Bookmark name..."
            className="text-sm"
          />
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL..."
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={addBookmark} size="sm" className="text-xs">Save</Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="outline" className="text-xs">Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors group"
          >
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{bookmark.name}</span>
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksWidget;
