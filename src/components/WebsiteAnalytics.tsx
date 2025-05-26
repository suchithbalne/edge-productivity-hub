import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, Clock, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebsiteAnalyticsProps {
  isVisible: boolean;
}

type Category = 'productive' | 'neutral' | 'distracting';

interface WebsiteData {
  url: string;
  timeSpent: number; // in seconds
  category: Category;
  visits: number;
  limit?: number; // daily limit in seconds
}

const WebsiteAnalytics = ({ isVisible }: WebsiteAnalyticsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState('overview');
  const [websiteData, setWebsiteData] = useState<WebsiteData[]>(() => {
    try {
      const saved = localStorage.getItem('edge-homepage-website-data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading website data', e);
    }
    
    // Empty initial data - we'll explain why we can't get real data
    return [] as WebsiteData[];
  });
  
  const [newSite, setNewSite] = useState<{ url: string, category: Category, limit?: number }>({ url: '', category: 'neutral' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  
  // Save website data when it changes
  useEffect(() => {
    localStorage.setItem('edge-homepage-website-data', JSON.stringify(websiteData));
  }, [websiteData]);
  
  // Calculate total time spent by category
  const totalTimeByCategory = {
    productive: websiteData
      .filter(site => site.category === 'productive')
      .reduce((total, site) => total + site.timeSpent, 0),
    neutral: websiteData
      .filter(site => site.category === 'neutral')
      .reduce((total, site) => total + site.timeSpent, 0),
    distracting: websiteData
      .filter(site => site.category === 'distracting')
      .reduce((total, site) => total + site.timeSpent, 0)
  };
  
  const totalTime = totalTimeByCategory.productive + totalTimeByCategory.neutral + totalTimeByCategory.distracting;
  
  // Format time (seconds) to human-readable format
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `${mins}m`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };
  
  // Add new website
  const addWebsite = () => {
    if (!newSite.url) return;
    
    // Clean up URL
    let url = newSite.url;
    if (url.startsWith('http://')) url = url.substring(7);
    if (url.startsWith('https://')) url = url.substring(8);
    if (url.startsWith('www.')) url = url.substring(4);
    
    // Check if site already exists
    if (websiteData.some(site => site.url === url)) {
      alert('This website is already being tracked.');
      return;
    }
    
    const newWebsiteData: WebsiteData = {
      url,
      timeSpent: 0,
      category: newSite.category,
      visits: 0,
      ...(newSite.category === 'distracting' && newSite.limit ? { limit: newSite.limit } : {})
    };
    
    setWebsiteData([...websiteData, newWebsiteData]);
    setNewSite({ url: '', category: 'neutral' });
  };
  
  // Remove website
  const removeWebsite = (url: string) => {
    setWebsiteData(websiteData.filter(site => site.url !== url));
    if (selectedSite === url) setSelectedSite(null);
  };
  
  // Update website category
  const updateCategory = (url: string, category: Category) => {
    setWebsiteData(websiteData.map(site => 
      site.url === url ? { ...site, category } : site
    ));
  };
  
  // Update website limit
  const updateLimit = (url: string, limit: string) => {
    setWebsiteData(websiteData.map(site => 
      site.url === url ? { ...site, limit: limit ? parseInt(limit) : undefined } : site
    ));
  };
  
  // Set daily limit
  const setDailyLimit = (url: string, limit: string) => {
    const limitInSeconds = limit ? parseInt(limit) * 60 : undefined; // Convert minutes to seconds
    setWebsiteData(websiteData.map(site => 
      site.url === url ? { ...site, limit: limitInSeconds } : site
    ));
  };
  
  // Get color for category
  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'productive': return 'bg-green-500';
      case 'neutral': return 'bg-blue-500';
      case 'distracting': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get text color for category
  const getCategoryTextColor = (category: Category) => {
    switch (category) {
      case 'productive': return 'text-green-500';
      case 'neutral': return 'text-blue-500';
      case 'distracting': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  // Function to request browser history data through the extension
  const requestBrowserData = () => {
    // Check if we're in a browser extension context with the necessary APIs
    // @ts-ignore - Chrome extension API types
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        // Show loading state
        setLoading(true);
        
        // Request history data from the background script
        // @ts-ignore - Chrome extension API types
        chrome.runtime.sendMessage({ action: "getHistoryData" }, (response) => {
          // @ts-ignore - Chrome extension API types
          if (chrome.runtime.lastError) {
            // @ts-ignore - Chrome extension API types
            console.error("Error fetching history:", chrome.runtime.lastError);
            // @ts-ignore - Chrome extension API types
            alert(`Error accessing history: ${chrome.runtime.lastError.message}\nMake sure you've granted the history permission.`);
            setLoading(false);
            return;
          }
          
          if (response && response.websiteData) {
            // Merge with existing category and limit data
            const mergedData = response.websiteData.map(site => {
              const existingSite = websiteData.find(s => s.url === site.url);
              return {
                ...site,
                category: existingSite ? existingSite.category : 'neutral',
                limit: existingSite?.limit
              };
            });
            
            setWebsiteData(mergedData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error requesting browser data:", error);
        alert("An error occurred when trying to access browser history. Please check the console for details.");
        setLoading(false);
      }
    } else {
      // Not in an extension context or missing permissions
      alert('This feature requires a browser extension with history permissions. Please make sure you are running this as a browser extension.');
    }
  };
  
  // Reset all data
  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all website analytics data?')) {
      setWebsiteData([]);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="glass-card p-4 mt-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Website Analytics
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={requestBrowserData} disabled={loading}>
            {loading ? 'Loading...' : 'Get Real Data'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'View Analytics' : 'Edit Websites'}
          </Button>
        </div>
      </div>
      
      {websiteData.length === 0 && !editMode && (
        <div className="p-6 bg-white/5 rounded-lg text-center mb-4">
          <h3 className="text-lg font-medium mb-2">No Website Data Available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Due to browser security restrictions, regular web pages cannot access your browsing history.
            To track real website usage, this feature would need to be implemented as a browser extension with the "history" permission.
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setEditMode(true)} variant="default">
              Add Websites Manually
            </Button>
          </div>
        </div>
      )}
      
      {editMode ? (
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Add New Website</h3>
            <div className="flex flex-col space-y-3">
              <div>
                <label className="text-sm font-medium">Website URL</label>
                <Input 
                  value={newSite.url}
                  onChange={(e) => setNewSite({...newSite, url: e.target.value})}
                  placeholder="e.g., github.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Button 
                    variant={newSite.category === 'productive' ? 'default' : 'outline'}
                    onClick={() => setNewSite({...newSite, category: 'productive'})}
                    className={newSite.category === 'productive' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    Productive
                  </Button>
                  <Button 
                    variant={newSite.category === 'neutral' ? 'default' : 'outline'}
                    onClick={() => setNewSite({...newSite, category: 'neutral'})}
                    className={newSite.category === 'neutral' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  >
                    Neutral
                  </Button>
                  <Button 
                    variant={newSite.category === 'distracting' ? 'default' : 'outline'}
                    onClick={() => setNewSite({...newSite, category: 'distracting'})}
                    className={newSite.category === 'distracting' ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    Distracting
                  </Button>
                </div>
              </div>
              {newSite.category === 'distracting' && (
                <div>
                  <label className="text-sm font-medium">Daily Limit (minutes)</label>
                  <Input 
                    type="number"
                    value={newSite.limit}
                    onChange={(e) => setNewSite({...newSite, limit: e.target.value ? parseInt(e.target.value) : undefined})}
                    placeholder="e.g., 30"
                    className="mt-1"
                  />
                </div>
              )}
              <Button onClick={addWebsite} className="w-full">
                Add Website
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Tracked Websites</h3>
            {websiteData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No websites added yet.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {websiteData.map((site) => (
                  <div key={site.url} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="font-medium">{site.url}</div>
                      <div className={`text-xs ${getCategoryTextColor(site.category)}`}>
                        {site.category.charAt(0).toUpperCase() + site.category.slice(1)}
                        {site.limit && ` • Limit: ${formatTime(site.limit)}/day`}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeWebsite(site.url)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {websiteData.length > 0 && (
              <Button variant="destructive" size="sm" onClick={resetAllData} className="mt-4">
                Reset All Data
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="flex items-center">
              <PieChart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Details</span>
            </TabsTrigger>
            <TabsTrigger value="limits" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Limits</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Productive</div>
                <div className="text-2xl font-bold text-green-500">
                  {formatTime(totalTimeByCategory.productive)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalTime > 0 ? Math.round((totalTimeByCategory.productive / totalTime) * 100) : 0}%
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Neutral</div>
                <div className="text-2xl font-bold text-blue-500">
                  {formatTime(totalTimeByCategory.neutral)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalTime > 0 ? Math.round((totalTimeByCategory.neutral / totalTime) * 100) : 0}%
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Distracting</div>
                <div className="text-2xl font-bold text-red-500">
                  {formatTime(totalTimeByCategory.distracting)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalTime > 0 ? Math.round((totalTimeByCategory.distracting / totalTime) * 100) : 0}%
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Time Distribution</h3>
              <div className="h-4 rounded-full overflow-hidden flex">
                {totalTime > 0 ? (
                  <>
                    <div 
                      className="bg-green-500 h-full" 
                      style={{ width: `${(totalTimeByCategory.productive / totalTime) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${(totalTimeByCategory.neutral / totalTime) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-red-500 h-full" 
                      style={{ width: `${(totalTimeByCategory.distracting / totalTime) * 100}%` }}
                    ></div>
                  </>
                ) : (
                  <div className="bg-gray-500 h-full w-full"></div>
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <div>Productive</div>
                <div>Neutral</div>
                <div>Distracting</div>
              </div>
            </div>
            
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Top Websites</h3>
              <div className="space-y-3">
                {websiteData
                  .sort((a, b) => b.timeSpent - a.timeSpent)
                  .slice(0, 5)
                  .map((site) => (
                    <div key={site.url} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(site.category)} mr-2`}></div>
                        <span>{site.url}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{formatTime(site.timeSpent)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {websiteData
                .sort((a, b) => b.timeSpent - a.timeSpent)
                .map((site) => (
                  <div 
                    key={site.url} 
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedSite(selectedSite === site.url ? null : site.url)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(site.category)} mr-2`}></div>
                        <span className="font-medium">{site.url}</span>
                      </div>
                      <div className="text-sm">{formatTime(site.timeSpent)}</div>
                    </div>
                    
                    {selectedSite === site.url && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Visits:</span> {site.visits}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span> {site.category}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg. Time/Visit:</span> {site.visits > 0 ? formatTime(Math.round(site.timeSpent / site.visits)) : '0s'}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Daily Limit:</span> {site.limit ? formatTime(site.limit) : 'None'}
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <Button 
                            size="sm" 
                            variant={site.category === 'productive' ? 'default' : 'outline'}
                            className={site.category === 'productive' ? 'bg-green-500 hover:bg-green-600' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCategory(site.url, 'productive');
                            }}
                          >
                            Productive
                          </Button>
                          <Button 
                            size="sm" 
                            variant={site.category === 'neutral' ? 'default' : 'outline'}
                            className={site.category === 'neutral' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCategory(site.url, 'neutral');
                            }}
                          >
                            Neutral
                          </Button>
                          <Button 
                            size="sm" 
                            variant={site.category === 'distracting' ? 'default' : 'outline'}
                            className={site.category === 'distracting' ? 'bg-red-500 hover:bg-red-600' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCategory(site.url, 'distracting');
                            }}
                          >
                            Distracting
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="limits" className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Daily Time Limits</h3>
            <div className="space-y-4">
              {websiteData
                .filter(site => site.category === 'distracting')
                .map((site) => (
                  <div key={site.url} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{site.url}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(site.timeSpent)} / {site.limit ? formatTime(site.limit) : 'No limit'}
                      </div>
                    </div>
                    
                    {site.limit && (
                      <>
                        <Progress 
                          value={Math.min((site.timeSpent / site.limit) * 100, 100)} 
                          className={`h-2 ${site.timeSpent > site.limit ? '[&>div]:bg-red-500' : '[&>div]:bg-primary'}`}
                        />
                        
                        <div className="flex items-center mt-2">
                          {site.timeSpent > site.limit ? (
                            <div className="flex items-center text-xs text-red-500">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Limit exceeded by {formatTime(site.timeSpent - site.limit)}
                            </div>
                          ) : (
                            <div className="flex items-center text-xs text-green-500">
                              <Check className="w-3 h-3 mr-1" />
                              {formatTime(site.limit - site.timeSpent)} remaining
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    
                    <div className="mt-3 flex items-center">
                      <Input 
                        type="number"
                        placeholder="Set limit (minutes)"
                        className="w-40 mr-2"
                        defaultValue={site.limit ? Math.round(site.limit / 60).toString() : ''}
                        onChange={(e) => setDailyLimit(site.url, e.target.value)}
                      />
                      <Button size="sm" variant="outline" onClick={() => setDailyLimit(site.url, '0')}>
                        Remove Limit
                      </Button>
                    </div>
                  </div>
                ))}
              
              {websiteData.filter(site => site.category === 'distracting').length === 0 && (
                <div className="text-center p-6">
                  <div className="text-muted-foreground mb-2">No distracting websites added yet</div>
                  <p className="text-sm text-muted-foreground">
                    Add websites and mark them as "Distracting" to set daily time limits.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default WebsiteAnalytics;
