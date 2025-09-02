import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  User
} from 'lucide-react';

const platformStats = {
  totalUsers: 12500,
  totalOrganizers: 180,
  totalEvents: 450,
  totalRevenue: 2500000,
  pendingVerifications: 12,
  activeEvents: 45
};

const pendingOrganizers = [
  {
    id: '1',
    name: 'Tech Club IIT Delhi',
    email: 'tech@iitd.ac.in',
    college: 'IIT Delhi',
    submittedAt: '2024-02-20',
    documents: ['College ID', 'Club Authorization', 'Bank Details']
  },
  {
    id: '2',
    name: 'Cultural Society BITS',
    email: 'culture@bits.ac.in',
    college: 'BITS Pilani',
    submittedAt: '2024-02-22',
    documents: ['College ID', 'Club Authorization']
  }
];

const recentEvents = [
  {
    id: '1',
    title: 'TechFest 2024',
    organizer: 'Tech Club IIT Delhi',
    registrations: 245,
    status: 'live',
    revenue: 29500
  },
  {
    id: '2',
    title: 'Cultural Night',
    organizer: 'Cultural Society BITS',
    registrations: 150,
    status: 'upcoming',
    revenue: 15000
  }
];

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  const handleApproveOrganizer = (id: string) => {
    console.log('Approving organizer:', id);
  };

  const handleRejectOrganizer = (id: string) => {
    console.log('Rejecting organizer:', id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <Badge className="bg-red-600">
                <Shield size={12} className="mr-1" />
                Admin Access
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                System Settings
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
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        {user?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        {user?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
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
                  <DropdownMenuItem onClick={logout} className="text-red-600">
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
        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Users size={24} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Shield size={24} className="mx-auto mb-2 text-purple-600" />
                  <p className="text-xl font-bold">{platformStats.totalOrganizers}</p>
                  <p className="text-xs text-muted-foreground">Organizers</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Calendar size={24} className="mx-auto mb-2 text-green-600" />
                  <p className="text-xl font-bold">{platformStats.totalEvents}</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <DollarSign size={24} className="mx-auto mb-2 text-orange-600" />
                  <p className="text-xl font-bold">₹{(platformStats.totalRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertCircle size={24} className="mx-auto mb-2 text-yellow-600" />
                  <p className="text-xl font-bold">{platformStats.pendingVerifications}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp size={24} className="mx-auto mb-2 text-teal-600" />
                  <p className="text-xl font-bold">{platformStats.activeEvents}</p>
                  <p className="text-xs text-muted-foreground">Active Events</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h5 className="font-medium">{event.title}</h5>
                          <p className="text-sm text-muted-foreground">{event.organizer}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={event.status === 'live' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.registrations} registrations
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>System Status</span>
                      <Badge className="bg-green-600">
                        <CheckCircle size={12} className="mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Gateway</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Service</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <Badge className="bg-green-600">Healthy</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pending Organizer Verifications</h3>
              <Badge variant="destructive">
                {pendingOrganizers.length} pending
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingOrganizers.map((organizer) => (
                <motion.div
                  key={organizer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{organizer.name}</h4>
                          <p className="text-sm text-muted-foreground">{organizer.college}</p>
                          <p className="text-sm text-muted-foreground">{organizer.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(organizer.submittedAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {organizer.documents.map((doc) => (
                              <Badge key={doc} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproveOrganizer(organizer.id)}
                          >
                            <CheckCircle size={14} className="mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleRejectOrganizer(organizer.id)}
                          >
                            <XCircle size={14} className="mr-2" />
                            Reject
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText size={14} className="mr-2" />
                            Review Docs
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">All Platform Events</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search events..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Event management interface would be here</p>
                  <p className="text-sm">Search, filter, approve, and moderate all platform events</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search users..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter size={14} className="mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>User management interface would be here</p>
                  <p className="text-sm">Manage students, organizers, and crew members</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-lg font-semibold">Platform Analytics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 size={20} className="mr-2" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    User growth chart would be here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp size={20} className="mr-2" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Revenue analytics would be here
                  </div>
                </CardContent>
              </Card>
            </div>
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