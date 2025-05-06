import { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { format, isValid, parseISO } from "date-fns";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoricalNAV {
  date: string;
  nav: number;
}

interface PredictedNAV {
  date: string;
  predicted_nav: number;
}

interface FundChartProps {
  historicalData: HistoricalNAV[];
  futurePredictions: PredictedNAV[];
  isLoading: boolean;
}

const FundChart = ({ historicalData, futurePredictions, isLoading }: FundChartProps) => {
  const chartRef = useRef<ChartJS>(null);
  const [trendPercentage, setTrendPercentage] = useState<number | null>(null);
  const [trendDirection, setTrendDirection] = useState<"up" | "down" | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (futurePredictions.length > 1) {
      const firstPrediction = futurePredictions[0].predicted_nav;
      const lastPrediction = futurePredictions[futurePredictions.length - 1].predicted_nav;
      const change = ((lastPrediction - firstPrediction) / firstPrediction) * 100;
      setTrendPercentage(Math.abs(change));
      setTrendDirection(change >= 0 ? "up" : "down");
    }
  }, [futurePredictions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const sortedHistoricalData = [...historicalData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedFuturePredictions = [...futurePredictions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDates = (dateString: string) => {
    try {
      const parsedDate = parseISO(dateString);
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd MMM yyyy"); // Example: "03 Jan 2023"
      }
    } catch (e) {
      console.error("Invalid date:", dateString);
    }
    return dateString; // Return original if parsing fails
  };

  const chartData = {
    labels: [
      ...sortedHistoricalData.map((d) => formatDates(d.date)),
      ...sortedFuturePredictions.map((d) => formatDates(d.date)),
    ],
    datasets: [
      {
        label: "Actual NAV",
        data: [...sortedHistoricalData.map((d) => d.nav), ...Array(sortedFuturePredictions.length).fill(null)],
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74, 144, 226, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#4a90e2",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
      {
        label: "Predicted NAV",
        data: [...Array(sortedHistoricalData.length).fill(null), ...sortedFuturePredictions.map((d) => d.predicted_nav)],
        borderColor: "#f83838",
        backgroundColor: "rgba(56, 189, 248, 0.1)",
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#f83838",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animations: {
      tension: {
        duration: 1000,
        easing: "easeInOutQuad",
        from: 0.2,
        to: 0.4,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45, // Ensure readable rotation
          autoSkip: true,
          maxTicksLimit: 6, // Show only a few dates to prevent clutter
          color: "#94a3b8",
          callback: function (value, index, values) {
            const date = chartData.labels[index];
            return date; // Show formatted date labels
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },     
      y: {
        ticks: {
          color: "#94a3b8",
        },
        grid: {
          color: "rgba(203, 213, 225, 0.3)",
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 6,
          boxHeight: 6,
          padding: 20,
          color: "#475569",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        caretSize: 6,
        boxPadding: 6,
        displayColors: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-pulse-soft">
          <TrendingUp size={48} className="text-muted-foreground/50" />
        </div>
      </div>
    );
  }

  if (historicalData.length === 0 && futurePredictions.length === 0) {
    return null;
  }

  return (
    <div className={`transition-all duration-700 ease-out ${animate ? "opacity-100" : "opacity-0 translate-y-8"}`}>
      <div className="mb-4 flex flex-wrap gap-4 justify-start">
        {trendPercentage !== null && trendDirection && (
          <div className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                trendDirection === "up"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {trendDirection === "up" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{trendPercentage.toFixed(2)}%</span>
            </div>
            <span className="text-sm text-muted-foreground ml-2">
              {trendDirection === "up" ? "Projected Growth" : "Projected Decline"}
            </span>
          </div>
        )}
      </div>

      <div className="chart-container h-[400px]">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
        <div className="glass px-5 py-4 rounded-xl">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Historical Performance</h3>
          <div className="text-2xl font-semibold">
            {historicalData.length > 0
              ? historicalData[historicalData.length - 1].nav.toFixed(2)
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {historicalData.length > 0
              ? `Last updated on ${formatDates(historicalData[historicalData.length - 1].date)}`
              : "No historical data available"}
          </p>
        </div>

        <div className="glass px-5 py-4 rounded-xl">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Future Prediction</h3>
          <div className="text-2xl font-semibold">
            {futurePredictions.length > 0
              ? futurePredictions[futurePredictions.length - 1].predicted_nav.toFixed(2)
              : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {futurePredictions.length > 0
              ? `Predicted for ${formatDates(futurePredictions[futurePredictions.length - 1].date)}`
              : "No predictions available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundChart;