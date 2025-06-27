import { atom } from 'jotai';

export interface AlertDialogData {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel?: () => void;
}

// Atom to store the current alert dialog
export const alertDialogAtom = atom<AlertDialogData | null>(null);

// Atom to generate unique IDs for alert dialogs
export const alertDialogIdCounterAtom = atom(0);

// Helper function to generate unique alert dialog ID
const generateAlertDialogId = (counter: number) => `alert-dialog-${counter}`;

// Function to show an alert dialog
export const showAlertDialogAtom = atom(
  null,
  (get, set, dialog: Omit<AlertDialogData, 'id'>) => {
    const counter = get(alertDialogIdCounterAtom);
    const newDialog: AlertDialogData = {
      ...dialog,
      id: generateAlertDialogId(counter),
      cancelLabel: dialog.cancelLabel || 'Cancel',
      variant: dialog.variant || 'default',
    };
    
    set(alertDialogAtom, newDialog);
    set(alertDialogIdCounterAtom, counter + 1);
  }
);

// Function to hide the alert dialog
export const hideAlertDialogAtom = atom(
  null,
  (get, set) => {
    set(alertDialogAtom, null);
  }
);

// Function to confirm the alert dialog
export const confirmAlertDialogAtom = atom(
  null,
  (get, set) => {
    const dialog = get(alertDialogAtom);
    if (dialog) {
      dialog.onConfirm();
      set(alertDialogAtom, null);
    }
  }
);

// Function to cancel the alert dialog
export const cancelAlertDialogAtom = atom(
  null,
  (get, set) => {
    const dialog = get(alertDialogAtom);
    if (dialog) {
      if (dialog.onCancel) {
        dialog.onCancel();
      }
      set(alertDialogAtom, null);
    }
  }
); 