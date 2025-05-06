"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import StockSelector from "@/components/StockSelector";
import StockChart from "@/components/StockChart";
import StockStats from "@/components/StockStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const STOCK_OPTIONS = [
  { value: "ABB", label: "ABB India" },
  { value: "ADANIPORTS", label: "Adani Ports" },
  { value: "APOLLOHOSP", label: "Apollo Hospitals" },
  { value: "ASIANPAINT", label: "Asian Paints" },
  { value: "AUROPHARMA", label: "Aurobindo Pharma" },
  { value: "axisbank", label: "Axis Bank" },
  { value: "BAJAJ-AUTO", label: "Bajaj Auto" },
  { value: "BAJAJFINSV", label: "Bajaj Finserv" },
  { value: "BAJFINANCE", label: "Bajaj Finance" },
  { value: "BALKRISIND", label: "Balkrishna Industries" },
  { value: "BANKBARODA", label: "Bank of Baroda" },
  { value: "BERGEPAINT", label: "Berger Paints" },
  { value: "BHARTIARTL", label: "Bharti Airtel" },
  { value: "BIOCON", label: "Biocon" },
  { value: "BOSCHLTD", label: "Bosch" },
  { value: "BPCL", label: "Bharat Petroleum (BPCL)" },
  { value: "BRITIANNIA", label: "Britannia Industries" },
  { value: "CANBK", label: "Canara Bank" },
  { value: "CIPLA", label: "Cipla" },
  { value: "COALINDIA", label: "Coal India" },
  { value: "CONCOR", label: "Container Corporation (CONCOR)" },
  { value: "DIVISLAB", label: "Divi's Laboratories" },
  { value: "DLF", label: "DLF Limited" },
  { value: "DRREDDY", label: "Dr. Reddy's Laboratories" },
  { value: "EICHERMOT", label: "Eicher Motors" },
  { value: "EXIDEIND", label: "Exide Industries" },
  { value: "GAIL", label: "GAIL India" },
  { value: "GODREJCP", label: "Godrej Consumer Products" },
  { value: "GODREJPROP", label: "Godrej Properties" },
  { value: "HAVELLS", label: "Havells India" },
  { value: "HCLTECH", label: "HCL Technologies" },
  { value: "HDFCBANK", label: "HDFC Bank" },
  { value: "HDFCLIFE", label: "HDFC Life Insurance" },
  { value: "HINDALCO", label: "Hindalco Industries" },
  { value: "HINDUNILVR", label: "Hindustan Unilever (HUL)" },
  { value: "ICICIBANK", label: "ICICI Bank" },
  { value: "ICICIG", label: "ICICI General Insurance" },
  { value: "IDBI", label: "IDBI Bank" },
  { value: "IDFCFIRSTB", label: "IDFC First Bank" },
  { value: "INDHOTEL", label: "Indian Hotels Company" },
  { value: "INDIGO", label: "InterGlobe Aviation (IndiGo)" },
  { value: "INDUSINDBK", label: "IndusInd Bank" },
  { value: "INFY", label: "Infosys" },
  { value: "ITC", label: "ITC Limited" },
  { value: "KOTAKBANK", label: "Kotak Mahindra Bank" },
  { value: "LT", label: "Larsen & Toubro (L&T)" },
  { value: "LUPIN", label: "Lupin Limited" },
  { value: "MAHINDRA", label: "Mahindra & Mahindra" },
  { value: "MANAPPURAM", label: "Manappuram Finance" },
  { value: "MARUTI", label: "Maruti Suzuki" },
  { value: "MFSL", label: "Max Financial Services" },
  { value: "NESTLEIND", label: "Nestle India" },
  { value: "NTPC", label: "NTPC Limited" },
  { value: "ONGC", label: "Oil and Natural Gas Corp (ONGC)" },
  { value: "PEL", label: "Piramal Enterprises" },
  { value: "PIDILITIND", label: "Pidilite Industries" },
  { value: "PNB", label: "Punjab National Bank (PNB)" },
  { value: "POWERGRID", label: "Power Grid Corporation" },
  { value: "reliance", label: "Reliance Industries" },
  { value: "SBILIFE", label: "SBI Life Insurance" },
  { value: "SBIN", label: "State Bank of India (SBI)" },
  { value: "SEIMENS", label: "Siemens India" },
  { value: "SHREECEM", label: "Shree Cement" },
  { value: "SUNPHARMA", label: "Sun Pharmaceutical" },
  { value: "TATAMOTORS", label: "Tata Motors" },
  { value: "TATASTEEL", label: "Tata Steel" },
  { value: "TCS", label: "Tata Consultancy Services (TCS)" },
  { value: "TECH_MAHINDRA", label: "Tech Mahindra" },
  { value: "TITAN", label: "Titan Company" },
  { value: "TORNTPHARM", label: "Torrent Pharmaceuticals" },
  { value: "ULTRACEMCO", label: "UltraTech Cement" },
  { value: "VOLTAS", label: "Voltas Ltd" },
  { value: "WIPRO", label: "Wipro" }
];

