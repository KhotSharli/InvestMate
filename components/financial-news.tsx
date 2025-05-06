// financial-news.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface FinancialNewsProps {
  articles: Article[];
}

export const FinancialNews: React.FC<FinancialNewsProps> = ({ articles }) => {
  if (!articles.length) {
    return <p className="text-center text-gray-600">No news available at the moment. Please check back later.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {articles.map((article, index) => (
        <Card key={index} className="shadow-md hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
          <CardHeader className="p-6 bg-gradient-to-r from-blue-50 to-white">
            <CardTitle className="text-xl font-semibold text-gray-800">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-2"
              >
                {article.title} 
                <ExternalLink className="w-5 h-5 text-blue-500 hover:text-blue-700" />
              </a>
            </CardTitle>
            <div className="mt-2 text-gray-500 text-sm">
              <span>{article.source}</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700">{article.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
