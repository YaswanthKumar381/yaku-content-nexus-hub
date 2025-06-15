
import React from 'react';

export const ApiKeyInput: React.FC = () => {
  // This component is intentionally left blank.
  // API key management has been moved to the global settings popover
  // accessible from the top right corner of the canvas.
  // This prevents this component from rendering in read-only parent components
  // like ChatNodeComponent.
  return null;
};
