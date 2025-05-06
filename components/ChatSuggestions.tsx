import { CircleDollarSign, TrendingUp, Wallet, HelpCircle, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

type SuggestionProps = {
  onSelectSuggestion: (suggestion: string) => void;
};

export function ChatSuggestions({ onSelectSuggestion }: SuggestionProps) {
  const suggestions = [
    {
      text: "What were the key business highlights for TCS in the 2022-23 annual report?",
      icon: <TrendingUp className="h-3.5 w-3.5" />,
    },
    {
      text: "What are the fee income and expense ratios reported by CANBK_MF",
      icon: <Wallet className="h-3.5 w-3.5" />,
    },
    {
      text: "What were the key takeaways from the Board of Directors’ report for Tata Motors?",
      icon: <Landmark className="h-3.5 w-3.5" />,
    },
    {
      text: "Can you provide a detailed analysis of AXISBANK's revenue composition, including the percentage of revenue derived from key geographies, industries, and service lines across the last 10 financial years?",
      icon: <CircleDollarSign className="h-3.5 w-3.5" />,
    },
    {
      text: "ow has ICICIGI Mutual Fund adjusted its asset allocation strategy over the last five years, particularly during times of market volatility, and what impact did these adjustments have on fund performance?",
      icon: <HelpCircle className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="w-full flex flex-wrap gap-2 animate-fade-in">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto py-1.5 px-3 text-xs flex items-center gap-2 transition-all bg-white/50 backdrop-blur-sm hover:bg-white"
          onClick={() => onSelectSuggestion(suggestion.text)}
        >
          {suggestion.icon}
          <span className="text-xs font-normal">{suggestion.text}</span>
        </Button>
      ))}
    </div>
  );
}