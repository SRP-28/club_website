import { create } from 'zustand';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const getSessionUser = () => {
  const sessionData = sessionStorage.getItem('vajraUser');
  return sessionData ? JSON.parse(sessionData) : null;
};

const useAuthStore = create((set, get) => ({
  user: getSessionUser(), // could be firebase user or session user
  isAdmin: getSessionUser()?.role === 'admin',
  isLoading: true,

  setUser: async (currentUser) => {
    const sessionUser = getSessionUser();
    
    // If a session user exists, we prioritize that for admin access
    if (sessionUser) {
      set({ user: sessionUser, isAdmin: sessionUser.role === 'admin', isLoading: false });
      return;
    }

    if (currentUser) {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.email));
        set({ user: currentUser, isAdmin: adminDoc.exists(), isLoading: false });
      } catch (error) {
        console.error('Error checking admin status:', error);
        set({ user: currentUser, isAdmin: false, isLoading: false });
      }
    } else {
      set({ user: null, isAdmin: false, isLoading: false });
    }
  },

  loginAdmin: (userData) => {
    sessionStorage.setItem('vajraUser', JSON.stringify(userData));
    set({ user: userData, isAdmin: userData.role === 'admin' });
  },

  logout: async () => {
    try {
      sessionStorage.removeItem('vajraUser');
      await signOut(auth);
      set({ user: null, isAdmin: false });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
}));

export default useAuthStore;

