import { toast } from 'sonner@2.0.3';

// Toast utility functions with consistent styling and behavior
export const showToast = {
  success: (message: string, options?: { duration?: number; id?: string }) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      id: options?.id,
      style: {
        background: '#10b981',
        color: 'white',
        border: 'none'
      }
    });
  },

  error: (message: string, options?: { duration?: number; id?: string }) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      id: options?.id,
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none'
      }
    });
  },

  loading: (message: string, options?: { id?: string }) => {
    return toast.loading(message, {
      id: options?.id,
      style: {
        background: '#6366f1',
        color: 'white',
        border: 'none'
      }
    });
  },

  info: (message: string, options?: { duration?: number; id?: string }) => {
    return toast.info(message, {
      duration: options?.duration || 4000,
      id: options?.id,
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none'
      }
    });
  },

  warning: (message: string, options?: { duration?: number; id?: string }) => {
    return toast.warning(message, {
      duration: options?.duration || 4000,
      id: options?.id,
      style: {
        background: '#f59e0b',
        color: 'white',
        border: 'none'
      }
    });
  },

  // Specific toast messages for common actions
  auth: {
    loginSuccess: (name?: string) => 
      showToast.success(`Welcome back${name ? `, ${name}` : ''}! 🎉`),
    loginError: () => 
      showToast.error('Login failed. Please check your credentials.'),
    signupSuccess: () => 
      showToast.success('Account created successfully! Welcome to FindMyEvent! 🎉'),
    signupError: (error?: string) => 
      showToast.error(error || 'Failed to create account. Please try again.'),
    logoutSuccess: () => 
      showToast.info('You have been logged out successfully.'),
    sessionExpired: () => 
      showToast.warning('Your session has expired. Please log in again.')
  },

  events: {
    registrationSuccess: (eventName: string) => 
      showToast.success(`Successfully registered for ${eventName}! 🎫`),
    registrationError: () => 
      showToast.error('Failed to register for event. Please try again.'),
    createSuccess: (eventName: string) => 
      showToast.success(`Event "${eventName}" created successfully! 🎉`),
    createError: () => 
      showToast.error('Failed to create event. Please check all required fields.'),
    updateSuccess: () => 
      showToast.success('Event updated successfully!'),
    updateError: () => 
      showToast.error('Failed to update event. Please try again.'),
    deleteSuccess: () => 
      showToast.success('Event deleted successfully.'),
    deleteError: () => 
      showToast.error('Failed to delete event. Please try again.')
  },

  payment: {
    processing: () => 
      showToast.loading('Processing your payment...', { id: 'payment' }),
    success: (amount: number) => 
      showToast.success(`Payment of ₹${amount} completed successfully! 💳`, { id: 'payment' }),
    failed: () => 
      showToast.error('Payment failed. Please try again or use a different payment method.', { id: 'payment' }),
    cancelled: () => 
      showToast.info('Payment cancelled.', { id: 'payment' })
  },

  profile: {
    updateSuccess: () => 
      showToast.success('Profile updated successfully!'),
    updateError: () => 
      showToast.error('Failed to update profile. Please try again.'),
    photoUploadSuccess: () => 
      showToast.success('Profile photo updated successfully!'),
    photoUploadError: () => 
      showToast.error('Failed to upload photo. Please try again.')
  },

  verification: {
    pending: () => 
      showToast.info('Verification submitted. We will review your documents within 24-48 hours.'),
    approved: () => 
      showToast.success('Congratulations! Your organizer account has been verified! 🎉'),
    rejected: (reason?: string) => 
      showToast.error(`Verification rejected${reason ? `: ${reason}` : '. Please resubmit with correct documents.'}`),
    documentsUploaded: () => 
      showToast.success('Documents uploaded successfully!')
  },

  crew: {
    checkinSuccess: (attendeeName: string) => 
      showToast.success(`${attendeeName} checked in successfully! ✅`),
    checkinError: () => 
      showToast.error('Failed to check in attendee. Please try again.'),
    scanError: () => 
      showToast.error('Invalid QR code. Please try scanning again.'),
    alreadyCheckedIn: (attendeeName: string) => 
      showToast.warning(`${attendeeName} is already checked in.`)
  },

  admin: {
    organizerApproved: (organizerName: string) => 
      showToast.success(`${organizerName} has been approved as an organizer.`),
    organizerRejected: (organizerName: string) => 
      showToast.info(`${organizerName}'s organizer application has been rejected.`),
    eventModerated: (action: 'approved' | 'rejected', eventName: string) => 
      showToast.success(`Event "${eventName}" has been ${action}.`)
  },

  network: {
    offline: () => 
      showToast.warning('You are offline. Some features may not work properly.'),
    online: () => 
      showToast.info('You are back online!'),
    slowConnection: () => 
      showToast.warning('Slow internet connection detected. Please be patient.'),
    serverError: () => 
      showToast.error('Server error occurred. Please try again later.')
  }
};

// Export individual toast functions for backward compatibility
export const { success, error, loading, info, warning } = showToast;

// Export raw toast for direct usage
export { toast } from 'sonner@2.0.3';