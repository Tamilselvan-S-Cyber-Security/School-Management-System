
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useSchool } from '../contexts/SchoolContext';
import { toast } from 'sonner';

const NotificationCenter = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [targetAll, setTargetAll] = useState(false);

  const { sendNotification, notifications } = useNotification();
  const { classes, students } = useSchool();

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    const recipientCount = targetAll 
      ? students.length 
      : students.filter(s => s.class === targetClass).length;

    if (!targetAll && !targetClass) {
      toast.error('Please select a target class or choose to send to all');
      return;
    }

    if (recipientCount === 0) {
      toast.error('No recipients found for the selected target');
      return;
    }

    try {
      await sendNotification({
        title,
        body: message,
        targetClass: targetAll ? undefined : targetClass,
        targetAll,
        recipientCount
      });

      setTitle('');
      setMessage('');
      setTargetClass('');
      setTargetAll(false);
      
      toast.success(`Notification sent to ${recipientCount} recipients`);
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification
          </CardTitle>
          <CardDescription>
            Send messages to parents and students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
            />
          </div>

          <div>
            <Label>Target Audience</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="all-students"
                  name="target"
                  checked={targetAll}
                  onChange={(e) => setTargetAll(e.target.checked)}
                />
                <Label htmlFor="all-students">Send to all students</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="specific-class"
                  name="target"
                  checked={!targetAll}
                  onChange={(e) => setTargetAll(!e.target.checked)}
                />
                <Label htmlFor="specific-class">Send to specific class</Label>
              </div>
            </div>
          </div>

          {!targetAll && (
            <div>
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={targetClass} onValueChange={setTargetClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classInfo) => (
                    <SelectItem key={classInfo.id} value={classInfo.name}>
                      {classInfo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleSendNotification} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            Recent notifications sent to parents and students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.body}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {notification.targetAll ? 'All Students' : notification.targetClass}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.recipientCount} recipients
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(notification.status)}
                    <span className="text-xs text-muted-foreground">
                      {notification.sentAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No notifications sent yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