export default function PredictPage() {
  const [stock, setStock] = useState<string>("SBIN");
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5003/predict/${stock}`);
      const data = await response.json();

      if (response.ok && data.historical && data.predictions) {
        const { indices: historicalIndices, prices: historicalPrices } = data.historical;
        const { indices: predictionIndices, prices: predictionPrices } = data.predictions;

        const last60Indices = historicalIndices.slice(-60);
        const last60Prices = historicalPrices.slice(-60);

        const graphData = {
          labels: [...last60Indices, ...predictionIndices],
          datasets: [
            {
              label: `Historical Prices (Last 60 Days)`,
              data: [...last60Prices, ...Array(predictionPrices.length).fill(null)],
              borderColor: "rgba(34, 139, 230, 1)",
              backgroundColor: "rgba(34, 139, 230, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointBackgroundColor: "rgba(34, 139, 230, 1)",
              borderWidth: 2
            },
            {
              label: `Predicted Prices (LSTM)`,
              data: [...Array(last60Prices.length).fill(null), ...predictionPrices],
              borderColor: "rgba(245, 101, 101, 1)",
              borderDash: [5, 5],
              fill: false,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 5,
              pointBackgroundColor: "rgba(245, 101, 101, 1)",
              borderWidth: 2
            }
          ]
        };
        setChartData(graphData);
      } else {
        setError(data.error || "Unexpected error occurred.");
        toast.error(data.error || "Failed to load prediction data.");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to prediction server.");
      toast.error("Failed to connect to prediction server. Ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="w-full max-w-3xl mx-auto text-center mb-8 p-5 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-red-700">⚠️ Investment Disclaimer</h3>
        <p className="text-sm text-red-600 mt-2">
          Stock price predictions are based on historical data and machine learning models.
          These forecasts <strong>do not guarantee future performance</strong> and should not be the sole basis for investment decisions.
          Always conduct independent research and consult a financial advisor before investing.
        </p>
      </div>

      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Stock Prediction Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered stock price predictions for the Indian market.
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Select a stock</p>
            <StockSelector
              value={stock}
              onChange={(val) => setStock(val)}
              options={STOCK_OPTIONS}
            />
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-1 h-9 bg-white/60 backdrop-blur-sm"
            onClick={fetchPrediction}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <ArrowRight className="h-3 w-3 mr-1" />
            )}
            Refresh Prediction
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <StockStats stockName={stock} chartData={chartData} isLoading={isLoading} />

          <div className="mt-4">
            <StockChart chartData={chartData} isLoading={isLoading} />
          </div>

          <Card className="shadow-sm mt-4 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                About This Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Predictions are generated using an LSTM model trained on historical market data.
                The model analyzes patterns and trends to forecast price movements for the next 30 days.
                These predictions should be used as one of many tools in your investment decision process.
              </p>
              <div className="flex items-center mt-4">
                <div className="w-3 h-3 rounded-full bg-[rgba(34,139,230,1)] mr-2"></div>
                <span className="text-sm mr-4">Historical Data</span>
                <div className="w-3 h-3 rounded-full bg-[rgba(245,101,101,1)] mr-2"></div>
                <span className="text-sm">Predicted Data</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
