"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Modal, Button, Input } from "@/components/ui";

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteConfirmation: string;
  setDeleteConfirmation: (value: string) => void;
  onConfirmDelete: () => void;
  deletingAccount: boolean;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  deleteConfirmation,
  setDeleteConfirmation,
  onConfirmDelete,
  deletingAccount,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus Akun"
      description="Tindakan ini akan menghapus akun dan seluruh data Anda secara permanen dari sistem."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <p className="mb-2">
            Ketik kata <strong className="text-rose-600 dark:text-rose-400 font-mono">HAPUS</strong> untuk mengonfirmasi:
          </p>
          <Input
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="HAPUS"
            className="font-mono"
            autoFocus
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={deletingAccount}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={deleteConfirmation.trim().toUpperCase() !== "HAPUS" || deletingAccount}
            onClick={onConfirmDelete}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            {deletingAccount ? "Menghapus..." : "Hapus Permanen"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
