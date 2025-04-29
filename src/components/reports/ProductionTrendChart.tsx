
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ProductionTrendChartProps {
  productionChartData: Array<{ date: string; liters: number }>;
  formatDateForChart: (dateStr: string) => string;
}

const ProductionTrendChart = ({ productionChartData, formatDateForChart }: ProductionTrendChartProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={productionChartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDateForChart}
            interval={Math.ceil(productionChartData.length / 10)}
          />
          <YAxis 
            label={{ value: 'Litros', position: 'insideLeft', offset: -10 }}
          />
          <Tooltip 
            formatter={(value) => [`${value} litros`, 'Producción']}
            labelFormatter={(label) => `Fecha: ${new Date(label).toLocaleDateString('es-ES')}`}
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
