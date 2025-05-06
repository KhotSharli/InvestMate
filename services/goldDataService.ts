import { toast } from "@/components/ui/use-toast";

export interface GoldPriceData {
  Date: string;
  price: number;
}

export interface GoldPriceResponse {
  historical_data: GoldPriceData[];
  future_predictions: GoldPriceData[];
}


export const fetchGoldPrices = async (): Promise<GoldPriceResponse> => {
  try {
    const response = await fetch('http://localhost:5000/api/gold_prices');
    if (!response.ok) throw new Error('Failed to fetch gold price data');
    return await response.json();
    
  } catch (error) {
    console.error("Error fetching gold price data:", error);
    toast({
      title: "Error",
      description: "Failed to load gold price data. Please try again later.",
      variant: "destructive",
    });
    return { historical_data: [], future_predictions: [] };
  }
};

export const analyzeBuySellOpportunities = (data: GoldPriceResponse) => {
  if (!data.historical_data.length || !data.future_predictions.length) {
    return { buyDate: null, sellDate: null, potentialProfit: 0 };
  }

  // Combine historical and future data for analysis
  const allData = [...data.historical_data, ...data.future_predictions];
  
  // Find minimum price in next 3 months (buy opportunity)
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  
  const nearTermData = allData.filter(item => {
    const itemDate = new Date(item.Date);
    const now = new Date();
    return itemDate >= now && itemDate <= threeMonthsFromNow;
  });
  
  if (!nearTermData.length) {
    return { buyDate: null, sellDate: null, potentialProfit: 0 };
  }
  
  // Find minimum price in next 3 months (buy opportunity)
  const minPriceItem = nearTermData.reduce((min, item) => 
    item.price < min.price ? item : min, nearTermData[0]);
  
  // Find maximum price in future data after buy date (sell opportunity)
  const futurePrices = data.future_predictions.filter(item => 
    new Date(item.Date) > new Date(minPriceItem.Date));
  
  if (!futurePrices.length) {
    return { buyDate: minPriceItem.Date, sellDate: null, potentialProfit: 0 };
  }
  
  const maxPriceItem = futurePrices.reduce((max, item) => 
    item.price > max.price ? item : max, futurePrices[0]);
  
  const potentialProfit = maxPriceItem.price - minPriceItem.price;
  const profitPercentage = (potentialProfit / minPriceItem.price) * 100;
  
  return {
    buyDate: minPriceItem.Date,
    buyPrice: minPriceItem.price,
    sellDate: maxPriceItem.Date,
    sellPrice: maxPriceItem.price,
    potentialProfit,
    profitPercentage
  };
};