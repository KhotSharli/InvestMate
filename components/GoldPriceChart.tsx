import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  Label
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GoldPriceData, GoldPriceResponse } from '@/services/goldDataService';

interface GoldPriceChartProps {
  data: GoldPriceResponse | null;
  buyDate: string | null;
  sellDate: string | null;
  isLoading: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const GoldPriceChart: React.FC<GoldPriceChartProps> = ({ 
  data, 
  buyDate, 
  sellDate, 
  isLoading 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.historical_data && data.future_predictions) {
      // Create combined data for the chart with a source indicator
      const combinedData = [
        ...data.historical_data.map(item => ({
          date: item.Date,
          price: item.price,
          source: 'historical'
        })),
        ...data.future_predictions.map(item => ({
          date: item.Date,
          price: item.price,
          source: 'prediction'
        }))
      ];
      
      // Downsample data for better performance if there are many points
      const downsampledData = downsampleData(combinedData, 500);
      setChartData(downsampledData);
    }
  }, [data]);

  // Simple downsampling function to limit number of data points for better performance
  const downsampleData = (data: any[], targetPoints: number) => {
    if (data.length <= targetPoints) return data;
    
    const step = Math.ceil(data.length / targetPoints);
    return data.filter((_, index) => index % step === 0);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPrediction = data.source === 'prediction';
      
      return (
        <div className="glassmorphism p-4 rounded-lg shadow-md">
          <p className="text-sm font-semibold mb-1">{formatDate(data.date)}</p>
          <p className="text-lg font-bold">
            {formatPrice(data.price)}
          </p>
          {isPrediction && (
            <p className="text-xs text-muted-foreground mt-1">Predicted Value</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, index } = props;
    const isActive = activeIndex === index;
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={isActive ? 8 : 5}
        fill={props.dataKey === 'historical' ? "#4F46E5" : "#EF4444"}
        stroke="#fff"
        strokeWidth={2}
        className="transition-all duration-300"
      />
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[500px] animate-pulse">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <Skeleton className="w-full h-[400px] rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="w-full h-[500px]">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Find the indices for buy/sell reference lines
  const buyDateIndex = chartData.findIndex(item => item.date === buyDate);
  const sellDateIndex = chartData.findIndex(item => item.date === sellDate);

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0 pt-6">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              onMouseMove={(e) => e && e.activeTooltipIndex !== undefined && setActiveIndex(e.activeTooltipIndex)}
            >
              <defs>
                <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(tick) => {
                  const date = new Date(tick);
                  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                }}
                minTickGap={50}
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(value)
                }
                tick={{ fill: '#666', fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingTop: '10px' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                name="Gold Price"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#goldGradient)"
                activeDot={<CustomActiveDot />}
                dot={false}
              />
              {buyDate && (
                <ReferenceLine 
                  x={buyDate} 
                  stroke="#22C55E" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: 'BUY',
                    fill: '#22C55E',
                    fontSize: 12,
                    position: 'insideTopRight'
                  }} 
                />
              )}
              {sellDate && (
                <ReferenceLine 
                  x={sellDate} 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: 'SELL',
                    fill: '#EF4444',
                    fontSize: 12,
                    position: 'insideTopRight'
                  }} 
                />
              )}
              <ReferenceLine
                x={chartData[chartData.findIndex(d => d.source === 'prediction') - 1]?.date}
                stroke="#475569"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{
                  value: 'CURRENT',
                  fill: '#475569',
                  fontSize: 12,
                  position: 'insideBottomRight'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoldPriceChart;