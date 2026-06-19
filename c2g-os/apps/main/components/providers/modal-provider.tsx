'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { InteractiveModal } from '../ui/interactive-modal';

interface ModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

interface ModalState extends ModalOptions {
  isOpen: boolean;
  isConfirm: boolean;
  resolve?: (value: boolean | void) => void;
}

interface ModalContextType {
  showAlert: (options: ModalOptions) => Promise<void>;
  showConfirm: (options: ModalOptions) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isConfirm: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = useCallback((options: ModalOptions): Promise<void> => {
    return new Promise((resolve) => {
      setModalState({
        ...options,
        isOpen: true,
        isConfirm: false,
        resolve: () => resolve(),
      });
    });
  }, []);

  const showConfirm = useCallback((options: ModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        ...options,
        isOpen: true,
        isConfirm: true,
        resolve: (value) => resolve(value as boolean),
      });
    });
  }, []);

  const handleConfirm = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.resolve) {
      modalState.resolve(modalState.isConfirm ? true : undefined);
    }
  };

  const handleCancel = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.resolve) {
      modalState.resolve(modalState.isConfirm ? false : undefined);
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <InteractiveModal 
        isOpen={modalState.isOpen}
        isConfirm={modalState.isConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type || 'info'}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
