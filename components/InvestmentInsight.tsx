import React from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Calendar, DollarSign } from 'lucide-react';

interface InvestmentInsightProps {
  buyDate: string | null;
  buyPrice: number | null;
  sellDate: string | null;
  sellPrice: number | null;
  potentialProfit: number | null;
  profitPercentage: number | null;
  isLoading: boolean;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not available';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const formatPrice = (price: number | null) => {
  if (price === null || isNaN(price)) return 'Not available';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const formatPercentage = (percentage: number | null) => {
  if (typeof percentage !== 'number' || isNaN(percentage)) return '--';
  const formatted = percentage.toFixed(2);
  return percentage > 0 ? `+${formatted}%` : `${formatted}%`;
};

const InvestmentInsight: React.FC<InvestmentInsightProps> = ({
  buyDate,
  buyPrice,
  sellDate,
  sellPrice,
  potentialProfit,
  profitPercentage,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Investment Opportunity</CardTitle>
            <CardDescription>Optimal timing for gold investment</CardDescription>
          </div>
          <Badge variant="outline" className="bg-gold-light/10 text-gold-dark border-gold-light px-3 py-1">
            {formatPercentage(profitPercentage)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glassmorphism rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-100 text-green-600 mr-3">
                <ArrowDown className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Optimal Buy Date</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatDate(buyDate)}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatPrice(buyPrice)}</span>
              </div>
            </div>
          </div>

          <div className="glassmorphism rounded-xl p-5 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-100 text-red-600 mr-3">
                <ArrowUp className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">Optimal Sell Date</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatDate(sellDate)}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatPrice(sellPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border bg-secondary/50">
          <p className="text-sm leading-relaxed">
            Based on our analysis, purchasing gold on <span className="font-semibold">{formatDate(buyDate)}</span> and 
            selling on <span className="font-semibold">{formatDate(sellDate)}</span> could yield a potential profit of 
            <span className="font-bold text-green-600"> {formatPrice(potentialProfit)}</span> 
            per ounce, representing a <span className="font-bold">{formatPercentage(profitPercentage)}</span> return on investment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentInsight;
