
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartDisplayProps {
  data: Array<{ [key: string]: string | number }>;
  dataKey: string;
  nameKey: string;
  colors: string[];
  formatter?: (value: any) => [string, string];
}

const PieChartDisplay = ({ data, dataKey, nameKey, colors, formatter }: PieChartDisplayProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            label={(entry) => entry[nameKey] as string}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatter || ((value) => [value as string, 'Cantidad'])} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartDisplay;
