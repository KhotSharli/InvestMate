import React, { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoldPriceData, calculatePotentialReturns } from "@/lib/api";
import { cn } from "@/lib/utils";

interface InvestmentCalculatorProps {
  data: GoldPriceData[];
  selectedInvestDay: number;
  selectedSellDay: number;
  onInvestDayChange: (day: number) => void;
  onSellDayChange: (day: number) => void;
  className?: string;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({
  data,
  selectedInvestDay,
  selectedSellDay,
  onInvestDayChange,
  onSellDayChange,
  className,
}) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
  const [returns, setReturns] = useState({ buyPrice: 0, sellPrice: 0, returns: 0, percentChange: 0 });
  
  const predictedData = data.filter(item => item.type === "predicted");
  
  // Calculate dates from days
  const getDateFromDay = (day: number): Date | undefined => {
    if (predictedData.length <= day) return undefined;
    return parseISO(predictedData[day].date);
  };
  
  const investDate = getDateFromDay(selectedInvestDay);
  const sellDate = getDateFromDay(selectedSellDay);

  // Calculate returns whenever relevant values change
  useEffect(() => {
    if (predictedData.length > 0) {
      const result = calculatePotentialReturns(
        investmentAmount,
        selectedInvestDay,
        selectedSellDay,
        data
      );
      setReturns(result);
    }
  }, [investmentAmount, selectedInvestDay, selectedSellDay, data, predictedData.length]);

  // Handle investment amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, ""));
    if (!isNaN(value) && value >= 0) {
      setInvestmentAmount(value);
    }
  };

  // Handle buy date selection from calendar
  const handleBuyDateSelect = (date: Date | undefined) => {
    if (!date || !predictedData.length) return;
    
    // Find the closest day index for the selected date
    const dayIndex = predictedData.findIndex(item => {
      const itemDate = parseISO(item.date);
      return itemDate.getTime() >= date.getTime();
    });
    
    if (dayIndex !== -1) {
      onInvestDayChange(dayIndex);
    }
  };

  // Handle sell date selection from calendar
  const handleSellDateSelect = (date: Date | undefined) => {
    if (!date || !predictedData.length) return;
    
    // Find the closest day index for the selected date
    const dayIndex = predictedData.findIndex(item => {
      const itemDate = parseISO(item.date);
      return itemDate.getTime() >= date.getTime();
    });
    
    if (dayIndex !== -1) {
      onSellDayChange(dayIndex);
    }
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    });
  };

  return (
    <div className={cn("glass-card rounded-xl p-6", className)}>
      <h3 className="text-lg font-semibold mb-6">Investment Calculator</h3>
      
      {/* Investment Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Investment Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <Input
            type="text"
            value={investmentAmount.toLocaleString()}
            onChange={handleAmountChange}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Buy Day Selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Buy Day</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs gap-1 px-2"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {investDate ? format(investDate, "d MMM yyyy") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={investDate}
                onSelect={handleBuyDateSelect}
                disabled={(date) => {
                  if (!predictedData.length) return true;
                  const firstDate = parseISO(predictedData[0].date);
                  const lastDate = parseISO(predictedData[predictedData.length - 1].date);
                  return date < firstDate || date > lastDate;
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Slider
          value={[selectedInvestDay]}
          max={predictedData.length - 1}
          step={1}
          onValueChange={(value) => onInvestDayChange(value[0])}
          className="my-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{predictedData.length > 0 ? format(parseISO(predictedData[0].date), "d MMM") : "Day 1"}</span>
          <span>{predictedData.length > 0 ? format(parseISO(predictedData[predictedData.length - 1].date), "d MMM") : "Day 30"}</span>
        </div>
      </div>
      
      {/* Sell Day Selector */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Sell Day</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 text-xs gap-1 px-2"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {sellDate ? format(sellDate, "d MMM yyyy") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={sellDate}
                onSelect={handleSellDateSelect}
                disabled={(date) => {
                  if (!predictedData.length) return true;
                  const firstInvestDate = parseISO(predictedData[selectedInvestDay].date);
                  const lastDate = parseISO(predictedData[predictedData.length - 1].date);
                  return date < firstInvestDate || date > lastDate;
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Slider
          value={[selectedSellDay]}
          min={selectedInvestDay}
          max={predictedData.length - 1}
          step={1}
          onValueChange={(value) => onSellDayChange(value[0])}
          className="my-4"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{investDate ? format(investDate, "d MMM") : "Buy Day"}</span>
          <span>{predictedData.length > 0 ? format(parseISO(predictedData[predictedData.length - 1].date), "d MMM") : "Day 30"}</span>
        </div>
      </div>
      
      {/* Results */}
      <div className="space-y-3 mt-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-background/50 border">
            <div className="text-sm text-muted-foreground">Buy Price</div>
            <div className="text-lg font-semibold">{formatCurrency(returns.buyPrice)}</div>
          </div>
          
          <div className="p-4 rounded-lg bg-background/50 border">
            <div className="text-sm text-muted-foreground">Sell Price</div>
            <div className="text-lg font-semibold">{formatCurrency(returns.sellPrice)}</div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 border border-gold-200 dark:border-gold-800/30">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-gold-800 dark:text-gold-300">Potential Returns</div>
              <div className="text-2xl font-bold text-gold-700 dark:text-gold-400">
                {formatCurrency(returns.returns)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gold-800 dark:text-gold-300">ROI</div>
              <div className={cn(
                "text-xl font-bold",
                returns.percentChange >= 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {returns.percentChange >= 0 ? "+" : ""}{returns.percentChange.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;