
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import StatCard from '@/components/dashboard/StatCard';
import ProductionChart from '@/components/dashboard/ProductionChart';
import RecentBirths from '@/components/dashboard/RecentBirths';
import { Home, BarChart, Beef, Calendar } from 'lucide-react';

const Index = () => {
  const { getActiveAnimalCount, getTotalBirths, getProductionStats } = useFarm();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const productionStats = getProductionStats();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Animales Activos" 
            value={getActiveAnimalCount()}
            icon={<Beef size={24} />}
          />
          <StatCard 
            title="Total de Partos" 
            value={getTotalBirths()}
            icon={<Calendar size={24} />}
          />
          <StatCard 
            title="Producción Diaria" 
            value={`${productionStats.daily} L`}
            description="Total de litros hoy"
            icon={<BarChart size={24} />}
          />
          <StatCard 
            title="Producción Mensual" 
            value={`${productionStats.monthly} L`}
            description="Total de litros este mes"
            icon={<Home size={24} />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductionChart timeRange={timeRange} />
          </div>
          <div>
            <RecentBirths />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
