
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, School, Bell, TrendingUp } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';
import { useNotification } from '../contexts/NotificationContext';

const SchoolDashboard = () => {
  const { students, classes } = useSchool();
  const { notifications } = useNotification();

  const dashboardStats = [
    {
      title: 'Total Students',
      value: students.length,
      description: '+12% from last month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Classes',
      value: classes.length,
      description: 'All grade levels',
      icon: School,
      color: 'text-green-600'
    },
    {
      title: 'Notifications Sent',
      value: notifications.length,
      description: 'This month',
      icon: Bell,
      color: 'text-purple-600'
    },
    {
      title: 'Engagement Rate',
      value: '95%',
      description: '+5% improvement',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.sentAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent notifications</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">• Send emergency notification</p>
              <p className="text-sm">• Add new student</p>
              <p className="text-sm">• Generate class report</p>
              <p className="text-sm">• Update parent contact</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolDashboard;
