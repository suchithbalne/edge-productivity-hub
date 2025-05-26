// Function to get URL with theme parameter
function getRedirectUrl() {
  // Get user's theme preference from localStorage
  const userTheme = localStorage.getItem('edge-homepage-theme') || 'Blue';
  
  // Base URL for GitHub Pages
  const baseUrl = 'https://suchithbalne.github.io/edge-productivity-hub/';
  
  // Add theme parameter to URL
  return `${baseUrl}?theme=${encodeURIComponent(userTheme)}`;
}

// Redirect after a short delay to ensure localStorage is accessed
window.onload = function() {
  setTimeout(function() {
    window.location.href = getRedirectUrl();
  }, 100);
  
  // Update the manual link with theme parameter
  const manualLink = document.getElementById('manual-link');
  if (manualLink) {
    manualLink.href = getRedirectUrl();
  }
};
