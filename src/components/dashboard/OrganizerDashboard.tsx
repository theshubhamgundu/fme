import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Bell,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  FileText,
  LogOut,
  Moon,
  Sun,
  User
} from 'lucide-react';

const mockEvents = [
  {
    id: '1',
    title: 'TechFest 2024',
    type: 'fest',
    date: '2024-03-15',
    status: 'live',
    registered: 245,
    capacity: 500,
    revenue: 29500,
    isDraft: false
  },
  {
    id: '2',
    title: 'Code Warriors Hackathon',
    type: 'hackathon',
    date: '2024-03-20',
    status: 'upcoming',
    registered: 120,
    capacity: 150,
    revenue: 0,
    isDraft: false
  },
  {
    id: '3',
    title: 'AI Workshop Series',
    type: 'workshop',
    date: '2024-03-25',
    status: 'draft',
    registered: 0,
    capacity: 100,
    revenue: 0,
    isDraft: true
  }
];

export function OrganizerDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVerified] = useState(true); // Mock verification status

  const getStatusBadge = (status: string, isDraft: boolean) => {
    if (isDraft) {
      return <Badge variant="secondary">Draft</Badge>;
    }
    switch (status) {
      case 'live':
        return <Badge className="bg-green-600">Live</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-600">Upcoming</Badge>;
      case 'ended':
        return <Badge variant="outline">Ended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Organizer Dashboard
              </h1>
              {!isVerified && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>Pending Verification</span>
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="relative"
                >
                  <Bell size={16} className="mr-2" />
                  Notifications
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    2
                  </Badge>
                </Button>
              </div>
              
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => navigate('/create-event')}
              >
                <Plus size={16} className="mr-2" />
                Create Event
              </Button>
              
              {/* Direct Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => console.log('Profile button clicked')}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {user?.name?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[100]">
                  <div className="flex items-center justify-start space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {user?.name?.charAt(0) || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'Sarah Wilson'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || 'organizer@demo.com'}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => console.log('Profile clicked')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Settings clicked')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    Toggle Theme
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      console.log('Logout clicked');
                      logout();
                    }} 
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Verification Status */}
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Verification Pending
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Your documents are being reviewed. You can create events as drafts, but they won't be visible until verified.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Calendar size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{mockEvents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                    <p className="text-2xl font-bold">
                      {mockEvents.reduce((acc, event) => acc + event.registered, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <DollarSign size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ₹{mockEvents.reduce((acc, event) => acc + event.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <TrendingUp size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Fill Rate</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Events</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download size={14} className="mr-2" />
                  Export
                </Button>
                <Button onClick={() => navigate('/create-event')}>
                  <Plus size={14} className="mr-2" />
                  Create Event
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {mockEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)} • {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(event.status, event.isDraft)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye size={14} className="mr-2" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit size={14} className="mr-2" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 size={14} className="mr-2" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Registrations</span>
                            <span>{event.registered}/{event.capacity}</span>
                          </div>
                          <Progress value={(event.registered / event.capacity) * 100} className="h-2" />
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-lg font-semibold">₹{event.revenue.toLocaleString()}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Fill Rate</p>
                          <p className="text-lg font-semibold">
                            {Math.round((event.registered / event.capacity) * 100)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 size={20} className="mr-2" />
                    Registration Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Chart visualization would be here
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart size={20} className="mr-2" />
                    Event Types Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Pie chart would be here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendee Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select an event to view attendee details</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crew Tab */}
          <TabsContent value="crew" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Crew Management</h3>
              <Button>
                <Plus size={14} className="mr-2" />
                Add Crew Member
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No crew members added yet</p>
                  <p className="text-sm">Add crew members to help manage your events</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Organization Name</label>
                  <p className="text-sm text-muted-foreground">Tech Club - IIT Delhi</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <p className="text-sm text-muted-foreground">tech.club@iitd.ac.in</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Details</label>
                  <p className="text-sm text-muted-foreground">UPI: techclub@paytm • Bank: **** 1234</p>
                </div>
                <Button variant="outline">
                  <Settings size={14} className="mr-2" />
                  Edit Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={toggleTheme}
          size="lg"
          className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
          variant="outline"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="text-yellow-500" />
          ) : (
            <Moon size={20} className="text-blue-600" />
          )}
        </Button>
      </div>
    </div>
  );
}