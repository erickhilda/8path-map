import { useSetAtom } from 'jotai';
import { addAlertAtom, removeAlertAtom, clearAlertsAtom, type AlertType } from '../lib/alert';

export const useAlert = () => {
  const addAlert = useSetAtom(addAlertAtom);
  const removeAlert = useSetAtom(removeAlertAtom);
  const clearAlerts = useSetAtom(clearAlertsAtom);

  const showAlert = (
    title: string,
    description: string,
    type: AlertType = 'default'
  ) => {
    addAlert({ title, description, type });
  };

  const showSuccess = (title: string, description: string) => {
    showAlert(title, description, 'success');
  };

  const showError = (title: string, description: string) => {
    showAlert(title, description, 'destructive');
  };

  const showWarning = (title: string, description: string) => {
    showAlert(title, description, 'warning');
  };

  const showInfo = (title: string, description: string) => {
    showAlert(title, description, 'default');
  };

  return {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
    clearAlerts,
  };
}; 