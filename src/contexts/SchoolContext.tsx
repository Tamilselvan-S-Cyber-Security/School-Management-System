
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firebaseService } from '../services/firebaseService';
import { toast } from 'sonner';

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
  loading: boolean;
  addStudent: (student: Omit<Student, 'id' | 'dateAdded'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addClass: (className: string, grade: number) => void;
  getStudentsByClass: (className: string) => Student[];
  seedDatabase: () => void;
  refreshStudents: () => Promise<void>;
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
  const [loading, setLoading] = useState(false);
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

  // Load students from Firebase on component mount
  useEffect(() => {
    refreshStudents();
  }, []);

  const refreshStudents = async () => {
    setLoading(true);
    try {
      const firebaseStudents = await firebaseService.getAllStudents();
      setStudents(firebaseStudents);
    } catch (error) {
      console.error('Error loading students from Firebase:', error);
      toast.error('Failed to load students from database');
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id' | 'dateAdded'>) => {
    setLoading(true);
    try {
      const studentId = await firebaseService.addStudent(studentData);
      const newStudent: Student = {
        ...studentData,
        id: studentId,
        dateAdded: new Date(),
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success('Student added to Firebase database');
    } catch (error) {
      console.error('Error adding student to Firebase:', error);
      toast.error('Failed to add student to database');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, studentData: Partial<Student>) => {
    setLoading(true);
    try {
      await firebaseService.updateStudent(id, studentData);
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...studentData } : student
      ));
      toast.success('Student updated in Firebase database');
    } catch (error) {
      console.error('Error updating student in Firebase:', error);
      toast.error('Failed to update student in database');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setLoading(true);
    try {
      await firebaseService.deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
      toast.success('Student deleted from Firebase database');
    } catch (error) {
      console.error('Error deleting student from Firebase:', error);
      toast.error('Failed to delete student from database');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addClass = (className: string, grade: number) => {
    console.log(`Adding class: ${className}, Grade: ${grade}`);
  };

  const getStudentsByClass = (className: string) => {
    return students.filter(student => student.class === className);
  };

  const seedDatabase = async () => {
    setLoading(true);
    try {
      const sampleStudents = [];
      const phoneNumbers = [
        '+91 9876543210', '+91 9876543211', '+91 9876543212', '+91 9876543213', '+91 9876543214',
        '+91 9876543215', '+91 9876543216', '+91 9876543217', '+91 9876543218', '+91 9876543219'
      ];

      for (const classInfo of classes) {
        for (let i = 1; i <= 10; i++) {
          const studentData = {
            name: `Student ${classInfo.grade}-${i}`,
            class: classInfo.name,
            parentPhone: phoneNumbers[i - 1],
            parentName: `Parent ${classInfo.grade}-${i}`,
            rollNumber: `${classInfo.grade}${i.toString().padStart(2, '0')}`,
          };
          
          try {
            await firebaseService.addStudent(studentData);
            sampleStudents.push({
              ...studentData,
              id: `temp-${classInfo.id}-${i}`,
              dateAdded: new Date(),
            });
          } catch (error) {
            console.error(`Error adding sample student ${classInfo.grade}-${i}:`, error);
          }
        }
      }

      await refreshStudents();
      toast.success('Sample students added to Firebase database');
    } catch (error) {
      console.error('Error seeding Firebase database:', error);
      toast.error('Failed to seed Firebase database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolContext.Provider value={{
      students,
      classes,
      loading,
      addStudent,
      updateStudent,
      deleteStudent,
      addClass,
      getStudentsByClass,
      seedDatabase,
      refreshStudents,
    }}>
      {children}
    </SchoolContext.Provider>
  );
};
