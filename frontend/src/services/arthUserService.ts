import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserIdentifier {
  uid: string;
  phoneNumber?: string | null;
}

export interface ArthUserProfile {
  firebase_uid: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  role: 'farmer' | 'entrepreneur' | 'unassigned';
  profile_status: 'active' | 'incomplete' | 'complete';
  name?: string;
  state?: string;
  district?: string;
}

export async function syncArthUserProfile(
  user: UserIdentifier, 
  preferredRole?: 'farmer' | 'entrepreneur'
): Promise<ArthUserProfile> {
  const now = new Date().toISOString();

  if (!db) {
    return {
      firebase_uid: user.uid,
      phone_number: user.phoneNumber || '',
      created_at: now,
      updated_at: now,
      role: preferredRole || 'unassigned',
      profile_status: 'incomplete',
    };
  }

  const userRef = doc(db, 'users', user.uid);

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existingData = snap.data() as ArthUserProfile;
      const updates: Partial<ArthUserProfile> = {
        updated_at: now,
        phone_number: user.phoneNumber || existingData.phone_number || '',
      };
      if (preferredRole && existingData.role === 'unassigned') {
        updates.role = preferredRole;
      }
      await updateDoc(userRef, updates);
      return { ...existingData, ...updates };
    } else {
      const newProfile: ArthUserProfile = {
        firebase_uid: user.uid,
        phone_number: user.phoneNumber || '',
        created_at: now,
        updated_at: now,
        role: preferredRole || 'unassigned',
        profile_status: 'incomplete',
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    console.error('Error syncing ARTH user profile in Firestore:', error);
    // Return a valid in-memory profile representation as a fallback
    return {
      firebase_uid: user.uid,
      phone_number: user.phoneNumber || '',
      created_at: now,
      updated_at: now,
      role: preferredRole || 'unassigned',
      profile_status: 'incomplete',
    };
  }
}

export async function getArthUserProfile(uid: string): Promise<ArthUserProfile | null> {
  if (!db) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as ArthUserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching ARTH user profile:', error);
    return null;
  }
}

export async function updateArthUserProfile(
  uid: string,
  updates: Partial<ArthUserProfile>
): Promise<void> {
  if (!db) return;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating ARTH user profile:', error);
  }
}
