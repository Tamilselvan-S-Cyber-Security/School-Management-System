
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import { BarChart3, FileText, Users, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useSchool } from '../contexts/SchoolContext';
import { useNotification } from '../contexts/NotificationContext';

const ReportsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Reports & Analytics',
    defaultDescription: 'View system analytics and generate reports'
  });

  const { students } = useSchool();
  const { notifications } = useNotification();

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      description: 'Registered students',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Notifications Sent',
      value: notifications.length,
      description: 'Messages delivered',
      icon: Bell,
      color: 'text-green-600'
    },
    {
      title: 'Active Classes',
      value: '12',
      description: 'Class levels',
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          icon={<BarChart3 className="h-8 w-8" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed analytics and reporting features will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
