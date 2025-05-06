import { toast } from "sonner";

export interface GoldPriceData {
  date: string;
  price: number;
  type: string; // "historical", "predicted", "lstm"
}

// Function to fetch gold price data from API
export async function fetchGoldPrices(): Promise<GoldPriceData[]> {
  try {
    // For development we'll use mock data if the API is not available
    const response = await fetch("http://localhost:5000/api/gold-prices");
    
    if (!response.ok) {
      console.log("API not available, using mock data");
      return generateMockData();
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching gold prices:", error);
    toast.error("Could not fetch gold price data, using sample data instead");
    return generateMockData();
  }
}

// Generate mock data for development and when API is unavailable
function generateMockData(): GoldPriceData[] {
  const mockData: GoldPriceData[] = [];
  const today = new Date();
  
  // Generate historical data (past 30 days) - starts higher and generally trends down with some fluctuations
  let lastPrice = 75000; // Starting price
  for (let i = 30; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Small fluctuation with overall downward trend, then slight upward near the end
    let variation = Math.random() * 2000 - 1000;
    if (i > 20) variation -= 500; // Down trend at first
    else if (i < 10) variation += 300; // Slight up trend at the end
    
    lastPrice += variation;
    if (lastPrice < 60000) lastPrice = 60000 + Math.random() * 1000;
    if (lastPrice > 80000) lastPrice = 80000 - Math.random() * 1000;
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      price: lastPrice,
      type: "historical"
    });
  }
  
  // Generate RNN prediction data (next 30 days) - starts where historical left off and trends up
  lastPrice = mockData[mockData.length - 1].price;
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Upward trend with small variations
    lastPrice += Math.random() * 500 + 100;
    if (lastPrice > 85000) lastPrice = 85000 - Math.random() * 500;
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      price: lastPrice,
      type: "predicted"
    });
  }
  
  // Generate LSTM prediction data (next 30 days) - similar to RNN but with slight differences
  lastPrice = mockData[mockData.length - 30].price; // Start from the same point as RNN
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Similar but slightly different prediction
    lastPrice += Math.random() * 400 + 150;
    if (lastPrice > 86000) lastPrice = 86000 - Math.random() * 400;
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      price: lastPrice,
      type: "lstm"
    });
  }
  
  return mockData;
}

// Calculate optimal investment day based on price data
export function calculateOptimalInvestmentDay(data: GoldPriceData[]): number {
  // Filter to get only predicted data
  const predictedData = data.filter(item => item.type === "predicted");
  
  if (predictedData.length === 0) return 0;
  
  // Find the day with the lowest price
  let lowestPrice = Number.MAX_VALUE;
  let optimalDayIndex = 0;
  
  predictedData.forEach((item, index) => {
    if (item.price < lowestPrice) {
      lowestPrice = item.price;
      optimalDayIndex = index;
    }
  });
  
  return optimalDayIndex;
}

// Calculate potential returns based on investment amount and price data
export function calculatePotentialReturns(
  amount: number,
  buyDay: number,
  sellDay: number,
  data: GoldPriceData[]
): { buyPrice: number; sellPrice: number; returns: number; percentChange: number } {
  const predictedData = data.filter(item => item.type === "predicted");
  
  if (predictedData.length === 0 || buyDay >= predictedData.length || sellDay >= predictedData.length) {
    return { buyPrice: 0, sellPrice: 0, returns: 0, percentChange: 0 };
  }
  
  const buyPrice = predictedData[buyDay].price;
  const sellPrice = predictedData[sellDay].price;
  const goldAmount = amount / buyPrice;
  const futureValue = goldAmount * sellPrice;
  const returns = futureValue - amount;
  const percentChange = (returns / amount) * 100;
  
  return {
    buyPrice,
    sellPrice,
    returns,
    percentChange
  };
}