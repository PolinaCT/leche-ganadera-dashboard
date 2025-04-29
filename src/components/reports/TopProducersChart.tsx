
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TopProducersChartProps {
  topCows: Array<{ animalId: string; name: string; liters: number }>;
}

const TopProducersChart = ({ topCows }: TopProducersChartProps) => {
  return (
    <div className="h-[400px]">
      {topCows.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={topCows} 
            layout="vertical"
            margin={{ left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              type="category"
              dataKey="name" 
              width={100}
            />
            <Tooltip 
              formatter={(value) => [`${value} litros`, 'Producción']}
            />
            <Bar 
              dataKey="liters" 
              fill="#4CAF50" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No hay datos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default TopProducersChart;
