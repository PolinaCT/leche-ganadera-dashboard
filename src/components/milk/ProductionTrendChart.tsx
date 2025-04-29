
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ProductionTrendChartProps {
  chartData: Array<{ date: string; liters: number }>;
  formatDate: (dateStr: string) => string;
  formatDateForChart: (dateStr: string) => string;
}

const ProductionTrendChart = ({ chartData, formatDate, formatDateForChart }: ProductionTrendChartProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDateForChart}
          />
          <YAxis 
            label={{ value: 'Litros', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value} litros`, 'Producción']}
            labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
          />
          <Line 
            type="monotone" 
            dataKey="liters" 
            stroke="#2196F3" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionTrendChart;
