// API utilities for data management
import { showToast } from './toast';

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
  role: 'student' | 'organizer' | 'crew' | 'admin';
  college?: string;
  phone?: string;
  avatar?: string;
  interests?: string[];
  location?: string;
  verified: boolean;
  createdAt: string;
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

// Mock database simulation with localStorage
class MockAPI {
  private getFromStorage<T>(key: string, defaultValue: T[]): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Events API
  async getEvents(filters?: { type?: string; college?: string; search?: string }): Promise<Event[]> {
    await this.delay();
    let events = this.getFromStorage<Event>('events', this.getDefaultEvents());
    
    if (filters) {
      if (filters.type && filters.type !== 'all') {
        events = events.filter(event => event.type === filters.type);
      }
      if (filters.college) {
        events = events.filter(event => event.college.toLowerCase().includes(filters.college!.toLowerCase()));
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        events = events.filter(event => 
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
    }
    
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getEvent(id: string): Promise<Event | null> {
    await this.delay();
    const events = this.getFromStorage<Event>('events', this.getDefaultEvents());
    return events.find(event => event.id === id) || null;
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    await this.delay();
    const events = this.getFromStorage<Event>('events', this.getDefaultEvents());
    
    const newEvent: Event = {
      ...eventData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    events.push(newEvent);
    this.saveToStorage('events', events);
    
    showToast.events.createSuccess(newEvent.title);
    return newEvent;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    await this.delay();
    const events = this.getFromStorage<Event>('events', this.getDefaultEvents());
    const index = events.findIndex(event => event.id === id);
    
    if (index === -1) throw new Error('Event not found');
    
    events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToStorage('events', events);
    
    showToast.events.updateSuccess();
    return events[index];
  }

  // Users API
  async getUsers(): Promise<User[]> {
    await this.delay();
    return this.getFromStorage<User>('users', this.getDefaultUsers());
  }

  async getUser(id: string): Promise<User | null> {
    await this.delay();
    const users = this.getFromStorage<User>('users', this.getDefaultUsers());
    return users.find(user => user.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.delay();
    const users = this.getFromStorage<User>('users', this.getDefaultUsers());
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...updates };
    this.saveToStorage('users', users);
    
    return users[index];
  }

  // Registrations API
  async registerForEvent(userId: string, eventId: string): Promise<Registration> {
    await this.delay();
    const registrations = this.getFromStorage<Registration>('registrations', []);
    
    // Check if already registered
    const existing = registrations.find(r => r.userId === userId && r.eventId === eventId);
    if (existing) {
      throw new Error('Already registered for this event');
    }
    
    const registration: Registration = {
      id: this.generateId(),
      userId,
      eventId,
      status: 'confirmed',
      paymentStatus: 'completed',
      registeredAt: new Date().toISOString(),
      checkedIn: false,
    };
    
    registrations.push(registration);
    this.saveToStorage('registrations', registrations);
    
    // Update event registration count
    const events = this.getFromStorage<Event>('events', []);
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      events[eventIndex].registered += 1;
      this.saveToStorage('events', events);
    }
    
    showToast.events.registrationSuccess('event');
    return registration;
  }

  async getUserRegistrations(userId: string): Promise<(Registration & { event: Event })[]> {
    await this.delay();
    const registrations = this.getFromStorage<Registration>('registrations', []);
    const events = this.getFromStorage<Event>('events', this.getDefaultEvents());
    
    return registrations
      .filter(reg => reg.userId === userId)
      .map(reg => ({
        ...reg,
        event: events.find(e => e.id === reg.eventId)!
      }))
      .filter(reg => reg.event); // Filter out registrations for deleted events
  }

  // Tickets API
  async generateTicket(registrationId: string): Promise<Ticket> {
    await this.delay();
    const registrations = this.getFromStorage<Registration>('registrations', []);
    const registration = registrations.find(r => r.id === registrationId);
    
    if (!registration) throw new Error('Registration not found');
    
    const tickets = this.getFromStorage<Ticket>('tickets', []);
    const existingTicket = tickets.find(t => t.registrationId === registrationId);
    
    if (existingTicket) return existingTicket;
    
    const ticket: Ticket = {
      id: this.generateId(),
      eventId: registration.eventId,
      userId: registration.userId,
      registrationId,
      qrCode: this.generateQRCode(),
      status: 'valid',
      generatedAt: new Date().toISOString(),
    };
    
    tickets.push(ticket);
    this.saveToStorage('tickets', tickets);
    
    // Update registration with ticket ID
    const regIndex = registrations.findIndex(r => r.id === registrationId);
    if (regIndex !== -1) {
      registrations[regIndex].ticketId = ticket.id;
      this.saveToStorage('registrations', registrations);
    }
    
    return ticket;
  }

  async verifyTicket(qrCode: string): Promise<{ valid: boolean; ticket?: Ticket; event?: Event; user?: User }> {
    await this.delay();
    const tickets = this.getFromStorage<Ticket>('tickets', []);
    const ticket = tickets.find(t => t.qrCode === qrCode);
    
    if (!ticket) return { valid: false };
    
    if (ticket.status !== 'valid') return { valid: false };
    
    const events = this.getFromStorage<Event>('events', []);
    const users = this.getFromStorage<User>('users', []);
    const event = events.find(e => e.id === ticket.eventId);
    const user = users.find(u => u.id === ticket.userId);
    
    return { valid: true, ticket, event, user };
  }

  async checkInTicket(qrCode: string): Promise<boolean> {
    await this.delay();
    const tickets = this.getFromStorage<Ticket>('tickets', []);
    const ticketIndex = tickets.findIndex(t => t.qrCode === qrCode);
    
    if (ticketIndex === -1) return false;
    
    if (tickets[ticketIndex].status !== 'valid') return false;
    
    tickets[ticketIndex].status = 'used';
    tickets[ticketIndex].usedAt = new Date().toISOString();
    this.saveToStorage('tickets', tickets);
    
    // Update registration check-in status
    const registrations = this.getFromStorage<Registration>('registrations', []);
    const regIndex = registrations.findIndex(r => r.id === tickets[ticketIndex].registrationId);
    if (regIndex !== -1) {
      registrations[regIndex].checkedIn = true;
      registrations[regIndex].checkedInAt = new Date().toISOString();
      this.saveToStorage('registrations', registrations);
    }
    
    showToast.crew.checkinSuccess('attendee');
    return true;
  }

  // Helper methods
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private generateQRCode(): string {
    return 'QR_' + Math.random().toString(36).substr(2, 12).toUpperCase();
  }

  private getDefaultEvents(): Event[] {
    return [
      {
        id: 'evt_techfest2024',
        title: 'TechFest 2024',
        description: 'The biggest technical festival showcasing innovation, robotics, AI competitions, and tech talks by industry leaders.',
        type: 'fest',
        date: '2024-03-15',
        time: '09:00',
        venue: 'Main Campus',
        college: 'IIT Delhi',
        organizer: 'Tech Club IIT Delhi',
        organizerId: 'org_tech_iitd',
        price: 299,
        capacity: 500,
        registered: 245,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        tags: ['technology', 'robotics', 'AI', 'competition'],
        requirements: ['Student ID', 'Laptop (for coding events)'],
        prizes: ['₹50,000 Grand Prize', 'Internship Opportunities', 'Certificates'],
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-15T00:00:00Z',
      },
      {
        id: 'evt_cultural2024',
        title: 'Cultural Extravaganza 2024',
        description: 'A vibrant celebration of arts, music, dance, and cultural performances from around the world.',
        type: 'cultural',
        date: '2024-03-20',
        time: '18:00',
        venue: 'Auditorium',
        college: 'Delhi University',
        organizer: 'Cultural Society DU',
        organizerId: 'org_cultural_du',
        price: 199,
        capacity: 300,
        registered: 156,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        tags: ['cultural', 'music', 'dance', 'arts'],
        requirements: ['College ID'],
        prizes: ['Trophies', 'Certificates', 'Cultural Scholarships'],
        createdAt: '2024-02-05T00:00:00Z',
        updatedAt: '2024-02-18T00:00:00Z',
      },
      {
        id: 'evt_hackathon2024',
        title: 'Code Warriors Hackathon',
        description: '48-hour coding marathon to build innovative solutions for real-world problems.',
        type: 'hackathon',
        date: '2024-03-25',
        time: '08:00',
        venue: 'Computer Lab',
        college: 'BITS Pilani',
        organizer: 'Coding Club BITS',
        organizerId: 'org_coding_bits',
        price: 0,
        capacity: 200,
        registered: 89,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800',
        tags: ['coding', 'hackathon', 'programming', 'innovation'],
        requirements: ['Laptop', 'Programming Knowledge', 'Team of 2-4'],
        prizes: ['₹1,00,000 Prize Pool', 'Job Opportunities', 'Mentorship'],
        createdAt: '2024-02-10T00:00:00Z',
        updatedAt: '2024-02-20T00:00:00Z',
      }
    ];
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: 'user_student1',
        name: 'Alex Johnson',
        email: 'student@demo.com',
        role: 'student',
        college: 'IIT Delhi',
        phone: '+91 9876543210',
        interests: ['technology', 'sports', 'music'],
        location: 'Delhi',
        verified: true,
        createdAt: '2024-01-15T00:00:00Z',
      },
      {
        id: 'user_organizer1',
        name: 'Sarah Wilson',
        email: 'organizer@demo.com',
        role: 'organizer',
        college: 'IIT Delhi',
        verified: true,
        createdAt: '2024-01-10T00:00:00Z',
      },
      {
        id: 'user_crew1',
        name: 'Mike Chen',
        email: 'crew@demo.com',
        role: 'crew',
        college: 'IIT Delhi',
        verified: true,
        createdAt: '2024-01-20T00:00:00Z',
      },
      {
        id: 'user_admin1',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin',
        verified: true,
        createdAt: '2024-01-01T00:00:00Z',
      }
    ];
  }
}

// Export singleton instance
export const api = new MockAPI();

// Real-time data hooks
export function useRealTimeEvents() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (error) {
        showToast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  return { events, loading, refetch: () => api.getEvents().then(setEvents) };
}

// Import React for hooks
import React from 'react';