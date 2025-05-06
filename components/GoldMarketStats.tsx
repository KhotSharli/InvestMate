import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Activity, Clock, CalendarCheck, CalendarX } from 'lucide-react';
import { GoldPriceResponse, analyzeBuySellOpportunities } from '@/services/goldDataService';

interface GoldMarketStatsProps {
  data: GoldPriceResponse | null;
  isLoading: boolean;
}

const GoldMarketStats: React.FC<GoldMarketStatsProps> = ({ data, isLoading }) => {
  const calculateStats = () => {
    if (!data || !data.historical_data.length) {
      return { currentPrice: 0, priceChange24h: 0, priceChangePercentage24h: 0, volatility30d: 0, updateTime: 'N/A' };
    }
    const historical = data.historical_data;
    const currentPrice = historical[historical.length - 1].price;
    const previousDayPrice = historical[historical.length - 2]?.price || currentPrice;
    const priceChange24h = currentPrice - previousDayPrice;
    const priceChangePercentage24h = (priceChange24h / previousDayPrice) * 100;
    const last30Days = historical.slice(-30);
    if (last30Days.length < 2) return { currentPrice, priceChange24h, priceChangePercentage24h, volatility30d: 0, updateTime: new Date().toLocaleString() };
    const returns = last30Days.slice(1).map((item, i) => (item.price / last30Days[i].price) - 1);
    const meanReturn = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    const variance = returns.map(r => Math.pow(r - meanReturn, 2)).reduce((sum, value) => sum + value, 0) / returns.length;
    const volatility30d = Math.sqrt(variance) * 100;
    return { currentPrice, priceChange24h, priceChangePercentage24h, volatility30d, updateTime: new Date().toLocaleString() };
  };

  const stats = calculateStats();
  const opportunities = data ? analyzeBuySellOpportunities(data) : null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="w-full">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(price);
  };

  const statItems = [
    {
      title: "Current Price",
      value: formatPrice(stats.currentPrice),
      description: "Per ounce",
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      className: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "24h Change",
      value: formatPrice(stats.priceChange24h),
      description: `${stats.priceChangePercentage24h.toFixed(2)}%`,
      icon: stats.priceChange24h >= 0
        ? <TrendingUp className="h-5 w-5 text-green-500" />
        : <TrendingDown className="h-5 w-5 text-red-500" />,
      className: stats.priceChange24h >= 0
        ? "bg-green-50 dark:bg-green-900/20"
        : "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "30d Volatility",
      value: `${stats.volatility30d.toFixed(2)}%`,
      description: "Standard deviation",
      icon: <Activity className="h-5 w-5 text-purple-500" />,
      className: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Last Updated",
      value: stats.updateTime.split(',')[1] || stats.updateTime,
      description: stats.updateTime.split(',')[0] || "Today",
      icon: <Clock className="h-5 w-5 text-gray-500" />,
      className: "bg-gray-50 dark:bg-gray-800/40"
    }
  ];

  if (opportunities?.buyDate && opportunities?.sellDate) {
    statItems.push(
      {
        title: "Optimal Buy Date",
        value: new Date(opportunities.buyDate).toDateString(),
        description: `Expected: ${formatPrice(opportunities.buyPrice)}`,
        icon: <CalendarCheck className="h-5 w-5 text-green-600" />,
        className: "bg-green-50 dark:bg-green-900/20"
      },
      {
        title: "Optimal Sell Date",
        value: new Date(opportunities.sellDate).toDateString(),
        description: `Expected: ${formatPrice(opportunities.sellPrice)}`,
        icon: <CalendarX className="h-5 w-5 text-red-600" />,
        className: "bg-red-50 dark:bg-red-900/20"
      }
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${statItems.length > 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-4'} gap-4`}>
      {statItems.map((item, index) => (
        <Card key={index} className="w-full transition-all duration-300 hover:shadow-md overflow-hidden">
          <CardContent className="p-6 h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                <h3 className="text-2xl font-bold tracking-tight">{item.value}</h3>
                <p className={`text-sm mt-1 ${item.title === "24h Change" ? (stats.priceChange24h >= 0 ? "text-green-600" : "text-red-600") : "text-muted-foreground"}`}>
                  {item.description}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${item.className}`}>
                {item.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GoldMarketStats;
