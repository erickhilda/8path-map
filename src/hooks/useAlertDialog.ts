import { useSetAtom } from 'jotai';
import { 
  showAlertDialogAtom, 
  hideAlertDialogAtom, 
  confirmAlertDialogAtom, 
  cancelAlertDialogAtom,
} from '../lib/alert-dialog';

export const useAlertDialog = () => {
  const showAlertDialog = useSetAtom(showAlertDialogAtom);
  const hideAlertDialog = useSetAtom(hideAlertDialogAtom);
  const confirmAlertDialog = useSetAtom(confirmAlertDialogAtom);
  const cancelAlertDialog = useSetAtom(cancelAlertDialogAtom);

  const showConfirm = (
    title: string,
    description: string,
    actionLabel: string,
    onConfirm: () => void,
    options?: {
      cancelLabel?: string;
      variant?: 'default' | 'destructive';
      onCancel?: () => void;
    }
  ) => {
    showAlertDialog({
      title,
      description,
      actionLabel,
      onConfirm,
      ...options,
    });
  };

  const showDeleteConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    options?: {
      cancelLabel?: string;
      onCancel?: () => void;
    }
  ) => {
    showConfirm(
      title,
      description,
      'Delete',
      onConfirm,
      {
        variant: 'destructive',
        ...options,
      }
    );
  };

  return {
    showConfirm,
    showDeleteConfirm,
    hideAlertDialog,
    confirmAlertDialog,
    cancelAlertDialog,
  };
}; 