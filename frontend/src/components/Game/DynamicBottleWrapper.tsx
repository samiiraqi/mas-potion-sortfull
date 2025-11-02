import { ReactNode } from 'react';

interface DynamicBottleWrapperProps {
  bottleCount: number;
  children: ReactNode;
}

export default function DynamicBottleWrapper({ bottleCount, children }: DynamicBottleWrapperProps) {
  // Calculate scale based on bottle count
  let scale = 1;
  let gap = 12;
  
  if (bottleCount <= 12) {
    scale = 1.1;  // Larger bottles for 12 bottles
    gap = 16;
  } else if (bottleCount <= 15) {
    scale = 0.95; // Medium bottles for 15 bottles
    gap = 12;
  } else if (bottleCount <= 18) {
    scale = 0.85; // Smaller bottles for 18 bottles
    gap = 10;
  } else {
    scale = 0.8;  // Smallest bottles for 20 bottles
    gap = 8;
  }

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      transition: 'transform 0.3s ease',
      margin: `${gap}px`
    }}>
      {children}
    </div>
  );
}
