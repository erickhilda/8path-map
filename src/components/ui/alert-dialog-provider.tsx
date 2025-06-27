import { useAtomValue, useSetAtom } from 'jotai';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';
import { 
  alertDialogAtom, 
  confirmAlertDialogAtom, 
  cancelAlertDialogAtom 
} from '../../lib/alert-dialog';

export const AlertDialogProvider = () => {
  const dialog = useAtomValue(alertDialogAtom);
  const confirmDialog = useSetAtom(confirmAlertDialogAtom);
  const cancelDialog = useSetAtom(cancelAlertDialogAtom);

  if (!dialog) return null;

  return (
    <AlertDialog open={true} onOpenChange={() => cancelDialog()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDialog}>
            {dialog.cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDialog}
            className={dialog.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {dialog.actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 