
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student } from '../contexts/SchoolContext';

export interface Message {
  id: string;
  title: string;
  body: string;
  targetType: 'all' | 'class' | 'individual';
  targetClass?: string;
  targetStudentId?: string;
  senderName: string;
  sentAt: Date;
  status: 'sent' | 'pending' | 'failed';
  readBy: string[];
  recipientCount: number;
}

const MESSAGES_COLLECTION = 'messages';

export const messagingService = {
  // Send message to all parents
  async sendToAll(title: string, body: string, senderName: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        title,
        body,
        targetType: 'all',
        senderName,
        sentAt: new Date(),
        status: 'sent',
        readBy: [],
        recipientCount: 0, // Will be updated after sending
      });
      
      console.log('Message sent to all parents:', { title, body });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message to all:', error);
      throw error;
    }
  },

  // Send message to specific class
  async sendToClass(title: string, body: string, className: string, senderName: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        title,
        body,
        targetType: 'class',
        targetClass: className,
        senderName,
        sentAt: new Date(),
        status: 'sent',
        readBy: [],
        recipientCount: 0, // Will be updated after sending
      });
      
      console.log('Message sent to class:', { title, body, className });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message to class:', error);
      throw error;
    }
  },

  // Send message to individual student's parent
  async sendToIndividual(title: string, body: string, studentId: string, senderName: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
        title,
        body,
        targetType: 'individual',
        targetStudentId: studentId,
        senderName,
        sentAt: new Date(),
        status: 'sent',
        readBy: [],
        recipientCount: 1,
      });
      
      console.log('Message sent to individual:', { title, body, studentId });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message to individual:', error);
      throw error;
    }
  },

  // Get all messages
  async getAllMessages(): Promise<Message[]> {
    try {
      const q = query(collection(db, MESSAGES_COLLECTION), orderBy('sentAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          sentAt: doc.data().sentAt?.toDate() || new Date(),
        } as Message);
      });
      
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },

  // Mark message as read
  async markAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const messageRef = doc(db, MESSAGES_COLLECTION, messageId);
      const message = await getDocs(query(collection(db, MESSAGES_COLLECTION), where('id', '==', messageId)));
      
      if (!message.empty) {
        const messageData = message.docs[0].data();
        const readBy = messageData.readBy || [];
        
        if (!readBy.includes(userId)) {
          await updateDoc(messageRef, {
            readBy: [...readBy, userId]
          });
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};
