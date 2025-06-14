
import React from 'react';

interface CustomContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  children: React.ReactNode;
}

export const CustomContextMenu = ({ 
  isOpen, 
  onClose, 
  position, 
  children 
}: CustomContextMenuProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div 
        className="fixed z-50 bg-white border rounded-md shadow-lg p-2 min-w-48"
        style={{ 
          left: position.x, 
          top: position.y 
        }}
      >
        {children}
      </div>
    </>
  );
};
