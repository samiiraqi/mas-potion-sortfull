import ClassicBottle from './bottles/ClassicBottle';
import LabBottle from './bottles/LabBottle';
import CoffeeBottle from './bottles/CoffeeBottle';
import JuiceBottle from './bottles/JuiceBottle';
import PotionBottle from './bottles/PotionBottle';

interface ThemedBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  theme?: string;
  isPouring?: boolean;
}

export default function ThemedBottle({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  theme = 'classic',
  isPouring = false
}: ThemedBottleProps) {
  
  // Switch between different bottle components based on theme
  const BottleComponent = (() => {
    switch (theme) {
      case 'lab':
        return LabBottle;
      case 'coffee':
        return CoffeeBottle;
      case 'juice':
        return JuiceBottle;
      case 'potion':
        return PotionBottle;
      case 'classic':
      default:
        return ClassicBottle;
    }
  })();

  return (
    <BottleComponent
      colors={colors}
      position={position}
      onSelect={onSelect}
      isSelected={isSelected}
      isEmpty={isEmpty}
      isFull={isFull}
      isPouring={isPouring}
    />
  );
}
