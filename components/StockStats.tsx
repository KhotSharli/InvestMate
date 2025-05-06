import { ArrowDown, ArrowUp, Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StockStatsProps {
  stockName: string;
  chartData: any;
  isLoading: boolean;
}

const StockStats = ({ stockName, chartData, isLoading }: StockStatsProps) => {
  if (isLoading || !chartData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate stats from chartData
  const historicalPrices = chartData.datasets[0].data.filter(price => price !== null);
  const predictedPrices = chartData.datasets[1].data.filter(price => price !== null);
  
  const currentPrice = historicalPrices[historicalPrices.length - 1];
  const previousPrice = historicalPrices[historicalPrices.length - 2];
  const predictedPrice = predictedPrices[0];
  
  const dailyChange = currentPrice - previousPrice;
  const dailyChangePercent = (dailyChange / previousPrice) * 100;
  
  const expectedChange = predictedPrice - currentPrice;
  const expectedChangePercent = (expectedChange / currentPrice) * 100;
  
  const min30Day = Math.min(...historicalPrices.slice(-30));
  const max30Day = Math.max(...historicalPrices.slice(-30));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Current Price</p>
          <h3 className="text-2xl font-bold mt-1">₹{currentPrice.toFixed(2)}</h3>
          <div className={`flex items-center gap-1 text-sm mt-1 ${dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {dailyChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(dailyChange).toFixed(2)}</span>
            <span className="flex items-center">
              (<Percent className="h-3 w-3" />{Math.abs(dailyChangePercent).toFixed(2)})
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Predicted Price</p>
          <h3 className="text-2xl font-bold mt-1">₹{predictedPrice.toFixed(2)}</h3>
          <div className={`flex items-center gap-1 text-sm mt-1 ${expectedChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {expectedChange >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(expectedChange).toFixed(2)}</span>
            <span className="flex items-center">
              (<Percent className="h-3 w-3" />{Math.abs(expectedChangePercent).toFixed(2)})
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">30-Day Low</p>
          <h3 className="text-2xl font-bold mt-1">₹{min30Day.toFixed(2)}</h3>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">30-Day High</p>
          <h3 className="text-2xl font-bold mt-1">₹{max30Day.toFixed(2)}</h3>
          <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockStats;