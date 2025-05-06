"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FundSelector from "@/components/FundSelector";
import FundChart from "@/components/FundChart";

interface MutualFundOption {
  value: string;
  label: string;
}

interface HistoricalNAV {
  date: string;
  nav: number;
}

interface PredictedNAV {
  date: string;
  predicted_nav: number;
}

const Page = () => {
  const [funds, setFunds] = useState<MutualFundOption[]>([]);
  const [selectedFund, setSelectedFund] = useState<MutualFundOption | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalNAV[]>([]);
  const [futurePredictions, setFuturePredictions] = useState<PredictedNAV[]>([]);
  const [isLoadingFunds, setIsLoadingFunds] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);

  /** Fetch the list of mutual funds */
  useEffect(() => {
    const fetchFunds = async () => {
      setIsLoadingFunds(true);
      try {
        const { data } = await axios.get("http://127.0.0.1:5002/get_funds");
        setFunds(data.mutual_funds.map((fund: string) => ({ value: fund, label: fund })));
      } catch (error) {
        console.error("Error fetching funds:", error);
        toast.error("Failed to load mutual funds. Please try again later.");
      } finally {
        setIsLoadingFunds(false);
      }
    };
    fetchFunds();
  }, []);

  /** Fetch historical and predicted NAV data */
  useEffect(() => {
    if (!selectedFund?.value) return;

    const fetchFundData = async () => {
      setIsLoadingData(true);
      try {
        const { data } = await axios.post("http://127.0.0.1:5002/get_fund_data", {
          fund_name: selectedFund.value,
        });

        setHistoricalData(data.historical_data.map((d: any) => ({ date: d.date, nav: d.nav })));
        setFuturePredictions(
          data.future_predictions.map((d: any) => ({ date: d.date, predicted_nav: d.predicted_nav }))
        );

        toast.success("Data loaded successfully");
      } catch (error) {
        console.error("Error fetching fund data:", error);
        toast.error("Failed to load fund data. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchFundData();
  }, [selectedFund]);

  /** Handle Fund Selection */
  const handleSelectFund = (option: MutualFundOption | null) => {
    setSelectedFund(option);
    setHistoricalData([]);
    setFuturePredictions([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-3 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 shadow-md">
            Powered by AI Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm">
            Mutual Fund Navigator
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Visualize past performance and explore AI-powered predictions for mutual fund NAVs with ease.
          </p>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md border border-red-300 max-w-4xl mx-auto">
          <p className="font-semibold">Disclaimer:</p>
          <p className="text-sm mt-1">
            The mutual fund predictions displayed on this page are generated using AI-based models and are for informational purposes only.
            Actual NAVs may vary due to market fluctuations and external factors. Mutual funds are subject to market risks.
            Please read all scheme-related documents carefully before investing.
          </p>
        </div>

        {/* Fund Selector */}
        <div className="flex justify-center relative z-50">
          <div className="glass p-6 rounded-lg shadow-lg bg-white/90 backdrop-blur-md w-full max-w-lg border border-gray-200">
            <FundSelector
              funds={funds}
              selectedFund={selectedFund}
              onSelectFund={handleSelectFund}
              isLoading={isLoadingFunds}
            />
          </div>
        </div>

        {/* Data Loading or Chart Display */}
        <div className="mt-6">
          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center h-[400px] rounded-lg shadow-lg p-6 bg-white/90 backdrop-blur-md border border-gray-200">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <span className="mt-4 text-gray-600 font-medium">Fetching fund data...</span>
            </div>
          ) : selectedFund ? (
            historicalData.length === 0 && futurePredictions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] rounded-lg shadow-lg p-6 bg-white/90 backdrop-blur-md border border-gray-200">
                <p className="text-gray-500 font-medium">No data available for this fund.</p>
              </div>
            ) : (
              <div className="chart-container bg-white/90 rounded-lg shadow-lg p-6">
                <FundChart
                  historicalData={historicalData}
                  futurePredictions={futurePredictions}
                  isLoading={isLoadingData}
                />
              </div>
            )
          ) : (
            <div className="text-center p-12 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">Select a Mutual Fund</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Choose a mutual fund from the dropdown above to view historical performance and future predictions.
              </p>
            </div>
          )}
        </div>

        {/* External Links Section */}
        <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900">Learn More</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
            <li>
              <a
                href="https://www.sebi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Securities and Exchange Board of India (SEBI)
              </a>
            </li>
            <li>
              <a
                href="https://www.amfiindia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Association of Mutual Funds in India (AMFI)
              </a>
            </li>
            <li>
              <a
                href="https://www.investopedia.com/mutual-funds-4427785"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Mutual Fund Basics - Investopedia
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
