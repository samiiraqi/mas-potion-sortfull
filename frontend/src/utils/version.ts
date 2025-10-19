export const VERSION = Date.now().toString();

export const checkForUpdates = () => {
  const lastVersion = localStorage.getItem('app_version');
  const currentVersion = VERSION;
  
  if (lastVersion && lastVersion !== currentVersion) {
    // New version detected!
    localStorage.setItem('app_version', currentVersion);
    
    // Clear caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Reload to get fresh content
    window.location.reload();
  } else {
    localStorage.setItem('app_version', currentVersion);
  }
};
