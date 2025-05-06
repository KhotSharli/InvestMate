import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface DaysSliderProps {
  maxDays: number;
  value: number;
  onChange: (value: number) => void;
}

const DaysSlider = ({ maxDays, value, onChange }: DaysSliderProps) => {
  const [sliderValue, setSliderValue] = useState([value]);

  useEffect(() => {
    setSliderValue([value]);
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue);
    onChange(newValue[0]);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Days to Forecast:</span>
        <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">{sliderValue[0]}</span>
      </div>
      <Slider
        defaultValue={sliderValue}
        max={maxDays}
        min={5}
        step={1}
        value={sliderValue}
        onValueChange={handleSliderChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>5 days</span>
        <span>{maxDays} days</span>
      </div>
    </div>
  );
};

export default DaysSlider;