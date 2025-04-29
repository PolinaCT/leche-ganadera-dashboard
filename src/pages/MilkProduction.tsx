
import { useState } from 'react';
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
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { MilkProduction as MilkProductionType } from '@/types';
import MilkProductionForm from '@/components/milk/MilkProductionForm';
import { Plus } from 'lucide-react';

// Import our new components
import ProductionSummaryCards from '@/components/milk/ProductionSummaryCards';
import ProductionFilters from '@/components/milk/ProductionFilters';
import ProductionTrendChart from '@/components/milk/ProductionTrendChart';
import ProductionByAnimalChart from '@/components/milk/ProductionByAnimalChart';
import ProductionRecordsTable from '@/components/milk/ProductionRecordsTable';
import { useMilkProductionFilters } from '@/hooks/useMilkProductionFilters';

const MilkProduction = () => {
  const { animals, milkProduction, getAnimalName, getProductionStats, deleteMilkProduction } = useFarm();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MilkProductionType | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Get filtered data and filter controls from our custom hook
  const {
    searchText,
    setSearchText,
    selectedAnimalId,
    setSelectedAnimalId,
    timeRange,
    setTimeRange,
    filteredRecords,
    chartData,
    animalChartData,
    formatDate,
    formatDateForChart
  } = useMilkProductionFilters({ 
    milkProduction, 
    getAnimalName 
  });
  
  // Get production stats
  const productionStats = getProductionStats();
  
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
        <ProductionSummaryCards 
          daily={productionStats.daily}
          weekly={productionStats.weekly}
          monthly={productionStats.monthly}
          annual={productionStats.annual}
        />
        
        {/* Filters */}
        <ProductionFilters 
          searchText={searchText}
          setSearchText={setSearchText}
          selectedAnimalId={selectedAnimalId}
          setSelectedAnimalId={setSelectedAnimalId}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          animals={animals}
        />
        
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
                  <ProductionTrendChart 
                    chartData={chartData}
                    formatDate={formatDate}
                    formatDateForChart={formatDateForChart}
                  />
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
                  <ProductionByAnimalChart animalChartData={animalChartData} />
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
                <ProductionRecordsTable 
                  records={filteredRecords}
                  formatDate={formatDate}
                  getAnimalName={getAnimalName}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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
