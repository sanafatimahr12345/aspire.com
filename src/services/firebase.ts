import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app);

// Realtime sync helpers
export const FirebaseSync = {
  // Save full state slice to Firestore
  async saveSlice<T>(collectionName: string, docId: string, data: T): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, { payload: data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn(`[FirebaseSync] Could not save ${collectionName}/${docId}:`, err);
    }
  },

  // Listen to changes on a slice
  subscribeSlice<T>(collectionName: string, docId: string, onUpdate: (data: T) => void): () => void {
    try {
      const docRef = doc(db, collectionName, docId);
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && data.payload) {
            onUpdate(data.payload as T);
          }
        }
      }, (err) => {
        console.warn(`[FirebaseSync] Subscription error on ${collectionName}/${docId}:`, err);
      });
      return unsubscribe;
    } catch (err) {
      console.warn(`[FirebaseSync] Failed to setup listener on ${collectionName}/${docId}:`, err);
      return () => {};
    }
  }
};
