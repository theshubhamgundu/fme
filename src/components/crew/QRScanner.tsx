import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Camera, 
  X, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  MapPin,
  AlertTriangle,
  RefreshCw,
  Scan
} from 'lucide-react';
import { api, Event, Ticket } from '../../utils/api';
import { toast } from '../../utils/toast';

// Define User interface locally since it's not exported from api
interface User {
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

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess?: (ticket: Ticket, event: Event, user: User) => void;
}

interface ScanResult {
  valid: boolean;
  ticket?: Ticket;
  event?: Event;
  user?: User;
  message?: string;
}

export function QRScanner({ onClose, onScanSuccess }: QRScannerProps) {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulate camera access
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // Simulate camera initialization
      setScanning(true);
      toast.success('Camera initialized. Use manual input or scan simulation.');
    } catch (error) {
      toast.error('Failed to access camera. Use manual QR code input.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  const handleScan = async (qrCode: string) => {
    if (!qrCode.trim()) {
      toast.error('Please enter a QR code');
      return;
    }

    try {
      // Verify the ticket
      const result = await api.verifyTicket(qrCode);
      
      if (result.valid && result.ticket && result.event && result.user) {
        // Check if already used
        if (result.ticket.status === 'used') {
          const scanResult: ScanResult = {
            valid: false,
            ticket: result.ticket,
            event: result.event,
            user: result.user,
            message: 'Ticket already used'
          };
          setLastScanResult(scanResult);
          setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
          toast.error('Ticket has already been used!');
          return;
        }

        // Valid ticket - check it in
        const checkedIn = await api.checkInTicket(qrCode);
        
        if (checkedIn) {
          const scanResult: ScanResult = {
            valid: true,
            ticket: result.ticket,
            event: result.event,
            user: result.user,
            message: 'Check-in successful'
          };
          
          setLastScanResult(scanResult);
          setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
          onScanSuccess?.(result.ticket, result.event, result.user);
          toast.success(`Welcome ${result.user.name}! Check-in successful.`);
        } else {
          toast.error('Failed to check in ticket');
        }
      } else {
        const scanResult: ScanResult = {
          valid: false,
          message: 'Invalid or expired ticket'
        };
        setLastScanResult(scanResult);
        setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
        toast.error('Invalid QR code or ticket not found');
      }
    } catch (error) {
      toast.error('Error verifying ticket');
      console.error('Scan error:', error);
    }

    setManualCode('');
  };

  const simulateScan = () => {
    // Generate a test QR code for demonstration
    const testCodes = [
      'QR_VALID123TEST',
      'QR_USED456TEST',
      'QR_INVALID789TEST'
    ];
    const randomCode = testCodes[Math.floor(Math.random() * testCodes.length)];
    setManualCode(randomCode);
    toast.info('Simulated QR scan - click Verify to test');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Scan size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">QR Ticket Scanner</h2>
              <p className="text-sm text-muted-foreground">Scan tickets for event entry</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera size={20} />
                  <span>Camera Scanner</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera preview placeholder */}
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {scanning ? (
                    <div className="text-center">
                      <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                        <div className="absolute inset-2 border border-green-300 rounded animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <Scan size={32} className="text-green-500 animate-pulse" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">Position QR code within frame</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-muted-foreground">Camera not active</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  {!scanning ? (
                    <Button onClick={startCamera} className="flex-1">
                      <Camera size={16} className="mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="outline" className="flex-1">
                      <X size={16} className="mr-2" />
                      Stop Camera
                    </Button>
                  )}
                  <Button onClick={simulateScan} variant="outline">
                    <RefreshCw size={16} className="mr-2" />
                    Simulate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Input */}
            <Card>
              <CardHeader>
                <CardTitle>Manual QR Code Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter QR code manually..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScan(manualCode)}
                  />
                  <Button onClick={() => handleScan(manualCode)}>
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this if camera scanning is not available
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {/* Latest Scan Result */}
            {lastScanResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {lastScanResult.valid ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                    <span>Scan Result</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lastScanResult.valid && lastScanResult.ticket && lastScanResult.event && lastScanResult.user ? (
                    <div className="space-y-3">
                      <Badge className="bg-green-600">Valid Ticket</Badge>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-500" />
                          <span className="font-medium">{lastScanResult.user.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span>{lastScanResult.event.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{lastScanResult.event.venue}</span>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                          ✓ Check-in successful
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Badge variant="destructive">Invalid Ticket</Badge>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle size={16} className="text-red-500" />
                          <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                            {lastScanResult.message || 'Ticket verification failed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Scan History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                {scanHistory.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {scanHistory.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                          result.valid 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : 'bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {result.valid ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <XCircle size={14} className="text-red-500" />
                          )}
                          <span>
                            {result.user?.name || 'Unknown'} - {result.event?.title || 'Invalid'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No scans yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {scanHistory.filter(s => s.valid).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Valid Scans</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {scanHistory.filter(s => !s.valid).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Invalid Scans</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}