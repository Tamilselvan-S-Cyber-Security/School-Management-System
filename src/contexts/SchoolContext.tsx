
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  class: string;
  parentPhone: string;
  parentName?: string;
  rollNumber?: string;
  dateAdded: Date;
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
}

interface SchoolContextType {
  students: Student[];
  classes: Class[];
  addStudent: (student: Omit<Student, 'id' | 'dateAdded'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addClass: (className: string, grade: number) => void;
  getStudentsByClass: (className: string) => Student[];
  seedDatabase: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

export const SchoolProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes] = useState<Class[]>([
    { id: '1', name: '1st Standard', grade: 1, studentCount: 0 },
    { id: '2', name: '2nd Standard', grade: 2, studentCount: 0 },
    { id: '3', name: '3rd Standard', grade: 3, studentCount: 0 },
    { id: '4', name: '4th Standard', grade: 4, studentCount: 0 },
    { id: '5', name: '5th Standard', grade: 5, studentCount: 0 },
    { id: '6', name: '6th Standard', grade: 6, studentCount: 0 },
    { id: '7', name: '7th Standard', grade: 7, studentCount: 0 },
    { id: '8', name: '8th Standard', grade: 8, studentCount: 0 },
    { id: '9', name: '9th Standard', grade: 9, studentCount: 0 },
    { id: '10', name: '10th Standard', grade: 10, studentCount: 0 },
    { id: '11', name: '11th Standard', grade: 11, studentCount: 0 },
    { id: '12', name: '12th Standard', grade: 12, studentCount: 0 },
  ]);

  const addStudent = (studentData: Omit<Student, 'id' | 'dateAdded'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      dateAdded: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...studentData } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const addClass = (className: string, grade: number) => {
    // This would typically add to classes array, but for now classes are fixed
    console.log(`Adding class: ${className}, Grade: ${grade}`);
  };

  const getStudentsByClass = (className: string) => {
    return students.filter(student => student.class === className);
  };

  const seedDatabase = () => {
    const sampleStudents: Student[] = [];
    const phoneNumbers = [
      '9876543210', '9876543211', '9876543212', '9876543213', '9876543214',
      '9876543215', '9876543216', '9876543217', '9876543218', '9876543219'
    ];

    classes.forEach(classInfo => {
      for (let i = 1; i <= 10; i++) {
        sampleStudents.push({
          id: `${classInfo.id}-${i}`,
          name: `Student ${classInfo.grade}-${i}`,
          class: classInfo.name,
          parentPhone: phoneNumbers[i - 1],
          parentName: `Parent ${classInfo.grade}-${i}`,
          rollNumber: `${classInfo.grade}${i.toString().padStart(2, '0')}`,
          dateAdded: new Date(),
        });
      }
    });

    setStudents(sampleStudents);
  };

  return (
    <SchoolContext.Provider value={{
      students,
      classes,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      getStudentsByClass,
      seedDatabase,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};
