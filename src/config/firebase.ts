
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyD9gjqCdo_He7AhN3TtBOOeOY8iWYaU2CI",
  authDomain: "akt-school.firebaseapp.com",
  projectId: "akt-school",
  storageBucket: "akt-school.firebasestorage.app",
  messagingSenderId: "242788636362",
  appId: "1:242788636362:web:4174e9408089a380850633",
  measurementId: "G-YPKRNHG5YD"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with proper settings
export const db = getFirestore(app);

// For development, you might want to use the emulator
// Uncomment the line below if you're using the Firestore emulator
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging
let messaging: any = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Messaging not supported in this environment:', error);
  }
}

export { messaging };

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BKxvxQ9YrZ8QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9QqZ9Q' // Replace with your actual VAPID key
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
  return null;
};

// Listen for foreground messages
export const onMessageListener = () => {
  if (!messaging) return Promise.reject('Messaging not supported');
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
