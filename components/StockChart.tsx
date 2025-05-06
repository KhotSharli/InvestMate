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
  Filler
} from 'chart.js';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Register Chart.js components
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

interface StockChartProps {
  chartData: any;
  isLoading: boolean;
}

const StockChart = ({ chartData, isLoading }: StockChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'SF Pro Display, system-ui, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        titleColor: '#000',
        bodyColor: '#666',
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'easeInOutQuad',
        from: 0.8,
        to: 0.2,
        loop: false
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[450px] p-4 shadow-sm">
        <CardContent className="p-2 h-full flex flex-col">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[450px] p-4 shadow-sm animate-fade-in">
      <CardContent className="p-2 h-full">
        <div className="h-full">
          {chartData && <Line data={chartData} options={options} />}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;