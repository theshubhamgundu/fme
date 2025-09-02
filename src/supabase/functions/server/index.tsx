import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Types
interface Event {
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

interface User {
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

interface Registration {
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

interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  registrationId: string;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
  generatedAt: string;
  usedAt?: string;
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function generateQRCode(): string {
  return 'QR_' + Math.random().toString(36).substr(2, 12).toUpperCase();
}

// Validation helper
function validateAuth(request: Request): string | null {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  return accessToken === Deno.env.get('SUPABASE_ANON_KEY') ? 'valid' : null;
}

// Initialize default data
async function initializeDefaultData() {
  try {
    // Check if data already exists
    const existingEvents = await kv.get('events');
    if (existingEvents) return;

    // Create default events
    const defaultEvents: Event[] = [
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

    // Create default users
    const defaultUsers: User[] = [
      {
        id: 'user_student1',
        name: 'Alex Johnson',
        email: 'student@demo.com',
        type: 'student',
        college: 'IIT Delhi',
        phone: '+91 9876543210',
        interests: ['technology', 'sports', 'music'],
        location: 'Delhi',
        verified: true,
        isOnboarded: true,
        year: '3rd Year',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      {
        id: 'user_organizer1',
        name: 'Sarah Wilson',
        email: 'organizer@demo.com',
        type: 'organizer',
        college: 'IIT Delhi',
        verified: true,
        isOnboarded: true,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
      },
      {
        id: 'user_crew1',
        name: 'Mike Chen',
        email: 'crew@demo.com',
        type: 'crew',
        college: 'IIT Delhi',
        verified: true,
        isOnboarded: true,
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z',
      },
      {
        id: 'user_admin1',
        name: 'Admin User',
        email: 'admin@demo.com',
        type: 'admin',
        verified: true,
        isOnboarded: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
    ];

    // Store default data
    await kv.set('events', defaultEvents);
    await kv.set('users', defaultUsers);
    await kv.set('registrations', []);
    await kv.set('tickets', []);

    console.log('Default data initialized successfully');
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

// Initialize data on startup
initializeDefaultData();

// Health check endpoint
app.get("/make-server-a833dcda/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post("/make-server-a833dcda/auth/signup", async (c) => {
  try {
    const { email, password, name, type } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, type },
      email_confirm: true // Automatically confirm since email server isn't configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in our data store
    const newUser: User = {
      id: data.user.id,
      name,
      email,
      type,
      verified: false,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const users = await kv.get('users') || [];
    users.push(newUser);
    await kv.set('users', users);

    return c.json({ user: newUser });
  } catch (error) {
    console.error('Signup error during user creation:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Events endpoints
app.get("/make-server-a833dcda/events", async (c) => {
  try {
    const query = c.req.query();
    const events = await kv.get('events') || [];
    
    let filteredEvents = [...events];
    
    // Apply filters
    if (query.type && query.type !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.type === query.type);
    }
    if (query.college) {
      filteredEvents = filteredEvents.filter(event => 
        event.college.toLowerCase().includes(query.college.toLowerCase())
      );
    }
    if (query.search) {
      const search = query.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(search) ||
        event.description.toLowerCase().includes(search) ||
        event.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    // Sort by date
    filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return c.json({ events: filteredEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

app.get("/make-server-a833dcda/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const events = await kv.get('events') || [];
    const event = events.find(e => e.id === id);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    return c.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
});

app.post("/make-server-a833dcda/events", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const eventData = await c.req.json();
    const events = await kv.get('events') || [];
    
    const newEvent: Event = {
      ...eventData,
      id: generateId(),
      registered: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    events.push(newEvent);
    await kv.set('events', events);
    
    return c.json({ event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

app.put("/make-server-a833dcda/events/:id", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    const events = await kv.get('events') || [];
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    events[index] = { 
      ...events[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    await kv.set('events', events);
    
    return c.json({ event: events[index] });
  } catch (error) {
    console.error('Error updating event:', error);
    return c.json({ error: 'Failed to update event' }, 500);
  }
});

// Users endpoints
app.get("/make-server-a833dcda/users/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const users = await kv.get('users') || [];
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

app.put("/make-server-a833dcda/users/:id", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updates = await c.req.json();
    const users = await kv.get('users') || [];
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    users[index] = { 
      ...users[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    await kv.set('users', users);
    
    return c.json({ user: users[index] });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Registration endpoints
app.post("/make-server-a833dcda/registrations", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { userId, eventId } = await c.req.json();
    const registrations = await kv.get('registrations') || [];
    const events = await kv.get('events') || [];
    
    // Check if already registered
    const existing = registrations.find(r => r.userId === userId && r.eventId === eventId);
    if (existing) {
      return c.json({ error: 'Already registered for this event' }, 400);
    }
    
    const registration: Registration = {
      id: generateId(),
      userId,
      eventId,
      status: 'confirmed',
      paymentStatus: 'completed',
      registeredAt: new Date().toISOString(),
      checkedIn: false,
    };
    
    registrations.push(registration);
    await kv.set('registrations', registrations);
    
    // Update event registration count
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      events[eventIndex].registered += 1;
      await kv.set('events', events);
    }
    
    return c.json({ registration });
  } catch (error) {
    console.error('Error creating registration:', error);
    return c.json({ error: 'Failed to register for event' }, 500);
  }
});

app.get("/make-server-a833dcda/users/:userId/registrations", async (c) => {
  try {
    const userId = c.req.param('userId');
    const registrations = await kv.get('registrations') || [];
    const events = await kv.get('events') || [];
    
    const userRegistrations = registrations
      .filter(reg => reg.userId === userId)
      .map(reg => ({
        ...reg,
        event: events.find(e => e.id === reg.eventId)
      }))
      .filter(reg => reg.event);
    
    return c.json({ registrations: userRegistrations });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return c.json({ error: 'Failed to fetch registrations' }, 500);
  }
});

// Ticket endpoints
app.post("/make-server-a833dcda/tickets", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { registrationId } = await c.req.json();
    const registrations = await kv.get('registrations') || [];
    const tickets = await kv.get('tickets') || [];
    
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) {
      return c.json({ error: 'Registration not found' }, 404);
    }
    
    // Check if ticket already exists
    const existingTicket = tickets.find(t => t.registrationId === registrationId);
    if (existingTicket) {
      return c.json({ ticket: existingTicket });
    }
    
    const ticket: Ticket = {
      id: generateId(),
      eventId: registration.eventId,
      userId: registration.userId,
      registrationId,
      qrCode: generateQRCode(),
      status: 'valid',
      generatedAt: new Date().toISOString(),
    };
    
    tickets.push(ticket);
    await kv.set('tickets', tickets);
    
    // Update registration with ticket ID
    const regIndex = registrations.findIndex(r => r.id === registrationId);
    if (regIndex !== -1) {
      registrations[regIndex].ticketId = ticket.id;
      await kv.set('registrations', registrations);
    }
    
    return c.json({ ticket });
  } catch (error) {
    console.error('Error generating ticket:', error);
    return c.json({ error: 'Failed to generate ticket' }, 500);
  }
});

app.post("/make-server-a833dcda/tickets/verify", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { qrCode } = await c.req.json();
    const tickets = await kv.get('tickets') || [];
    const events = await kv.get('events') || [];
    const users = await kv.get('users') || [];
    
    const ticket = tickets.find(t => t.qrCode === qrCode);
    if (!ticket || ticket.status !== 'valid') {
      return c.json({ valid: false });
    }
    
    const event = events.find(e => e.id === ticket.eventId);
    const user = users.find(u => u.id === ticket.userId);
    
    return c.json({ valid: true, ticket, event, user });
  } catch (error) {
    console.error('Error verifying ticket:', error);
    return c.json({ error: 'Failed to verify ticket' }, 500);
  }
});

app.post("/make-server-a833dcda/tickets/checkin", async (c) => {
  try {
    if (!validateAuth(c.req)) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { qrCode } = await c.req.json();
    const tickets = await kv.get('tickets') || [];
    const registrations = await kv.get('registrations') || [];
    
    const ticketIndex = tickets.findIndex(t => t.qrCode === qrCode);
    if (ticketIndex === -1 || tickets[ticketIndex].status !== 'valid') {
      return c.json({ success: false, error: 'Invalid ticket' });
    }
    
    // Mark ticket as used
    tickets[ticketIndex].status = 'used';
    tickets[ticketIndex].usedAt = new Date().toISOString();
    await kv.set('tickets', tickets);
    
    // Update registration check-in status
    const regIndex = registrations.findIndex(r => r.id === tickets[ticketIndex].registrationId);
    if (regIndex !== -1) {
      registrations[regIndex].checkedIn = true;
      registrations[regIndex].checkedInAt = new Date().toISOString();
      await kv.set('registrations', registrations);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error checking in ticket:', error);
    return c.json({ error: 'Failed to check in ticket' }, 500);
  }
});

Deno.serve(app.fetch);