
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Phone, Save, Edit } from 'lucide-react';
import { userService, UserProfile as UserProfileType } from '../services/userService';
import { toast } from 'sonner';

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileType>({
    id: '',
    name: '',
    email: '',
    role: 'admin',
    phone: '',
    avatar: '',
    createdAt: new Date(),
    lastLogin: new Date(),
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // For demo purposes, we'll create a default profile
      // In real app, you'd get the current user's email from authentication
      const defaultEmail = 'admin@akt-school.com';
      let userProfile = await userService.getProfileByEmail(defaultEmail);
      
      if (!userProfile) {
        // Create default profile if it doesn't exist
        const profileId = await userService.createProfile({
          name: 'School Administrator',
          email: defaultEmail,
          role: 'admin',
          phone: '+91 9876543210',
        });
        
        userProfile = {
          id: profileId,
          name: 'School Administrator',
          email: defaultEmail,
          role: 'admin',
          phone: '+91 9876543210',
          avatar: '',
          createdAt: new Date(),
          lastLogin: new Date(),
        };
      }
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load user profile');
    }
  };

  const handleSave = async () => {
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error('Please fill in name and email');
      return;
    }

    setLoading(true);
    try {
      if (profile.id) {
        await userService.updateProfile(profile.id, {
          name: profile.name,
          email: profile.email,
          role: profile.role,
          phone: profile.phone,
          avatar: profile.avatar,
        });
        toast.success('Profile updated successfully');
      } else {
        const profileId = await userService.createProfile({
          name: profile.name,
          email: profile.email,
          role: profile.role,
          phone: profile.phone,
          avatar: profile.avatar,
        });
        setProfile(prev => ({ ...prev, id: profileId }));
        toast.success('Profile created successfully');
      }
      
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                onClick={() => setEditing(!editing)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {editing && (
            <div className="space-y-4 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={profile.role} 
                    onValueChange={(value: 'admin' | 'teacher' | 'parent') => setProfile(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL (optional)</Label>
                <Input
                  id="avatar"
                  value={profile.avatar}
                  onChange={(e) => setProfile(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="Enter avatar image URL"
                />
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Created</Label>
              <p className="text-sm text-muted-foreground">
                {profile.createdAt.toLocaleDateString()} at {profile.createdAt.toLocaleTimeString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Login</Label>
              <p className="text-sm text-muted-foreground">
                {profile.lastLogin.toLocaleDateString()} at {profile.lastLogin.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
