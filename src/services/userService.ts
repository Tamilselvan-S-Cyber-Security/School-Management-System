
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

const USERS_COLLECTION = 'users';

export const userService = {
  // Create new user profile
  async createProfile(profileData: Omit<UserProfile, 'id' | 'createdAt' | 'lastLogin'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, USERS_COLLECTION), {
        ...profileData,
        createdAt: new Date(),
        lastLogin: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile by email
  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    try {
      const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastLogin: doc.data().lastLogin?.toDate() || new Date(),
        } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(id: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, id);
      await updateDoc(userRef, {
        ...profileData,
        lastLogin: new Date(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
      const users: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastLogin: doc.data().lastLogin?.toDate() || new Date(),
        } as UserProfile);
      });
      
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }
};
