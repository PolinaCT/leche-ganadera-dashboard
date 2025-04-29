
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { MilkProduction as MilkProductionType, TimeRange } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import MilkProductionForm from '@/components/milk/MilkProductionForm';
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
  Legend
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Search, ChartBar, Trash2, Edit } from 'lucide-react';

const MilkProduction = () => {
  const { animals, milkProduction, getAnimalName, getProductionStats, deleteMilkProduction } = useFarm();
  
  const [searchText, setSearchText] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '365d'>('30d');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MilkProductionType | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Filter milk production records based on search, animal filter and time range
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
    case '365d':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 365);
      break;
  }
  
  // Filter records
  const filteredRecords = milkProduction.filter(record => {
    const animalName = getAnimalName(record.animalId).toLowerCase();
    const matchesSearch = animalName.includes(searchText.toLowerCase());
    const matchesAnimal = selectedAnimalId === '' || record.animalId === selectedAnimalId;
    const matchesTimeRange = new Date(record.date) >= startDate && new Date(record.date) <= today;
    
    return matchesSearch && matchesAnimal && matchesTimeRange;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Aggregate data by date for chart
  const aggregatedData = filteredRecords.reduce<Record<string, number>>((acc, record) => {
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
  
  // Aggregate data by animal
  const animalProduction = filteredRecords.reduce<Record<string, number>>((acc, record) => {
    const animalId = record.animalId;
    if (!acc[animalId]) {
      acc[animalId] = 0;
    }
    acc[animalId] += record.liters;
    return acc;
  }, {});
  
  // Convert to array and sort by production
  const animalChartData = Object.entries(animalProduction).map(([animalId, liters]) => ({
    animal: getAnimalName(animalId),
    animalId,
    liters,
  })).sort((a, b) => b.liters - a.liters);
  
  // Get production stats
  const productionStats = getProductionStats();
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };
  
  // Format date for chart
  const formatDateForChart = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };
  
  // Handle edit
  const handleEdit = (record: MilkProductionType) => {
    setSelectedRecord(record);
    setShowEditDialog(true);
  };
  
  // Handle delete
  const handleDelete = (record: MilkProductionType) => {
    setSelectedRecord(record);
    setShowDeleteDialog(true);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Producción de Leche</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Producción
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Producción diaria</p>
                  <p className="text-2xl font-bold mt-1">{productionStats.daily} L</p>
                </div>
                <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Producción semanal</p>
                  <p className="text-2xl font-bold mt-1">{productionStats.weekly} L</p>
                </div>
                <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Producción mensual</p>
                  <p className="text-2xl font-bold mt-1">{productionStats.monthly} L</p>
                </div>
                <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Producción anual</p>
                  <p className="text-2xl font-bold mt-1">{productionStats.annual} L</p>
                </div>
                <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre de vaca..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por vaca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las vacas</SelectItem>
                {animals
                  .filter(a => a.gender === 'Hembra')
                  .map(animal => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '365d') => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Periodo de tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="365d">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="by-animal">Por Animal</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Producción de Leche - Tendencia</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay datos para mostrar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="by-animal">
            <Card>
              <CardHeader>
                <CardTitle>Producción por Animal</CardTitle>
              </CardHeader>
              <CardContent>
                {animalChartData.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay datos para mostrar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>Registros de Producción</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRecords.length > 0 ? (
                  <div className="border rounded-md overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="text-left py-2 px-4">Fecha</th>
                          <th className="text-left py-2 px-4">Vaca</th>
                          <th className="text-left py-2 px-4">Litros</th>
                          <th className="text-left py-2 px-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((record) => (
                          <tr key={record.id} className="border-b last:border-0">
                            <td className="py-2 px-4">{formatDate(record.date)}</td>
                            <td className="py-2 px-4">
                              <Link 
                                to={`/inventario/${record.animalId}`} 
                                className="font-medium text-farm-blue hover:underline"
                              >
                                {getAnimalName(record.animalId)}
                              </Link>
                            </td>
                            <td className="py-2 px-4">{record.liters.toFixed(1)} L</td>
                            <td className="py-2 px-4">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(record)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay registros que coincidan con los filtros aplicados</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Production Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar nueva producción</DialogTitle>
          </DialogHeader>
          <MilkProductionForm 
            onSubmit={() => setShowAddDialog(false)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Production Dialog */}
      {selectedRecord && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar registro de producción</DialogTitle>
            </DialogHeader>
            <MilkProductionForm 
              production={selectedRecord}
              onSubmit={() => setShowEditDialog(false)}
              onCancel={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (selectedRecord) {
                  deleteMilkProduction(selectedRecord.id);
                }
                setShowDeleteDialog(false);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MilkProduction;
