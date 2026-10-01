import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

/**
 * Modal confirmation built on the native <dialog>, which gives us focus
 * trapping, Esc-to-close and the top layer without a dialog library.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      // A click on the backdrop lands on the <dialog> itself.
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
      className="border-whd-border bg-whd-surface m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border p-6 text-white shadow-xl backdrop:bg-black/70"
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-whd-text-muted mt-2 text-sm leading-relaxed">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
