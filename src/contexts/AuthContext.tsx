import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseApi, User } from '../utils/supabaseApi';
import { showToast } from '../utils/toast';

export type UserType = 'student' | 'organizer' | 'crew' | 'admin';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, type: UserType) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing (kept for backward compatibility)
export const demoUsers: Record<string, User> = {
  student: {
    id: 'user_student1',
    name: 'Alex Johnson',
    email: 'student@demo.com',
    type: 'student',
    college: 'IIT Delhi',
    year: '3rd Year',
    isOnboarded: true,
    verified: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  organizer: {
    id: 'user_organizer1',
    name: 'Sarah Wilson',
    email: 'organizer@demo.com',
    type: 'organizer',
    college: 'BITS Pilani',
    isOnboarded: true,
    verified: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  crew: {
    id: 'user_crew1',
    name: 'Mike Chen',
    email: 'crew@demo.com',
    type: 'crew',
    college: 'Delhi University',
    isOnboarded: true,
    verified: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  admin: {
    id: 'user_admin1',
    name: 'Admin User',
    email: 'admin@demo.com',
    type: 'admin',
    isOnboarded: true,
    verified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      try {
        const sessionData = await supabaseApi.getCurrentSession();
        if (sessionData) {
          setUser(sessionData.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear any invalid stored data
        localStorage.removeItem('findMyEvent_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Handle demo users for quick testing
      const demoUserKey = Object.keys(demoUsers).find(key => 
        demoUsers[key].email === email
      );
      
      if (demoUserKey && password === 'demo123') {
        const demoUser = demoUsers[demoUserKey];
        setUser(demoUser);
        localStorage.setItem('findMyEvent_user', JSON.stringify(demoUser));
        showToast.auth.loginSuccess(demoUser.name);
        return;
      }

      // Real authentication with Supabase
      const { user: authenticatedUser } = await supabaseApi.signInWithSupabase(email, password);
      setUser(authenticatedUser);
      localStorage.setItem('findMyEvent_user', JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, type: UserType) => {
    try {
      setIsLoading(true);
      const newUser = await supabaseApi.signup(email, password, name, type);
      setUser(newUser);
      localStorage.setItem('findMyEvent_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabaseApi.signOut();
      setUser(null);
      localStorage.removeItem('findMyEvent_user');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, clear local state
      setUser(null);
      localStorage.removeItem('findMyEvent_user');
      showToast.auth.logoutSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await supabaseApi.updateUser(user.id, updates);
      setUser(updatedUser);
      localStorage.setItem('findMyEvent_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}