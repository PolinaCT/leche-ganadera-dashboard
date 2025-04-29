
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExportButtons from '@/components/reports/ExportButtons';
import ProductionTab from '@/components/reports/ProductionTab';
import AnimalsTab from '@/components/reports/AnimalsTab';
import BirthsTab from '@/components/reports/BirthsTab';

const Reports = () => {
  const { animals, births, milkProduction, getProductionStats } = useFarm();
  
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
          <ExportButtons 
            onExportExcel={handleExportExcel} 
            onExportPDF={handleExportPDF} 
          />
        </div>
        
        <Tabs defaultValue="production">
          <TabsList>
            <TabsTrigger value="production">Producción de Leche</TabsTrigger>
            <TabsTrigger value="animals">Inventario</TabsTrigger>
            <TabsTrigger value="births">Partos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="production">
            <ProductionTab 
              milkProduction={milkProduction} 
              animals={animals} 
              getProductionStats={getProductionStats}
            />
          </TabsContent>
          
          <TabsContent value="animals">
            <AnimalsTab animals={animals} />
          </TabsContent>
          
          <TabsContent value="births">
            <BirthsTab births={births} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Reports;
