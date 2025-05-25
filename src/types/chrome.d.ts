// Type definitions for Chrome extension API
interface Chrome {
  bookmarks: {
    getTree(callback: (results: ChromeBookmarkNode[]) => void): void;
    onCreated: ChromeEvent<(id: string, bookmark: ChromeBookmarkNode) => void>;
    onRemoved: ChromeEvent<(id: string, removeInfo: { parentId: string, index: number, node: ChromeBookmarkNode }) => void>;
    onChanged: ChromeEvent<(id: string, changeInfo: { title?: string, url?: string }) => void>;
    onMoved: ChromeEvent<(id: string, moveInfo: { parentId: string, index: number, oldParentId: string, oldIndex: number }) => void>;
  };
}

interface ChromeEvent<T extends Function> {
  addListener(callback: T): void;
  removeListener(callback: T): void;
}

interface ChromeBookmarkNode {
  id: string;
  title: string;
  url?: string;
  dateAdded?: number;
  children?: ChromeBookmarkNode[];
}

declare var chrome: Chrome;
