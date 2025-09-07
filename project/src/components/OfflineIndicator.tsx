import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { OfflineManager } from '../utils/storage';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    OfflineManager.init();
    
    OfflineManager.onStatusChange((online) => {
      setIsOnline(online);
      setShowIndicator(true);
      
      // 3 saniye sonra göstergeyi gizle
      setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
    });
  }, []);

  if (!showIndicator) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
      isOnline 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Çevrimiçi</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Çevrimdışı</span>
        </>
      )}
    </div>
  );
}