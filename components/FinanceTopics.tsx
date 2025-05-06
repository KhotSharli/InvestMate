import { useState } from "react";
import { CircleDollarSign, LineChart, BarChart3, Landmark, PiggyBank, TrendingUp, CreditCard, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function TopicButton({ icon, label, isActive = false, onClick }: TopicButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function FinanceTopics() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const topics = [
    { icon: <BarChart3 className="h-4 w-4" />, label: "Investments" },
    { icon: <Landmark className="h-4 w-4" />, label: "Banking" },
    { icon: <CircleDollarSign className="h-4 w-4" />, label: "Taxation" },
    { icon: <LineChart className="h-4 w-4" />, label: "Markets" },
    { icon: <PiggyBank className="h-4 w-4" />, label: "Savings" },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Economy" },
    { icon: <CreditCard className="h-4 w-4" />, label: "Credit" },
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 no-scrollbar">
      <div className="flex space-x-2 min-w-max">
        {topics.map((topic, i) => (
          <TopicButton
            key={i}
            icon={topic.icon}
            label={topic.label}
            isActive={i === activeIndex}
            onClick={() => setActiveIndex(i)}
          />
        ))}
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <span>More</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}