
import { MilkProduction } from '@/types';
import { toast } from 'sonner';

export const createMilkProductionService = (
  milkProduction: MilkProduction[],
  setMilkProduction: React.Dispatch<React.SetStateAction<MilkProduction[]>>
) => {
  const getDailyProductionByAnimalId = (animalId: string) => {
    return milkProduction.filter(record => record.animalId === animalId);
  };

  const getProductionStats = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const todayStr = today.toISOString().split('T')[0];

    const dailyProduction = milkProduction
      .filter(record => record.date === todayStr)
      .reduce((sum, record) => sum + record.liters, 0);
      
    const weeklyProduction = milkProduction
      .filter(record => new Date(record.date) >= oneWeekAgo)
      .reduce((sum, record) => sum + record.liters, 0);
      
    const monthlyProduction = milkProduction
      .filter(record => new Date(record.date) >= oneMonthAgo)
      .reduce((sum, record) => sum + record.liters, 0);
      
    const annualProduction = milkProduction
      .filter(record => new Date(record.date) >= oneYearAgo)
      .reduce((sum, record) => sum + record.liters, 0);
    
    return {
      daily: parseFloat(dailyProduction.toFixed(1)),
      weekly: parseFloat(weeklyProduction.toFixed(1)),
      monthly: parseFloat(monthlyProduction.toFixed(1)),
      annual: parseFloat(annualProduction.toFixed(1))
    };
  };

  const addMilkProduction = (production: Omit<MilkProduction, 'id'>) => {
    const newProduction: MilkProduction = {
      ...production,
      id: Date.now().toString(),
    };
    setMilkProduction(prev => [...prev, newProduction]);
    toast.success('Producción de leche registrada correctamente');
  };

  const updateMilkProduction = (production: MilkProduction) => {
    setMilkProduction(prev => prev.map(item => item.id === production.id ? production : item));
    toast.success('Registro de producción actualizado correctamente');
  };

  const deleteMilkProduction = (id: string) => {
    setMilkProduction(prev => prev.filter(record => record.id !== id));
    toast.success('Registro de producción eliminado correctamente');
  };

  return {
    getDailyProductionByAnimalId,
    getProductionStats,
    addMilkProduction,
    updateMilkProduction,
    deleteMilkProduction
  };
};
