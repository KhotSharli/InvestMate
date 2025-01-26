"use client"; // Add this line at the very top of the file

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { FinancialNews } from "@/components/financial-news";
import { fetchBusinessNews } from "../api/[[...route]]/financialNews"; // Verify this path
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain } from "lucide-react";
import { HfInference } from "@huggingface/inference";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

const AIAdvice = ({ userFinancialInfo }) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAdvice = async () => {
    setLoading(true);
    setError("");

    const prompt = `Ensure that each advice point is actionable and relevant to achieving financial stability.`;

    try {
      const response = await hf.textGeneration({
        model: "gpt2", // or another model
        inputs: prompt,
        parameters: { max_length: 200 },
      });
      setAdvice(response.generated_text);
    } catch (err) {
      console.error("Error generating advice:", err);
      setError(`Failed to generate advice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
      setError("Hugging Face API key is not set.");
      setLoading(false);
    } else {
      generateAdvice(); // Automatically generate advice when component mounts
    }
  }, [userFinancialInfo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">AI-Generated Financial Advice</CardTitle>
        <CardDescription>Get personalized financial recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        {advice ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Here's your personalized financial advice:</p>
            <ul className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm list-disc ml-5">
              {advice}
            </ul>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Button onClick={generateAdvice} disabled={loading}>
            {loading ? "Generating Advice..." : "Generate Advice"}
            {!loading && <Brain className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const { data: summaryData, isLoading, error } = useGetSummary();
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorNews, setErrorNews] = useState("");

  const userFinancialData = summaryData
    ? {
        income: summaryData.incomeAmount || 0,
        expenses: summaryData.expensesAmount || 0,
        savings: summaryData.remainingAmount || 0,
        investments: 10000, // Set if available in summaryData
        debt: 100, // Set if available in summaryData
      }
    : {
        income: 0,
        expenses: 0,
        savings: 0,
        investments: 10000,
        debt: 100,
      };

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

  return (
    <div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 rounded-lg bg-white p-2 shadow-md">
          <TabsTrigger value="overview" className="text-lg font-semibold text-gray-600 hover:text-gray-800 transition-all">
            Overview
          </TabsTrigger>
          <TabsTrigger value="news" className="text-lg font-semibold text-gray-600 hover:text-gray-800 transition-all">
            Financial News
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="mx-auto w-full max-w-screen-2xl pb-10">
            <AIAdvice userFinancialInfo={userFinancialData} />
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <DataGrid />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <DataCharts />
            </div>
          </div>
        </TabsContent>

        {/* Financial News Tab */}
        <TabsContent value="news">
          {loadingNews ? (
            <p>Loading news...</p>
          ) : errorNews ? (
            <p className="text-red-500">{errorNews}</p>
          ) : (
            <FinancialNews articles={newsArticles} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
