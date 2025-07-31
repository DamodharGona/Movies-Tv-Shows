import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleConfirm}
            variant="outline"
            className="flex-1 hover:cursor-pointer bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 hover:cursor-pointer"
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
