# Converting to a Browser Extension for History Access

## Why a Browser Extension is Needed

Regular web pages cannot access your browsing history due to browser security restrictions. This is by design to protect your privacy. To implement real website analytics with history access, this application needs to be converted to a browser extension.

## Steps to Convert to a Chrome Extension

1. **Create a manifest.json file**

```json
{
  "manifest_version": 3,
  "name": "Edge Productivity Hub",
  "version": "1.0",
  "description": "A productivity homepage with website analytics",
  "permissions": [
    "history",
    "storage",
    "tabs"
  ],
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

2. **Create a background script (background.js)**

```javascript
// This script runs in the background and can access browser APIs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getHistoryData") {
    // Get history data for the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    chrome.history.search({
      text: '',
      startTime: oneWeekAgo.getTime(),
      maxResults: 1000
    }, (historyItems) => {
      // Process history items
      const domainMap = new Map();
      
      historyItems.forEach(item => {
        try {
          const url = new URL(item.url);
          const domain = url.hostname.replace('www.', '');
          
          if (!domainMap.has(domain)) {
            domainMap.set(domain, {
              visits: 0,
              timeSpent: 0,
              lastVisit: 0
            });
          }
          
          const domainData = domainMap.get(domain);
          domainData.visits += 1;
          
          // Estimate time spent (this is approximate)
          if (domainData.lastVisit > 0) {
            const timeDiff = item.lastVisitTime - domainData.lastVisit;
            if (timeDiff < 30 * 60 * 1000) { // Less than 30 minutes
              domainData.timeSpent += Math.min(timeDiff / 1000, 300); // Cap at 5 minutes
            }
          }
          
          domainData.lastVisit = item.lastVisitTime;
        } catch (e) {
          // Invalid URL, skip
        }
      });
      
      // Convert to our website data format
      const websiteData = [];
      
      domainMap.forEach((data, domain) => {
        websiteData.push({
          url: domain,
          timeSpent: Math.round(data.timeSpent),
          visits: data.visits,
          category: 'neutral' // Default category
        });
      });
      
      sendResponse({ websiteData });
    });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});
```

3. **Update the WebsiteAnalytics.tsx component**

Modify the `requestBrowserData` function to use the Chrome extension messaging API:

```typescript
const requestBrowserData = () => {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ action: "getHistoryData" }, (response) => {
      if (response && response.websiteData) {
        // Merge with existing category data
        const mergedData = response.websiteData.map(site => {
          const existingSite = websiteData.find(s => s.url === site.url);
          return {
            ...site,
            category: existingSite ? existingSite.category : 'neutral',
            limit: existingSite?.limit
          };
        });
        
        setWebsiteData(mergedData);
      }
    });
  } else {
    alert('This feature requires a browser extension with history permissions.');
  }
};
```

4. **Build the React app**

```
npm run build
```

5. **Load the extension in Chrome/Edge**

- Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the build folder of your React app

## Alternative: Use the Web History API

If you prefer not to create a browser extension, you can use the Web History API to track visits to your homepage only:

```javascript
// In WebsiteAnalytics.tsx
useEffect(() => {
  // Record visit to this page
  const now = new Date();
  const todayKey = `visit-${now.toISOString().split('T')[0]}`;
  
  // Get today's visits
  const todayVisits = parseInt(localStorage.getItem(todayKey) || '0');
  localStorage.setItem(todayKey, (todayVisits + 1).toString());
  
  // You can then display this data in your analytics
}, []);
```

This would only track visits to your homepage, not other websites.
