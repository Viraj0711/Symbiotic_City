import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-hide after specified duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      hideNotification(id);
    }, duration);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationConfig = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          iconColor: 'text-emerald-600',
          titleColor: 'text-emerald-900',
          messageColor: 'text-emerald-700',
          progressColor: 'bg-emerald-600'
        };
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700',
          progressColor: 'bg-red-600'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-900',
          messageColor: 'text-yellow-700',
          progressColor: 'bg-yellow-600'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700',
          progressColor: 'bg-blue-600'
        };
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm w-full">
        {notifications.map((notification) => {
          const config = getNotificationConfig(notification.type);
          const Icon = config.icon;
          
          return (
            <div
              key={notification.id}
              className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out animate-slide-in-right`}
              style={{
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className={`h-5 w-5 ${config.iconColor}`} />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className={`text-sm font-medium ${config.titleColor}`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm mt-1 ${config.messageColor}`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => hideNotification(notification.id)}
                    className={`inline-flex rounded-md p-1.5 ${config.iconColor} hover:${config.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full ${config.progressColor} transition-all duration-300 ease-linear`}
                  style={{
                    animation: `progressBar ${notification.duration || 5000}ms linear`,
                    animationFillMode: 'forwards'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};