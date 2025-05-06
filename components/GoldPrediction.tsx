import React, { useEffect, useState } from "react";
import { GoldPriceData, fetchGoldPrices, calculateOptimalInvestmentDay } from "@/lib/api";
import PredictionChart from "./PredictionChart";
import InvestmentCalculator from "./InvestmentCalculator";
import { toast } from "sonner";
import { CircleDollarSign, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
const GoldPrediction: React.FC = () => {
  const [goldPrices, setGoldPrices] = useState<GoldPriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvestDay, setSelectedInvestDay] = useState<number>(0);
  const [selectedSellDay, setSelectedSellDay] = useState<number>(29); // Default to last day
  const [optimalDay, setOptimalDay] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchGoldPrices();
        setGoldPrices(data);
        
        // Calculate optimal investment day
        const optimal = calculateOptimalInvestmentDay(data);
        setOptimalDay(optimal);
        setSelectedInvestDay(optimal);
        setSelectedSellDay(data.filter((item: { type: string; }) => item.type === "predicted").length - 1);
      } catch (error) {
        console.error("Error loading gold price data:", error);
        toast.error("Failed to load gold price data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInvestDayChange = (day: number) => {
    setSelectedInvestDay(day);
    // If sell day is before new invest day, update it
    if (selectedSellDay < day) {
      setSelectedSellDay(day);
    }
  };

  const handleSellDayChange = (day: number) => {
    setSelectedSellDay(day);
  };

  const handleUseOptimalDay = () => {
    if (optimalDay !== null) {
      setSelectedInvestDay(optimalDay);
      toast.success("Set to optimal investment day");
    }
  };

  const predictedData = goldPrices.filter(item => item.type === "predicted");
  const optimalDate = optimalDay !== null && predictedData[optimalDay] ? 
    format(parseISO(predictedData[optimalDay].date), "d MMMM yyyy") : 
    "calculating...";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto animate-slide-up">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-gold-100 dark:bg-gold-900/30">
            <CircleDollarSign className="h-8 w-8 text-gold-600 dark:text-gold-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Gold Price Prediction</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analyze historical gold price trends and AI-driven predictions to determine the optimal timing for your gold investments.
        </p>
      </div>
      
      {/* Optimal Investment Day Card */}
      <div className="glass-card p-4 rounded-xl mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center space-x-4">
          <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-muted-foreground">Optimal day to invest</h3>
            <p className="text-lg font-bold">{optimalDate}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8"
            onClick={handleUseOptimalDay}
          >
            Use Optimal
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
        {/* Chart */}
        <div className="md:col-span-2">
          <PredictionChart 
            data={goldPrices} 
            selectedInvestDay={selectedInvestDay} 
            selectedSellDay={selectedSellDay}
            isLoading={loading}
          />
        </div>
        
        {/* Calculator */}
        <div>
          <InvestmentCalculator 
            data={goldPrices}
            selectedInvestDay={selectedInvestDay}
            selectedSellDay={selectedSellDay}
            onInvestDayChange={handleInvestDayChange}
            onSellDayChange={handleSellDayChange}
          />
        </div>
      </div>
      
      {/* Information Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        {/* Card 1 */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-medium">Market Insights</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Our AI models analyze global economic indicators, geopolitical events, and market sentiment to forecast gold price movements with high accuracy.
          </p>
        </div>
        
        {/* Card 2 */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20">
              <CircleDollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-medium">Investment Strategy</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Use the investment calculator to simulate different buying and selling scenarios to maximize your potential returns based on our predictions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoldPrediction;