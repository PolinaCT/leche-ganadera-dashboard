
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface BarChartDisplayProps {
  data: Array<{ [key: string]: string | number }>;
  xAxisKey: string;
  dataKey: string;
  barName: string;
  barColor: string;
  formatter?: (value: any) => [string, string];
}

const BarChartDisplay = ({ 
  data, 
  xAxisKey, 
  dataKey, 
  barName, 
  barColor, 
  formatter 
}: BarChartDisplayProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ textAnchor: 'end', dy: 10 }}
            height={60}
          />
          <YAxis />
          <Tooltip formatter={formatter || ((value) => [`${value}`, barName])} />
          <Bar 
            dataKey={dataKey} 
            name={barName} 
            fill={barColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartDisplay;
