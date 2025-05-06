"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

interface GoldPriceData {
  date: string;
  price: number;
}

interface InvestmentRecommendationProps {
  data: GoldPriceData[];
  optimalDay: number;
  selectedTimeframe: number;
}

const InvestmentRecommendation: React.FC<InvestmentRecommendationProps> = ({
  data,
  optimalDay,
  selectedTimeframe,
}) => {
  const [bestDay, setBestDay] = useState<number | null>(null);
  const [bestProfit, setBestProfit] = useState<number>(0);
  const [investmentAdvice, setInvestmentAdvice] = useState<string>("");

  useEffect(() => {
    if (data.length === 0) return;

    let minPrice = data[0].price;
    let minDay = 0;
    let maxProfit = 0;
    let bestDayToSell = 0;

    // Calculate the best day to buy and sell for maximum profit
    for (let i = 1; i < data.length; i++) {
      const profit = data[i].price - minPrice;
      if (profit > maxProfit) {
        maxProfit = profit;
        bestDayToSell = i;
        setBestDay(minDay);
      }
      if (data[i].price < minPrice) {
        minPrice = data[i].price;
        minDay = i;
      }
    }

    setBestProfit(maxProfit);

    // Generate Investment Advice
    if (maxProfit > 0) {
      setInvestmentAdvice(
        `The best day to invest is Day ${bestDay}, and sell on Day ${bestDayToSell} for a profit of ₹${maxProfit.toFixed(
          2
        )}.`
      );
    } else {
      setInvestmentAdvice(
        "There might not be a profitable opportunity within the selected timeframe. Consider analyzing a longer period."
      );
    }
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Investment Recommendation</CardTitle>
      </CardHeader>
      <CardContent>
        {investmentAdvice ? (
          <div className="space-y-4">
            <p>{investmentAdvice}</p>
            {bestProfit > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span>Recommended Investment Opportunity</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <TrendingDown className="w-5 h-5" />
                <span>No Profitable Opportunity Detected</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="w-5 h-5" />
            <span>Fetching recommendations...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentRecommendation;
