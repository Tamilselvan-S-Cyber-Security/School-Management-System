
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import NotificationCenter from '../components/NotificationCenter';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Notification Center',
    defaultDescription: 'Send real-time notifications to parents and students via Firebase Cloud Messaging'
  });

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          icon={<Bell className="h-8 w-8" />}
        />

        <NotificationCenter />
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;
