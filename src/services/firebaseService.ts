
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student } from '../contexts/SchoolContext';

const STUDENTS_COLLECTION = 'students';

// Fallback to localStorage for development/testing
const useLocalStorage = () => {
  return !db || process.env.NODE_ENV === 'development';
};

const localStorageService = {
  async addStudent(studentData: Omit<Student, 'id' | 'dateAdded'>): Promise<string> {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const newStudent = {
      ...studentData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    };
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    return newStudent.id;
  },

  async getAllStudents(): Promise<Student[]> {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    return students.map((student: any) => ({
      ...student,
      dateAdded: new Date(student.dateAdded),
    }));
  },

  async updateStudent(id: string, studentData: Partial<Student>): Promise<void> {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const index = students.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      localStorage.setItem('students', JSON.stringify(students));
    }
  },

  async deleteStudent(id: string): Promise<void> {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const filtered = students.filter((s: any) => s.id !== id);
    localStorage.setItem('students', JSON.stringify(filtered));
  },
};

export const firebaseService = {
  // Add a new student to Firebase or localStorage
  async addStudent(studentData: Omit<Student, 'id' | 'dateAdded'>): Promise<string> {
    try {
      // Try Firebase first
      const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
        ...studentData,
        dateAdded: new Date(),
      });
      console.log('Student added to Firebase successfully');
      return docRef.id;
    } catch (error) {
      console.warn('Firebase unavailable, using localStorage:', error);
      // Fallback to localStorage
      return await localStorageService.addStudent(studentData);
    }
  },

  // Get all students from Firebase or localStorage
  async getAllStudents(): Promise<Student[]> {
    try {
      const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data(),
          dateAdded: doc.data().dateAdded?.toDate() || new Date(),
        } as Student);
      });
      console.log('Students loaded from Firebase successfully');
      return students;
    } catch (error) {
      console.warn('Firebase unavailable, using localStorage:', error);
      // Fallback to localStorage
      return await localStorageService.getAllStudents();
    }
  },

  // Update a student in Firebase or localStorage
  async updateStudent(id: string, studentData: Partial<Student>): Promise<void> {
    try {
      const studentRef = doc(db, STUDENTS_COLLECTION, id);
      await updateDoc(studentRef, studentData);
      console.log('Student updated in Firebase successfully');
    } catch (error) {
      console.warn('Firebase unavailable, using localStorage:', error);
      // Fallback to localStorage
      await localStorageService.updateStudent(id, studentData);
    }
  },

  // Delete a student from Firebase or localStorage
  async deleteStudent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
      console.log('Student deleted from Firebase successfully');
    } catch (error) {
      console.warn('Firebase unavailable, using localStorage:', error);
      // Fallback to localStorage
      await localStorageService.deleteStudent(id);
    }
  },

  // Get students by class
  async getStudentsByClass(className: string): Promise<Student[]> {
    try {
      const q = query(collection(db, STUDENTS_COLLECTION), where('class', '==', className));
      const querySnapshot = await getDocs(q);
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data(),
          dateAdded: doc.data().dateAdded?.toDate() || new Date(),
        } as Student);
      });
      return students;
    } catch (error) {
      console.warn('Firebase unavailable, filtering localStorage data:', error);
      // Fallback to localStorage with filtering
      const allStudents = await localStorageService.getAllStudents();
      return allStudents.filter(student => student.class === className);
    }
  }
};
