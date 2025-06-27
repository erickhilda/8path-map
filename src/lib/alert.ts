import { atom } from 'jotai';

export type AlertType = 'default' | 'destructive' | 'success' | 'warning';

export interface AlertData {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  timestamp: number;
}

// Atom to store all active alerts
export const alertsAtom = atom<AlertData[]>([]);

// Atom to generate unique IDs for alerts
export const alertIdCounterAtom = atom(0);

// Helper function to generate unique alert ID
const generateAlertId = (counter: number) => `alert-${counter}`;

// Function to add a new alert
export const addAlertAtom = atom(
  null,
  (get, set, alert: Omit<AlertData, 'id' | 'timestamp'>) => {
    const currentAlerts = get(alertsAtom);
    const counter = get(alertIdCounterAtom);
    const newAlert: AlertData = {
      ...alert,
      id: generateAlertId(counter),
      timestamp: Date.now(),
    };
    
    set(alertsAtom, [...currentAlerts, newAlert]);
    set(alertIdCounterAtom, counter + 1);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
      set(removeAlertAtom, newAlert.id);
    }, 5000);
  }
);

// Function to remove an alert by ID
export const removeAlertAtom = atom(
  null,
  (get, set, alertId: string) => {
    const currentAlerts = get(alertsAtom);
    set(alertsAtom, currentAlerts.filter(alert => alert.id !== alertId));
  }
);

// Function to clear all alerts
export const clearAlertsAtom = atom(
  null,
  (get, set) => {
    set(alertsAtom, []);
  }
); 