
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Send, Clock, CheckCircle, XCircle, Users, School } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useSchool } from '../contexts/SchoolContext';
import { toast } from 'sonner';

const NotificationCenter = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [targetAll, setTargetAll] = useState(true);

  const { sendNotification, notifications } = useNotification();
  const { classes, students, getStudentsByClass } = useSchool();

  // Quick message templates
  const quickMessages = [
    { title: 'Holiday Notice', body: 'School will remain closed tomorrow due to public holiday.' },
    { title: 'Fee Reminder', body: 'Kindly pay the pending fees by the end of this month.' },
    { title: 'Parent Meeting', body: 'Parent-teacher meeting scheduled for this Saturday at 10 AM.' },
    { title: 'Exam Schedule', body: 'Monthly examination will start from next Monday. Please prepare accordingly.' }
  ];

  const useQuickMessage = (quickMsg: { title: string; body: string }) => {
    setTitle(quickMsg.title);
    setMessage(quickMsg.body);
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    let recipientCount = 0;
    let targetDescription = '';

    if (targetAll) {
      recipientCount = students.length;
      targetDescription = 'All Students';
    } else if (targetClass) {
      const classStudents = getStudentsByClass(targetClass);
      recipientCount = classStudents.length;
      targetDescription = targetClass;
    } else {
      toast.error('Please select a target audience');
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
      setTargetAll(true);
      
      toast.success(`Message sent to ${recipientCount} parents via WhatsApp/SMS (+91 numbers)`);
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

  const getClassStudentCount = (className: string) => {
    return getStudentsByClass(className).length;
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
            Send messages to parents via SMS/WhatsApp (Indian mobile numbers +91)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Message Templates */}
          <div>
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {quickMessages.map((quickMsg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => useQuickMessage(quickMsg)}
                  className="text-xs h-auto py-2"
                >
                  {quickMsg.title}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Message Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

          <div>
            <Label htmlFor="message">Message Content</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Messages will be sent to Indian mobile numbers (+91 prefix)
            </p>
          </div>

          <div>
            <Label>Target Audience</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="all-students"
                  name="target"
                  checked={targetAll}
                  onChange={(e) => {
                    setTargetAll(e.target.checked);
                    if (e.target.checked) setTargetClass('');
                  }}
                />
                <Label htmlFor="all-students" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Send to all students ({students.length} parents)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="specific-class"
                  name="target"
                  checked={!targetAll}
                  onChange={(e) => setTargetAll(!e.target.checked)}
                />
                <Label htmlFor="specific-class" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Send to specific class
                </Label>
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
                      <div className="flex items-center justify-between w-full">
                        <span>{classInfo.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {getClassStudentCount(classInfo.name)} students
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {targetClass && (
                <p className="text-sm text-muted-foreground mt-1">
                  Will send to {getClassStudentCount(targetClass)} parents in {targetClass}
                </p>
              )}
            </div>
          )}

          <Button onClick={handleSendNotification} className="w-full" size="lg">
            <Send className="h-4 w-4 mr-2" />
            Send Message
            {targetAll ? ` to All (${students.length})` : targetClass ? ` to ${targetClass} (${getClassStudentCount(targetClass)})` : ''}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>
            Recent notifications sent to parents (+91 mobile numbers)
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
                      <Badge variant={notification.targetAll ? "default" : "outline"}>
                        {notification.targetAll ? 'All Students' : notification.targetClass}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.recipientCount} recipients (+91)
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
                No messages sent yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
