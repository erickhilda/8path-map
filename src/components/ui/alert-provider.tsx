import { useAtomValue } from 'jotai';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { alertsAtom, removeAlertAtom } from '../../lib/alert';
import { useSetAtom } from 'jotai';
import { PiCheck, PiInfo, PiWarning, PiX } from 'react-icons/pi';

export const AlertProvider = () => {
  const alerts = useAtomValue(alertsAtom);
  const removeAlert = useSetAtom(removeAlertAtom);

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'default'; // We'll add custom styling for success
      case 'warning':
        return 'default'; // We'll add custom styling for warning
      default:
        return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <PiCheck className="w-4 h-4" />;
      case 'warning':
        return <PiWarning className="w-4 h-4" />;
      case 'destructive':
        return <PiX className="w-4 h-4" />;
      default:
        return <PiInfo className="w-4 h-4" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 text-green-700 bg-green-50 dark:border-green-500 dark:text-green-400 dark:bg-green-950/20';
      case 'warning':
        return 'border-yellow-500/50 text-yellow-700 bg-yellow-50 dark:border-yellow-500 dark:text-yellow-400 dark:bg-yellow-950/20';
      default:
        return '';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[2000] space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={getAlertVariant(alert.type)}
          className={`${getAlertStyles(alert.type)} relative`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <AlertTitle className="flex items-center gap-2">
                <span className="text-lg">{getAlertIcon(alert.type)}</span>
                {alert.title}
              </AlertTitle>
              <AlertDescription className="mt-1">
                {alert.description}
              </AlertDescription>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-2 p-1 hover:bg-black/10 rounded transition-colors"
              aria-label="Close alert"
            >
              <PiX className="w-4 h-4" />
            </button>
          </div>
        </Alert>
      ))}
    </div>
  );
}; 