import { useState } from "react"; 
import { Check, ChevronDown, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface StockOption {
  value: string;
  label: string;
}

interface StockSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: StockOption[];
}

const StockSelector = ({ value, onChange, options }: StockSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  const selectedLabel = options.find(option => option.value === value)?.label || "";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-[240px] justify-between font-normal bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <LineChart className="h-4 w-4 text-primary" />
            <span className="truncate">{selectedLabel}</span>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[240px] max-h-[300px] overflow-y-auto animate-fade-in backdrop-blur-lg bg-white/90" 
        sideOffset={8}
      >
        {options.map((option) => (
          <DropdownMenuItem 
            key={option.value}
            className={cn(
              "flex items-center gap-2 cursor-pointer py-2.5 px-3 hover:bg-gray-50 transition-colors",
              value === option.value && "bg-gray-50"
            )}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            <LineChart className="h-4 w-4 text-primary opacity-70" />
            <span className="flex-1">{option.label}</span>
            {value === option.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StockSelector;
