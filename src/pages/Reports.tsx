
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download } from 'lucide-react';

const Reports = () => {
  const { animals, births, milkProduction, getProductionStats } = useFarm();
  
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  
  // Prepare data for reports
  
  // Animals by breed
  const animalsByBreed = animals.reduce<Record<string, number>>((acc, animal) => {
    const breed = animal.breed;
    if (!acc[breed]) {
      acc[breed] = 0;
    }
    acc[breed]++;
    return acc;
  }, {});
  
  const breedChartData = Object.entries(animalsByBreed).map(([breed, count]) => ({
    breed,
    count,
  }));
  
  // Animals by gender
  const animalsByGender = animals.reduce<Record<string, number>>((acc, animal) => {
    const gender = animal.gender;
    if (!acc[gender]) {
      acc[gender] = 0;
    }
    acc[gender]++;
    return acc;
  }, {});
  
  const genderChartData = Object.entries(animalsByGender).map(([gender, count]) => ({
    gender,
    count,
  }));
  
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
  
  // Milk production over time
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
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Mock export functionality
  const handleExportExcel = () => {
    alert('Esta función exportaría los datos a Excel en una implementación real');
  };
  
  const handleExportPDF = () => {
    alert('Esta función exportaría los datos a PDF en una implementación real');
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
          <div className="flex gap-2">
            <Button onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Exportar a Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exportar a PDF
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="production">
          <TabsList>
            <TabsTrigger value="production">Producción de Leche</TabsTrigger>
            <TabsTrigger value="animals">Inventario</TabsTrigger>
            <TabsTrigger value="births">Partos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="production">
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
                          label={{ value: 'Litros', angle: -90, position: 'insideLeft' }}
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
                </CardContent>
              </Card>
              
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Top Vacas Productoras</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
              
              <Card className="md:col-span-12">
                <CardHeader>
                  <CardTitle>Resumen de Producción</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Producción Diaria</p>
                      <p className="text-3xl font-bold">{getProductionStats().daily} L</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Producción Semanal</p>
                      <p className="text-3xl font-bold">{getProductionStats().weekly} L</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Producción Mensual</p>
                      <p className="text-3xl font-bold">{getProductionStats().monthly} L</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Producción Anual</p>
                      <p className="text-3xl font-bold">{getProductionStats().annual} L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="animals">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="md:col-span-6">
                <CardHeader>
                  <CardTitle>Distribución por Raza</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={breedChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="breed"
                          label={(entry) => entry.breed}
                        >
                          {breedChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} animales`, 'Cantidad']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-6">
                <CardHeader>
                  <CardTitle>Distribución por Sexo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="gender"
                          label={(entry) => entry.gender}
                        >
                          <Cell key="cell-0" fill="#2196F3" />
                          <Cell key="cell-1" fill="#4CAF50" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} animales`, 'Cantidad']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-12">
                <CardHeader>
                  <CardTitle>Resumen de Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Total Animales</p>
                      <p className="text-3xl font-bold">{animals.length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Animales Activos</p>
                      <p className="text-3xl font-bold">{animals.filter(a => a.status === 'Activo').length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Vacas en Producción</p>
                      <p className="text-3xl font-bold">
                        {animals.filter(a => a.gender === 'Hembra' && a.status === 'Activo').length}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Toros</p>
                      <p className="text-3xl font-bold">
                        {animals.filter(a => a.gender === 'Macho').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="births">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="md:col-span-12">
                <CardHeader>
                  <CardTitle>Partos por Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={birthChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ textAnchor: 'end', dy: 10 }}
                          height={60}
                        />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} partos`, 'Cantidad']} />
                        <Bar 
                          dataKey="count" 
                          name="Partos" 
                          fill="#8884D8"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-12">
                <CardHeader>
                  <CardTitle>Resumen de Partos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Total Partos</p>
                      <p className="text-3xl font-bold">{births.length}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Crías Macho</p>
                      <p className="text-3xl font-bold">
                        {births.filter(b => b.calfGender === 'Macho').length}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Crías Hembra</p>
                      <p className="text-3xl font-bold">
                        {births.filter(b => b.calfGender === 'Hembra').length}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">% Éxito</p>
                      <p className="text-3xl font-bold">100%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
