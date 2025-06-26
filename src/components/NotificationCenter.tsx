
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Send, MessageSquare, Users, User, Clock, CheckCircle } from 'lucide-react';
import { useSchool } from '../contexts/SchoolContext';
import { messagingService, Message } from '../services/messagingService';
import { requestNotificationPermission } from '../config/firebase';
import { toast } from 'sonner';

const NotificationCenter = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'class' | 'individual'>('all');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [senderName, setSenderName] = useState('School Admin');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { students, classes } = useSchool();

  useEffect(() => {
    loadMessages();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      await requestNotificationPermission();
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const allMessages = await messagingService.getAllMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load message history');
    }
  };

  const handleSendMessage = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }

    if (targetType === 'class' && !selectedClass) {
      toast.error('Please select a class');
      return;
    }

    if (targetType === 'individual' && !selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    setLoading(true);
    try {
      let messageId: string;

      switch (targetType) {
        case 'all':
          messageId = await messagingService.sendToAll(title, message, senderName);
          toast.success('Message sent to all parents successfully');
          break;
        case 'class':
          messageId = await messagingService.sendToClass(title, message, selectedClass, senderName);
          toast.success(`Message sent to ${selectedClass} parents successfully`);
          break;
        case 'individual':
          messageId = await messagingService.sendToIndividual(title, message, selectedStudent, senderName);
          const student = students.find(s => s.id === selectedStudent);
          toast.success(`Message sent to ${student?.name}'s parent successfully`);
          break;
      }

      // Reset form
      setTitle('');
      setMessage('');
      setTargetType('all');
      setSelectedClass('');
      setSelectedStudent('');

      // Reload messages
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getTargetDescription = (msg: Message) => {
    switch (msg.targetType) {
      case 'all':
        return 'All Parents';
      case 'class':
        return `Class: ${msg.targetClass}`;
      case 'individual':
        const student = students.find(s => s.id === msg.targetStudentId);
        return `Student: ${student?.name || 'Unknown'}`;
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Send New Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification
          </CardTitle>
          <CardDescription>
            Send real-time messages to parents via Firebase Cloud Messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sender-name">Sender Name</Label>
              <Input
                id="sender-name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender name"
              />
            </div>
            <div>
              <Label htmlFor="target-type">Send To</Label>
              <Select value={targetType} onValueChange={(value: 'all' | 'class' | 'individual') => setTargetType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parents</SelectItem>
                  <SelectItem value="class">Specific Class</SelectItem>
                  <SelectItem value="individual">Individual Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {targetType === 'class' && (
            <div>
              <Label htmlFor="class-select">Select Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose class" />
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

          {targetType === 'individual' && (
            <div>
              <Label htmlFor="student-select">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.class})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="message-title">Message Title</Label>
            <Input
              id="message-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title"
            />
          </div>

          <div>
            <Label htmlFor="message-body">Message</Label>
            <Textarea
              id="message-body"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={4}
            />
          </div>

          <Button onClick={handleSendMessage} disabled={loading} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message History
          </CardTitle>
          <CardDescription>
            View all sent messages and their delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{msg.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {msg.body}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {msg.targetType === 'all' && <Users className="h-4 w-4" />}
                        {msg.targetType === 'class' && <Users className="h-4 w-4" />}
                        {msg.targetType === 'individual' && <User className="h-4 w-4" />}
                        {getTargetDescription(msg)}
                      </div>
                    </TableCell>
                    <TableCell>{msg.senderName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {msg.sentAt.toLocaleDateString()} {msg.sentAt.toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={msg.status === 'sent' ? 'default' : msg.status === 'pending' ? 'secondary' : 'destructive'}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {msg.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No messages sent yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
