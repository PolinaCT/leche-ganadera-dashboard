
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductionTrendChart from "./ProductionTrendChart";
import TopProducersChart from "./TopProducersChart";
import StatsGrid from "./StatsGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ProductionTabProps {
  milkProduction: Array<any>;
  animals: Array<any>;
  getProductionStats: () => any;
}

const ProductionTab = ({ milkProduction, animals, getProductionStats }: ProductionTabProps) => {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  
  // Prepare data for reports
  const today = new Date();
  const productionPeriodStart = new Date(today);
  switch (timeRange) {
    case 'month':
      productionPeriodStart.setMonth(today.getMonth() - 1);
      break;
    case 'quarter':
      productionPeriodStart.setMonth(today.getMonth() - 3);
      break;
    case 'year':
      productionPeriodStart.setFullYear(today.getFullYear() - 1);
      break;
  }
  
  // Filter milk production records for the selected time range
  const filteredProduction = milkProduction.filter(record => 
    new Date(record.date) >= productionPeriodStart
  );
  
  // Aggregate data by date
  const productionByDate = filteredProduction.reduce<Record<string, number>>((acc, record) => {
    const date = record.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += record.liters;
    return acc;
  }, {});
  
  // Convert to array and sort by date
  const productionChartData = Object.entries(productionByDate).map(([date, liters]) => ({
    date,
    liters,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Format date for chart
  const formatDateForChart = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  // Get top producing cows
  const cowProduction = filteredProduction.reduce<Record<string, number>>((acc, record) => {
    const animalId = record.animalId;
    if (!acc[animalId]) {
      acc[animalId] = 0;
    }
    acc[animalId] += record.liters;
    return acc;
  }, {});
  
  const topCows = Object.entries(cowProduction)
    .map(([animalId, liters]) => {
      const animal = animals.find(a => a.id === animalId);
      return {
        animalId,
        name: animal ? animal.name : 'Desconocido',
        liters,
      };
    })
    .sort((a, b) => b.liters - a.liters)
    .slice(0, 5);
    
  const productionStats = [
    { label: 'Producción Diaria', value: `${getProductionStats().daily} L` },
    { label: 'Producción Semanal', value: `${getProductionStats().weekly} L` },
    { label: 'Producción Mensual', value: `${getProductionStats().monthly} L` },
    { label: 'Producción Anual', value: `${getProductionStats().annual} L` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="md:col-span-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tendencia de Producción</CardTitle>
            <Select value={timeRange} onValueChange={(value: 'month' | 'quarter' | 'year') => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Periodo de tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ProductionTrendChart 
            productionChartData={productionChartData} 
            formatDateForChart={formatDateForChart}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Top Vacas Productoras</CardTitle>
        </CardHeader>
        <CardContent>
          <TopProducersChart topCows={topCows} />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-12">
        <CardHeader>
          <CardTitle>Resumen de Producción</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsGrid stats={productionStats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionTab;
