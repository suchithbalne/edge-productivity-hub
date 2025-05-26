// Theme handler script to apply theme from URL parameter
document.addEventListener('DOMContentLoaded', function() {
  // Function to get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Get theme from URL parameter
  const themeParam = getUrlParameter('theme');
  
  if (themeParam) {
    // Store the theme in localStorage
    localStorage.setItem('edge-homepage-theme', themeParam);
    
    // Apply the theme immediately
    const colorThemes = {
      'Green': { primary: '142 86% 28%', accent: '142 76% 36%' },
      'Blue': { primary: '217 91% 60%', accent: '217 81% 70%' },
      'Purple': { primary: '262 83% 58%', accent: '262 73% 68%' },
      'Orange': { primary: '25 95% 53%', accent: '25 85% 63%' },
      'Pink': { primary: '330 81% 60%', accent: '330 71% 70%' },
      'Red': { primary: '0 84% 60%', accent: '0 74% 70%' }
    };
    
    // Get the theme values
    const theme = colorThemes[themeParam] || colorThemes['Blue'];
    
    // Update CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--ring', theme.primary);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--sidebar-ring', theme.primary);
    
    // Dispatch theme changed event for components that listen to it
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    // Clean up URL to remove the parameter (optional)
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.protocol + "//" + 
                      window.location.host + 
                      window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
});
