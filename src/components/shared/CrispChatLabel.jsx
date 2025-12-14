import React, { useState, useEffect } from 'react';

export default function CrispChatLabel() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide label when chat is opened
    const checkChatState = () => {
      if (window.$crisp && window.$crisp.is) {
        const isOpen = window.$crisp.is('chat:opened');
        setIsVisible(!isOpen);
      }
    };

    // Check state periodically
    const interval = setInterval(checkChatState, 500);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (window.$crisp) {
      window.$crisp.push(['do', 'chat:open']);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-24 right-6 z-40 cursor-pointer animate-in slide-in-from-bottom duration-300"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative">
        <div 
          className="text-white px-5 py-2.5 rounded-2xl shadow-lg font-semibold text-sm hover:shadow-xl transition-all duration-200"
          style={{ backgroundColor: '#1972F5' }}
        >
          Chat with us
        </div>
        {/* Tail/pointer coming out of the bubble */}
        <div 
          className="absolute left-1/2 -bottom-2 w-4 h-4 rotate-45"
          style={{ 
            backgroundColor: '#1972F5',
            transform: 'translateX(-50%) rotate(45deg)',
            boxShadow: '2px 2px 3px rgba(0,0,0,0.1)'
          }}
        />
      </div>
    </div>
  );
}


