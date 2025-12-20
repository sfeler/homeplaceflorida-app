/**
 * Initialize Microsoft Clarity analytics
 * @param {string} projectId - Your Clarity project ID
 */
export const initClarity = (projectId) => {
  if (!projectId) {
    console.warn('Microsoft Clarity: No project ID provided');
    return;
  }

  // Only initialize in production or if explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_CLARITY_ENABLED === 'true') {
    try {
      // Initialize Clarity using the global window object
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", projectId);
      
      console.log('Microsoft Clarity initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Microsoft Clarity:', error);
    }
  } else {
    console.log('Microsoft Clarity: Skipped initialization (not in production)');
  }
};

/**
 * Set a custom user ID for Clarity tracking
 * @param {string} userId - Unique user identifier
 */
export const setClarityUserId = (userId) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('identify', userId);
  }
};

/**
 * Set custom session tags
 * @param {string} key - Tag key
 * @param {string} value - Tag value
 */
export const setClarityTag = (key, value) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', key, value);
  }
};

/**
 * Upgrade the current session to be recorded
 * Useful for capturing sessions of users who perform specific actions
 * @param {string} reason - Reason for upgrading the session
 */
export const upgradeClaritySession = (reason) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('upgrade', reason);
  }
};

