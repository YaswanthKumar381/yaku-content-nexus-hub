
import React from 'react';

interface EmojiIconProps {
  percentage: number;
}

export const EmojiIcon: React.FC<EmojiIconProps> = ({ percentage }) => {
  let emoji = '😤'; // annoyed - default for 0%
  
  if (percentage > 90) {
    emoji = '☹️'; // frown - red
  } else if (percentage > 80) {
    emoji = '😑'; // meh - orange
  } else if (percentage > 60) {
    emoji = '😊'; // smile - yellow
  } else if (percentage > 40) {
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
