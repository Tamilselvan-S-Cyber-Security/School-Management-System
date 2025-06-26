
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import StudentManagement from '../components/StudentManagement';
import { Users, Plus, Upload, Database } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useSchool } from '../contexts/SchoolContext';

const StudentsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Student Management',
    defaultDescription: 'Manage student records, classes, and parent contact information'
  });

  const { students, addClass, seedDatabase } = useSchool();
  const [showAddStudent, setShowAddStudent] = useState(false);

  const handleSeedDatabase = () => {
    seedDatabase();
    console.log('Database seeded with 120 sample students (10 per class)');
  };

  const stats = [
    { label: 'Total Students', value: students.length, color: 'text-blue-600' },
    { label: 'Active Classes', value: '12', color: 'text-green-600' },
    { label: 'Parent Contacts', value: students.length, color: 'text-purple-600' },
  ];

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          icon={<Users className="h-8 w-8" />}
          actions={
            <div className="flex gap-2">
              <Button onClick={() => setShowAddStudent(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
              <Button variant="outline" onClick={handleSeedDatabase}>
                <Database className="h-4 w-4 mr-2" />
                Seed Database
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <StudentManagement showAddForm={showAddStudent} onCloseAddForm={() => setShowAddStudent(false)} />
      </div>
    </PageLayout>
  );
};

export default StudentsPage;
