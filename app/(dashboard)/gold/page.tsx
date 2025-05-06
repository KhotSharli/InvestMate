"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGoldPrices, analyzeBuySellOpportunities } from '@/services/goldDataService';
import { toast } from '@/components/ui/use-toast';
import GoldPriceChart from '@/components/GoldPriceChart';
import InvestmentInsight from '@/components/InvestmentInsight';
import GoldMarketStats from '@/components/GoldMarketStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['goldPrices'],
    queryFn: fetchGoldPrices,
  });

  const [investmentOpportunity, setInvestmentOpportunity] = useState<{
    buyDate: string | null;
    buyPrice: number | null;
    sellDate: string | null;
    sellPrice: number | null;
    potentialProfit: number;
    profitPercentage: number;
  }>({
    buyDate: null,
    buyPrice: null,
    sellDate: null,
    sellPrice: null,
    potentialProfit: 0,
    profitPercentage: 0
  });

  useEffect(() => {
    if (data) {
      const analysis = analyzeBuySellOpportunities(data);
      setInvestmentOpportunity({
        buyDate: analysis.buyDate || null,
        buyPrice: analysis.buyPrice || null,
        sellDate: analysis.sellDate || null,
        sellPrice: analysis.sellPrice || null,
        potentialProfit: analysis.potentialProfit,
        profitPercentage: analysis.profitPercentage || 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load gold price data. Please try again later.',
        variant: 'destructive'
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="glassmorphism sticky top-0 z-10 py-4 px-6 backdrop-blur-md border-b">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-dark via-gold to-gold-light">
              Gold Market Vision
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm sm:text-base text-muted-foreground">
                Precision Analysis for Gold Investors
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-3xl mx-auto text-center mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
        <h3 className="text-lg font-semibold text-red-700">Disclaimer</h3>
        <p className="text-sm text-red-600 mt-2">
          The predictions in this platform are based on mathematical models and do not guarantee future results.
          Investing in Gold ETFs carries risk, and investors should conduct their own research before making decisions.
        </p>
        <p className="text-sm text-red-600 mt-2">
          This tool analyzes <strong>Gold ETFs</strong>, not physical gold. ETFs track gold prices but may have different risks and performance factors.
        </p>
      </div>

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="w-full max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Gold ETF Price Forecasting
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
            Visualize historical gold ETF prices and predictive analytics to make informed investment decisions.
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <GoldMarketStats 
            data={data ?? null} 
            isLoading={isLoading} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <Tabs defaultValue="chart">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
                <TabsTrigger value="chart">Price Chart</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="animate-fade-in">
                <GoldPriceChart 
                  data={data ?? null}
                  buyDate={investmentOpportunity.buyDate}
                  sellDate={investmentOpportunity.sellDate}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="analysis" className="animate-fade-in">
                <div className="p-6 glassmorphism rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Gold prices are influenced by various factors including inflation, interest rates, currency movements, and geopolitical tensions. Our predictive model analyzes these factors to forecast future price movements.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h4 className="font-medium mb-2">Key Drivers</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Central bank policies</li>
                        <li>Inflation expectations</li>
                        <li>U.S. dollar strength</li>
                        <li>Global economic uncertainty</li>
                        <li>Jewelry and industrial demand</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <h4 className="font-medium mb-2">Forecast Methodology</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Time series analysis</li>
                        <li>Machine learning algorithms</li>
                        <li>Regression models</li>
                        <li>Seasonal patterns</li>
                        <li>Technical indicators</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '500ms' }}>
            <InvestmentInsight 
              buyDate={investmentOpportunity.buyDate}
              buyPrice={investmentOpportunity.buyPrice}
              sellDate={investmentOpportunity.sellDate}
              sellPrice={investmentOpportunity.sellPrice}
              potentialProfit={investmentOpportunity.potentialProfit}
              profitPercentage={investmentOpportunity.profitPercentage}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mt-12 p-6 glassmorphism rounded-xl animate-fade-up" style={{ animationDelay: '600ms' }}>
          <h3 className="text-xl font-semibold mb-4">About Gold Market Vision</h3>
          <p className="text-muted-foreground">
            Gold Market Vision provides sophisticated analytics and predictive modeling for gold price trends. 
            Our platform combines historical data analysis with advanced forecasting techniques to help investors 
            identify potential buying and selling opportunities. The predictions are based on mathematical models 
            and should be used as one of many tools in making investment decisions.
          </p>
        </div>
      </main>

      <div className="mt-12 p-6 glassmorphism rounded-xl animate-fade-up" style={{ animationDelay: '600ms' }}>
        <h3 className="text-xl font-semibold mb-4">Learn More About Gold ETFs</h3>
        <p className="text-muted-foreground mb-4">
          Understanding the difference between Gold ETFs and physical gold investment is crucial for making informed decisions.
          Here are some external resources that explain these concepts in detail:
        </p>
        <ul className="list-disc list-inside text-blue-500">
          <li>
            <a href="https://www.investopedia.com/gold-and-gold-mining-etfs-8431193#:~:text=Definition,securities%20of%20gold%2Dmining%20companies." target="_blank" rel="noopener noreferrer">
              What is a Gold ETF? - Investopedia
            </a>
          </li>
          <li>
            <a href="https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=1658" target="_blank" rel="noopener noreferrer">
              Understanding Gold Investments - RBI
            </a>
          </li>
          <li>
            <a href="https://www.bajajfinserv.in/investments/gold-etf" target="_blank" rel="noopener noreferrer">
              Gold ETFs: What You Need to Know - BAJAJ Finserv
            </a>
          </li>
        </ul>
      </div>

      <footer className="border-t py-6 mt-12">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Gold Market Vision. All data is for informational purposes only.</p>
          <p className="mt-2">This platform does not provide investment advice. Past performance is not indicative of future results.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
