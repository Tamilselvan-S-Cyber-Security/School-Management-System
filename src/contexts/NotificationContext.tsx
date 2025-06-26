
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  targetClass?: string;
  targetAll: boolean;
  sentAt: Date;
  status: 'sent' | 'pending' | 'failed';
  recipientCount: number;
}

interface NotificationContextType {
  notifications: NotificationMessage[];
  sendNotification: (message: Omit<NotificationMessage, 'id' | 'sentAt' | 'status'>) => Promise<void>;
  getNotificationHistory: () => NotificationMessage[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const sendNotification = async (messageData: Omit<NotificationMessage, 'id' | 'sentAt' | 'status'>) => {
    const newNotification: NotificationMessage = {
      ...messageData,
      id: Date.now().toString(),
      sentAt: new Date(),
      status: 'pending',
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Simulate FCM sending (in real implementation, this would call Firebase)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotifications(prev => prev.map(notif => 
        notif.id === newNotification.id 
          ? { ...notif, status: 'sent' as const }
          : notif
      ));

      console.log('Notification sent successfully:', newNotification);
    } catch (error) {
      setNotifications(prev => prev.map(notif => 
        notif.id === newNotification.id 
          ? { ...notif, status: 'failed' as const }
          : notif
      ));
      console.error('Failed to send notification:', error);
    }
  };

  const getNotificationHistory = () => {
    return notifications.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      sendNotification,
      getNotificationHistory,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
