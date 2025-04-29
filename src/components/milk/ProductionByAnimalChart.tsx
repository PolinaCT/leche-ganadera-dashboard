
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ProductionByAnimalChartProps {
  animalChartData: Array<{ animal: string; animalId: string; liters: number }>;
}

const ProductionByAnimalChart = ({ animalChartData }: ProductionByAnimalChartProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={animalChartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="animal" 
            tick={{ textAnchor: 'end', dy: 10 }}
            height={80}
          />
          <YAxis 
            label={{ value: 'Litros', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [`${value} litros`, 'Producción']}
          />
          <Legend />
          <Bar 
            dataKey="liters" 
            name="Litros" 
            fill="#4CAF50"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionByAnimalChart;
