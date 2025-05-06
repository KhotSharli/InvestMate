import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { GoldPriceData } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface PredictionChartProps {
  data: GoldPriceData[];
  selectedInvestDay: number;
  selectedSellDay: number;
  isLoading?: boolean;
  className?: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({
  data,
  selectedInvestDay,
  selectedSellDay,
  isLoading = false,
  className
}) => {
  const [chartData, setChartData] = useState<GoldPriceData[]>([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setChartData([]);
    const timer = setTimeout(() => {
      setChartData(data);
      setAnimate(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  const predictedData = data.filter(item => item.type === "predicted");
  const buyDate = predictedData[selectedInvestDay]?.date;
  const sellDate = predictedData[selectedSellDay]?.date;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && label) {
      try {
        const date = label;
        const formattedDate = format(parseISO(date), "MMM d, yyyy");
        
        return (
          <div className="glass-card p-3 text-sm rounded-lg animate-fade-in">
            <p className="font-medium">{formattedDate}</p>
            {payload.map((entry: any, index: number) => {
              const price = entry.value.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
              });
              
              let colorClass = "bg-red-500";
              let typeName = "Historical";
              
              if (entry.dataKey === "predictedPrice") {
                colorClass = "bg-blue-500";
                typeName = "Prediction";
              }
              
              return (
                <div key={index} className="flex items-center mt-2">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
                  <span className="text-muted-foreground">{typeName}:</span>
                  <span className="ml-2 text-base font-bold">{price}</span>
                </div>
              );
            })}
          </div>
        );
      } catch (error) {
        console.error("Error in tooltip:", error);
        return null;
      }
    }
    return null;
  };

  const formatXAxis = (date: string) => {
    if (!date) return "";
    try {
      return format(parseISO(date), "d MMM");
    } catch (error) {
      console.error("Error formatting X axis:", error, date);
      return "";
    }
  };

  const formatYAxis = (value: number) => {
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  // Transform data for the chart to handle multiple prediction lines
  const transformedData = chartData.reduce((acc: any[], item) => {
    const existingItem = acc.find(i => i.date === item.date);
    
    if (existingItem) {
      if (item.type === "historical") {
        existingItem.historicalPrice = item.price;
      } else if (item.type === "predicted") {
        existingItem.predictedPrice = item.price;
      }
    } else {
      const newItem: any = { date: item.date };
      
      if (item.type === "historical") {
        newItem.historicalPrice = item.price;
      } else if (item.type === "predicted") {
        newItem.predictedPrice = item.price;
      }
      
      acc.push(newItem);
    }
    
    return acc;
  }, []);

  // Sort by date
  transformedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className={cn("w-full rounded-xl p-4 glass-card", className)}>
      <h3 className="text-lg font-medium mb-2">Gold Price Forecast</h3>
      
      {isLoading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400} className={cn(animate ? "animate-fade-in" : "opacity-0")}>
          <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              minTickGap={40}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              width={60}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              domain={[60000, 'dataMax + 5000']}
              allowDataOverflow={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => {
                if (value === "historicalPrice") return "Historical";
                if (value === "predictedPrice") return "Predicted";
                return value;
              }}
            />
            
            {/* Historical Line */}
            <Line 
              type="monotone" 
              dataKey="historicalPrice" 
              name="historicalPrice" 
              stroke="#EF4444" // Red
              strokeWidth={2}
              dot={{ fill: "#EF4444", r: 4 }}
              activeDot={{ r: 6, fill: "#B91C1C" }}
              isAnimationActive={true}
              animationDuration={1500}
              connectNulls={true}
            />
            
            
            {/* Predicted Line */}
            <Line 
              type="monotone" 
              dataKey="predictedPrice" 
              name="predictedPrice" 
              stroke="#3B82F6" // Blue
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6, fill: "#2563EB" }}
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={600}
              connectNulls={true}
            />
            
            {/* Buy Day Reference Line */}
            {buyDate && (
              <ReferenceLine
                x={buyDate}
                stroke="#16A34A"
                strokeWidth={2}
                label={{
                  value: "Buy",
                  position: "top",
                  fill: "#16A34A",
                  fontSize: 12,
                  fontWeight: "bold"
                }}
              />
            )}
            
            {/* Sell Day Reference Line */}
            {sellDate && (
              <ReferenceLine
                x={sellDate}
                stroke="#DC2626"
                strokeWidth={2}
                label={{
                  value: "Sell",
                  position: "top",
                  fill: "#DC2626",
                  fontSize: 12,
                  fontWeight: "bold"
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PredictionChart;