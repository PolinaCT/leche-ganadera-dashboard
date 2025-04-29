
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarChartDisplay from "./BarChartDisplay";
import StatsGrid from "./StatsGrid";

interface BirthsTabProps {
  births: Array<any>;
}

const BirthsTab = ({ births }: BirthsTabProps) => {
  // Births by month
  const birthsByMonth = births.reduce<Record<string, number>>((acc, birth) => {
    const date = new Date(birth.date);
    const month = date.toLocaleString('default', { month: 'long' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month]++;
    return acc;
  }, {});
  
  // Get all month names in Spanish
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const birthChartData = monthNames.map(month => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    count: birthsByMonth[month] || 0,
  }));
  
  const birthStats = [
    { label: 'Total Partos', value: births.length },
    { label: 'Crías Macho', value: births.filter(b => b.calfGender === 'Macho').length },
    { label: 'Crías Hembra', value: births.filter(b => b.calfGender === 'Hembra').length },
    { label: '% Éxito', value: '100%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="md:col-span-12">
        <CardHeader>
          <CardTitle>Partos por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChartDisplay
            data={birthChartData}
            xAxisKey="month"
            dataKey="count"
            barName="Partos"
            barColor="#8884D8"
            formatter={(value) => [`${value} partos`, 'Cantidad']}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-12">
        <CardHeader>
          <CardTitle>Resumen de Partos</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsGrid stats={birthStats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BirthsTab;
