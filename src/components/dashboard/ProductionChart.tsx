
import { useFarm } from '@/context/FarmContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductionChartProps {
  timeRange: '7d' | '30d' | '90d';
}

const ProductionChart = ({ timeRange }: ProductionChartProps) => {
  const { milkProduction } = useFarm();
  
  const today = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case '7d':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case '30d':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
    case '90d':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 90);
      break;
  }
  
  // Filter data by date range
  const filteredData = milkProduction.filter(
    record => new Date(record.date) >= startDate && new Date(record.date) <= today
  );
  
  // Aggregate data by date
  const aggregatedData = filteredData.reduce<Record<string, number>>((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += record.liters;
    return acc;
  }, {});
  
  // Convert to array and sort by date
  const chartData = Object.entries(aggregatedData).map(([date, liters]) => ({
    date,
    liters,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  return (
    <div className="dashboard-card h-[300px]">
      <h3 className="card-header">Producción de Leche</h3>
      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}L`}
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
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductionChart;
