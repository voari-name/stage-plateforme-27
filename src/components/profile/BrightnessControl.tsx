
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Sun } from 'lucide-react';

interface BrightnessControlProps {
  defaultValue?: number;
  onBrightnessChange?: (value: number) => void;
}

export const BrightnessControl = ({ 
  defaultValue = 100, 
  onBrightnessChange 
}: BrightnessControlProps) => {
  const [brightness, setBrightness] = useState<number>(defaultValue);
  
  useEffect(() => {
    // Apply brightness to the document when component mounts
    document.documentElement.style.filter = `brightness(${brightness}%)`;
    
    // Clean up when component unmounts
    return () => {
      document.documentElement.style.filter = '';
    };
  }, []);
  
  const handleBrightnessChange = (value: number[]) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    document.documentElement.style.filter = `brightness(${newBrightness}%)`;
    
    if (onBrightnessChange) {
      onBrightnessChange(newBrightness);
    }
    
    // Save to user preferences in local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        user.brightness = newBrightness;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.error('Error saving brightness preference:', err);
      }
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <span className="text-sm font-medium">Luminosité</span>
        </div>
        <span className="text-sm font-medium">{brightness}%</span>
      </div>
      
      <Slider
        defaultValue={[brightness]}
        min={50}
        max={150}
        step={1}
        onValueChange={handleBrightnessChange}
        className="cursor-pointer"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>50%</span>
        <span>100%</span>
        <span>150%</span>
      </div>
    </div>
  );
};
