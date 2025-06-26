
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import SchoolDashboard from '../components/SchoolDashboard';
import { School, Users, Bell, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'School Management Dashboard',
    defaultDescription: 'Centralized platform for school administration and parent communication'
  });

  const quickActions = [
    {
      title: 'Send Notification',
      description: 'Broadcast messages to parents and students',
      icon: Bell,
      action: () => navigate('/notifications'),
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Students',
      description: 'Add, edit, and organize student records',
      icon: Users,
      action: () => navigate('/students'),
      color: 'bg-green-500'
    },
    {
      title: 'View Classes',
      description: 'Organize students by class and grade',
      icon: School,
      action: () => navigate('/classes'),
      color: 'bg-purple-500'
    },
    {
      title: 'Generate Reports',
      description: 'View analytics and system reports',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-orange-500'
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
          icon={<School className="h-8 w-8" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{action.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <SchoolDashboard />
      </div>
    </PageLayout>
  );
};

export default Index;
