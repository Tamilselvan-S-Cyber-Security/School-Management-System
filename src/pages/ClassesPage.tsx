
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import { School } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useSchool } from '../contexts/SchoolContext';

const ClassesPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Class Management',
    defaultDescription: 'Organize students by class and grade level'
  });

  const { classes, getStudentsByClass } = useSchool();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classInfo) => (
            <Card key={classInfo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {classInfo.name}
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Grade {classInfo.grade}
                  </span>
                </CardTitle>
                <CardDescription>
                  Students: {getStudentsByClass(classInfo.name).length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage students in {classInfo.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default ClassesPage;
