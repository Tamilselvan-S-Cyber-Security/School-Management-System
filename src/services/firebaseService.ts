
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student } from '../contexts/SchoolContext';

const STUDENTS_COLLECTION = 'students';

export const firebaseService = {
  // Add a new student to Firebase
  async addStudent(studentData: Omit<Student, 'id' | 'dateAdded'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
        ...studentData,
        dateAdded: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  // Get all students from Firebase
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
      return students;
    } catch (error) {
      console.error('Error getting students:', error);
      throw error;
    }
  },

  // Update a student in Firebase
  async updateStudent(id: string, studentData: Partial<Student>): Promise<void> {
    try {
      const studentRef = doc(db, STUDENTS_COLLECTION, id);
      await updateDoc(studentRef, studentData);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Delete a student from Firebase
  async deleteStudent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
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
      console.error('Error getting students by class:', error);
      throw error;
    }
  }
};
