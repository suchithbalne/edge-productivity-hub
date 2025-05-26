// Background script for Edge Productivity Hub
// This script runs in the background and can access browser APIs

// Listen for messages from the main app
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
