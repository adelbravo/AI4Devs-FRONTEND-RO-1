import { NotificationType } from '../components/NotificationToast';

// Define the notification event types
export interface NotificationEvent {
  show: boolean;
  message: string;
  type: NotificationType;
  duration?: number;
}

// Create a custom event type for notifications
export const NOTIFICATION_EVENT = 'app-notification';

/**
 * NotificationService class
 * Provides methods to show different types of notifications across the application
 * Uses custom events to communicate with the NotificationProvider component
 */
class NotificationService {
  /**
   * Show a success notification
   * @param message - The message to display
   * @param duration - How long to show the notification (in milliseconds)
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.showNotification({
      show: true,
      message,
      type: 'success',
      duration
    });
    
    // Log success for debugging purposes
    console.debug(`[Notification] Success: ${message}`);
  }

  /**
   * Show an error notification
   * @param message - The error message to display
   * @param duration - How long to show the notification (in milliseconds)
   */
  showError(message: string, duration: number = 5000): void {
    this.showNotification({
      show: true,
      message,
      type: 'danger',
      duration
    });
    
    // Log error for debugging purposes
    console.error(`[Notification] Error: ${message}`);
  }

  /**
   * Show a warning notification
   * @param message - The warning message to display
   * @param duration - How long to show the notification (in milliseconds)
   */
  showWarning(message: string, duration: number = 4000): void {
    this.showNotification({
      show: true,
      message,
      type: 'warning',
      duration
    });
    
    // Log warning for debugging purposes
    console.warn(`[Notification] Warning: ${message}`);
  }

  /**
   * Show an info notification
   * @param message - The info message to display
   * @param duration - How long to show the notification (in milliseconds)
   */
  showInfo(message: string, duration: number = 3000): void {
    this.showNotification({
      show: true,
      message,
      type: 'info',
      duration
    });
    
    // Log info for debugging purposes
    console.info(`[Notification] Info: ${message}`);
  }

  /**
   * Show a notification for API operations
   * @param promise - The promise to monitor
   * @param loadingMessage - Message to show while loading
   * @param successMessage - Message to show on success
   * @param errorMessage - Message to show on error (can be a function that receives the error)
   * @returns The original promise
   */
  async trackPromise<T>(
    promise: Promise<T>, 
    loadingMessage: string = 'Procesando...', 
    successMessage: string = 'Operación completada con éxito', 
    errorMessage: string | ((error: any) => string) = 'Ha ocurrido un error'
  ): Promise<T> {
    try {
      // Show loading notification
      this.showWarning(loadingMessage);
      
      // Wait for the promise to resolve
      const result = await promise;
      
      // Show success notification
      this.showSuccess(successMessage);
      
      return result;
    } catch (error) {
      // Determine error message
      const finalErrorMessage = typeof errorMessage === 'function' 
        ? errorMessage(error) 
        : errorMessage;
      
      // Show error notification
      this.showError(finalErrorMessage);
      
      // Re-throw the error to allow further handling
      throw error;
    }
  }

  /**
   * Generic method to show any type of notification
   * @param notification - The notification configuration
   */
  showNotification(notification: NotificationEvent): void {
    // Dispatch a custom event that will be caught by the NotificationProvider
    const event = new CustomEvent(NOTIFICATION_EVENT, { 
      detail: notification 
    });
    document.dispatchEvent(event);
  }
}

// Export a singleton instance
export const notificationService = new NotificationService();
export default notificationService;