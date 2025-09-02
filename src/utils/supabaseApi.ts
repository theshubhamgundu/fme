// Supabase API integration for FindMyEvent platform
import { createClient } from '@supabase/supabase-js';
import { showToast } from './toast';
import { projectId, publicAnonKey } from './supabase/info';

// Create Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'fest' | 'hackathon' | 'workshop' | 'cultural' | 'sports' | 'tech';
  date: string;
  time: string;
  venue: string;
  college: string;
  organizer: string;
  organizerId: string;
  price: number;
  capacity: number;
  registered: number;
  status: 'draft' | 'upcoming' | 'live' | 'ended';
  image: string;
  tags: string[];
  requirements?: string[];
  prizes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'organizer' | 'crew' | 'admin';
  college?: string;
  phone?: string;
  avatar?: string;
  interests?: string[];
  location?: string;
  verified: boolean;
  isOnboarded?: boolean;
  year?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  ticketId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  registrationId: string;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
  generatedAt: string;
  usedAt?: string;
}

// Base API class
class SupabaseAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-a833dcda`;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      console.error(`API Error at ${endpoint}:`, errorData);
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async signup(email: string, password: string, name: string, type: string): Promise<User> {
    try {
      const { user } = await this.request<{ user: User }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, type }),
      });
      showToast.auth.signupSuccess();
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      showToast.auth.signupError();
      throw error;
    }
  }

  async signInWithSupabase(email: string, password: string): Promise<{ user: User; session: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        showToast.auth.loginError();
        throw new Error(error.message);
      }

      if (!session) {
        throw new Error('No session returned');
      }

      // Get user profile from our backend
      const { user } = await this.request<{ user: User }>(`/users/${session.user.id}`);
      
      showToast.auth.loginSuccess(user.name);
      return { user, session };
    } catch (error) {
      console.error('Authentication error during sign-in:', error);
      showToast.auth.loginError();
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast.auth.logoutSuccess();
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<{ user: User; session: any } | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }

      // Get user profile from our backend
      const { user } = await this.request<{ user: User }>(`/users/${session.user.id}`);
      return { user, session };
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  // Events API
  async getEvents(filters?: { type?: string; college?: string; search?: string }): Promise<Event[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.college) params.append('college', filters.college);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const { events } = await this.request<{ events: Event[] }>(
        `/events${queryString ? `?${queryString}` : ''}`
      );
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast.error('Failed to fetch events');
      throw error;
    }
  }

  async getEvent(id: string): Promise<Event> {
    try {
      const { event } = await this.request<{ event: Event }>(`/events/${id}`);
      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      showToast.error('Failed to fetch event details');
      throw error;
    }
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registered'>): Promise<Event> {
    try {
      const { event } = await this.request<{ event: Event }>('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
      showToast.events.createSuccess(event.title);
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      showToast.events.createError();
      throw error;
    }
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    try {
      const { event } = await this.request<{ event: Event }>(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      showToast.events.updateSuccess();
      return event;
    } catch (error) {
      console.error('Error updating event:', error);
      showToast.events.updateError();
      throw error;
    }
  }

  // Users API
  async getUser(id: string): Promise<User> {
    try {
      const { user } = await this.request<{ user: User }>(`/users/${id}`);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      showToast.error('Failed to fetch user profile');
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const { user } = await this.request<{ user: User }>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      showToast.profile.updateSuccess();
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      showToast.profile.updateError();
      throw error;
    }
  }

  // Registrations API
  async registerForEvent(userId: string, eventId: string): Promise<Registration> {
    try {
      const { registration } = await this.request<{ registration: Registration }>('/registrations', {
        method: 'POST',
        body: JSON.stringify({ userId, eventId }),
      });
      showToast.events.registrationSuccess('event');
      return registration;
    } catch (error) {
      console.error('Error registering for event:', error);
      showToast.events.registrationError();
      throw error;
    }
  }

  async getUserRegistrations(userId: string): Promise<(Registration & { event: Event })[]> {
    try {
      const { registrations } = await this.request<{ registrations: (Registration & { event: Event })[] }>(
        `/users/${userId}/registrations`
      );
      return registrations;
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      showToast.error('Failed to fetch registrations');
      throw error;
    }
  }

  // Tickets API
  async generateTicket(registrationId: string): Promise<Ticket> {
    try {
      const { ticket } = await this.request<{ ticket: Ticket }>('/tickets', {
        method: 'POST',
        body: JSON.stringify({ registrationId }),
      });
      showToast.tickets.generateSuccess();
      return ticket;
    } catch (error) {
      console.error('Error generating ticket:', error);
      showToast.tickets.generateError();
      throw error;
    }
  }

  async verifyTicket(qrCode: string): Promise<{ valid: boolean; ticket?: Ticket; event?: Event; user?: User }> {
    try {
      const result = await this.request<{ valid: boolean; ticket?: Ticket; event?: Event; user?: User }>(
        '/tickets/verify',
        {
          method: 'POST',
          body: JSON.stringify({ qrCode }),
        }
      );
      return result;
    } catch (error) {
      console.error('Error verifying ticket:', error);
      showToast.error('Failed to verify ticket');
      throw error;
    }
  }

  async checkInTicket(qrCode: string): Promise<boolean> {
    try {
      const { success } = await this.request<{ success: boolean }>('/tickets/checkin', {
        method: 'POST',
        body: JSON.stringify({ qrCode }),
      });
      
      if (success) {
        showToast.crew.checkinSuccess('attendee');
      }
      
      return success;
    } catch (error) {
      console.error('Error checking in ticket:', error);
      showToast.crew.checkinError();
      throw error;
    }
  }
}

// Export singleton instance
export const supabaseApi = new SupabaseAPI();

// Real-time data hooks
import React from 'react';

export function useRealTimeEvents() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchEvents = React.useCallback(async () => {
    try {
      setError(null);
      const data = await supabaseApi.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error in useRealTimeEvents:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEvents();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useRealTimeUserRegistrations(userId: string | null) {
  const [registrations, setRegistrations] = React.useState<(Registration & { event: Event })[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRegistrations = React.useCallback(async () => {
    if (!userId) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await supabaseApi.getUserRegistrations(userId);
      setRegistrations(data);
    } catch (error) {
      console.error('Error in useRealTimeUserRegistrations:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchRegistrations();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchRegistrations, 30000);
    return () => clearInterval(interval);
  }, [fetchRegistrations]);

  return { registrations, loading, error, refetch: fetchRegistrations };
}