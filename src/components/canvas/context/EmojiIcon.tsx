
import React from 'react';

interface EmojiIconProps {
  percentage: number;
}

export const EmojiIcon: React.FC<EmojiIconProps> = ({ percentage }) => {
  const provider = localStorage.getItem('model-provider') || 'gemini';
  
  // Adjust thresholds based on provider - Groq has smaller context so we're more conservative
  const thresholds = provider === 'groq' 
    ? { critical: 85, high: 70, medium: 50, low: 30 }
    : { critical: 90, high: 80, medium: 60, low: 40 };

  let emoji = '😤'; // annoyed - default for 0%
  
  if (percentage > thresholds.critical) {
    emoji = '☹️'; // frown - red
  } else if (percentage > thresholds.high) {
    emoji = '😑'; // meh - orange
  } else if (percentage > thresholds.medium) {
    emoji = '😊'; // smile - yellow
  } else if (percentage > thresholds.low) {
    emoji = '😂'; // laugh - light green
  } else if (percentage > 0) {
    emoji = '😄'; // smile-plus - dark green
  }

  return (
    <span 
      className="text-lg animate-pulse relative z-10 drop-shadow-sm"
      style={{
        animationDuration: '2s',
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
      }}
    >
      {emoji}
    </span>
  );
};
