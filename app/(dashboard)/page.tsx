"use client";

import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { FinancialNews } from "@/components/financial-news";
import { fetchBusinessNews } from "../api/[[...route]]/financialNews";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function DashboardPage() {
  const { data: summaryData } = useGetSummary();

  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorNews, setErrorNews] = useState("");

  const [riskAppetite, setRiskAppetite] = useState("Medium");
  const [term, setTerm] = useState("Long Term");
  const [age, setAge] = useState("");
  const [loan, setLoan] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");

  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getFinancialNews = async () => {
      setLoadingNews(true);
      try {
        const articles = await fetchBusinessNews();
        setNewsArticles(articles);
      } catch (err) {
        setErrorNews("Failed to fetch financial news.");
        console.error("Error fetching financial news:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    getFinancialNews();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5008/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Risk Appetite": riskAppetite,
          "Term": term,
          "Age": age,
          "Loan": loan,
          "Investment Amount": investmentAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      const typedError = err as Error;
      setError(typedError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-white p-2 shadow-md">
          <TabsTrigger value="overview" className="text-lg font-semibold text-gray-600 hover:text-gray-800 transition-all">
            Overview
          </TabsTrigger>
          <TabsTrigger value="news" className="text-lg font-semibold text-gray-600 hover:text-gray-800 transition-all">
            Financial News
          </TabsTrigger>
          <TabsTrigger value="recommendation" className="text-lg font-semibold text-gray-600 hover:text-gray-800 transition-all">
            Investment Recommendation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <DataGrid />
          </div>
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <DataCharts />
          </div>
        </TabsContent>

        <TabsContent value="news">
          {loadingNews ? (
            <p>Loading news...</p>
          ) : errorNews ? (
            <p className="text-red-500">{errorNews}</p>
          ) : (
            <FinancialNews articles={newsArticles} />
          )}
        </TabsContent>

        <TabsContent value="recommendation">
          <Card className="max-w-2xl mx-auto p-6 shadow-lg rounded-2xl bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personalize Your Investment Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Loan (in ₹)</label>
                <input
                  type="number"
                  placeholder="Total loan amount"
                  value={loan}
                  onChange={(e) => setLoan(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Investment Amount (in ₹)</label>
                <input
                  type="number"
                  placeholder="Planned investment amount"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Risk Appetite</label>
                <select
                  value={riskAppetite}
                  onChange={(e) => setRiskAppetite(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Investment Term</label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Short Term">Short Term</option>
                  <option value="Medium Term">Medium Term</option>
                  <option value="Long Term">Long Term</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={fetchRecommendations} 
              disabled={loading} 
              className="w-full py-3 text-lg rounded-xl"
            >
              {loading ? "Fetching Recommendations..." : "Get Recommendations"}
            </Button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </Card>

          <div className="mt-8 grid gap-4 w-full max-w-2xl mx-auto">
            {recommendations.map((name, index) => (
              <Card key={index} className="rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <p className="font-semibold text-gray-700">{name}</p>
                </CardContent>
              </Card>
            ))}

            {!loading && !error && recommendations.length === 0 && (
              <p className="text-gray-500 text-center">
                No recommendations yet. Fill in your details and click the button.
              </p>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default DashboardPage;
