
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Animal, Birth, MilkProduction } from '@/types';
import { mockAnimals, mockBirths, mockMilkProduction } from '@/data/mockData';
import { toast } from 'sonner';

interface FarmContextType {
  // Animals
  animals: Animal[];
  getAnimalById: (id: string) => Animal | undefined;
  getAnimalName: (id: string | undefined) => string;
  addAnimal: (animal: Omit<Animal, 'id'>) => void;
  updateAnimal: (animal: Animal) => void;
  deleteAnimal: (id: string) => void;
  
  // Births
  births: Birth[];
  getBirthsByAnimalId: (animalId: string) => Birth[];
  addBirth: (birth: Omit<Birth, 'id'>) => void;
  updateBirth: (birth: Birth) => void;
  deleteBirth: (id: string) => void;
  
  // Milk Production
  milkProduction: MilkProduction[];
  getDailyProductionByAnimalId: (animalId: string) => MilkProduction[];
  getProductionStats: () => {
    daily: number;
    weekly: number;
    monthly: number;
    annual: number;
  };
  addMilkProduction: (production: Omit<MilkProduction, 'id'>) => void;
  updateMilkProduction: (production: MilkProduction) => void;
  deleteMilkProduction: (id: string) => void;
  
  // Stats
  getActiveAnimalCount: () => number;
  getTotalBirths: () => number;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [births, setBirths] = useState<Birth[]>(mockBirths);
  const [milkProduction, setMilkProduction] = useState<MilkProduction[]>(mockMilkProduction);

  // Animal Functions
  const getAnimalById = (id: string) => {
    return animals.find(animal => animal.id === id);
  };

  const getAnimalName = (id: string | undefined) => {
    if (!id) return 'N/A';
    const animal = animals.find(animal => animal.id === id);
    return animal ? animal.name : 'N/A';
  };

  const addAnimal = (animal: Omit<Animal, 'id'>) => {
    const newAnimal: Animal = {
      ...animal,
      id: Date.now().toString(),
    };
    setAnimals(prev => [...prev, newAnimal]);
    toast.success('Animal agregado correctamente');
  };

  const updateAnimal = (animal: Animal) => {
    setAnimals(prev => prev.map(item => item.id === animal.id ? animal : item));
    toast.success('Animal actualizado correctamente');
  };

  const deleteAnimal = (id: string) => {
    // Check if animal has milk production records
    const hasMilkRecords = milkProduction.some(record => record.animalId === id);
    
    // Check if animal is referenced as mother or father
    const isParent = animals.some(animal => animal.motherId === id || animal.fatherId === id);
    
    // Check if animal is linked to a birth
    const isLinkedToBirth = births.some(birth => birth.calfId === id || birth.fatherId === id);
    
    if (hasMilkRecords || isParent || isLinkedToBirth) {
      toast.error('No se puede eliminar. Este animal está vinculado a otros registros.');
      return;
    }
    
    setAnimals(prev => prev.filter(animal => animal.id !== id));
    toast.success('Animal eliminado correctamente');
  };

  // Birth Functions
  const getBirthsByAnimalId = (animalId: string) => {
    return births.filter(birth => birth.animalId === animalId);
  };

  const addBirth = (birth: Omit<Birth, 'id'>) => {
    const newBirth: Birth = {
      ...birth,
      id: Date.now().toString(),
    };
    setBirths(prev => [...prev, newBirth]);
    toast.success('Parto registrado correctamente');
  };

  const updateBirth = (birth: Birth) => {
    setBirths(prev => prev.map(item => item.id === birth.id ? birth : item));
    toast.success('Registro de parto actualizado correctamente');
  };

  const deleteBirth = (id: string) => {
    // Check if birth has associated milk production records
    const hasMilkRecords = milkProduction.some(record => record.birthId === id);
    
    if (hasMilkRecords) {
      toast.error('No se puede eliminar. Este parto está vinculado a registros de producción.');
      return;
    }
    
    setBirths(prev => prev.filter(birth => birth.id !== id));
    toast.success('Registro de parto eliminado correctamente');
  };

  // Milk Production Functions
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

  // Stats Functions
  const getActiveAnimalCount = () => {
    return animals.filter(animal => animal.status === 'Activo').length;
  };

  const getTotalBirths = () => {
    return births.length;
  };

  return (
    <FarmContext.Provider value={{
      animals,
      getAnimalById,
      getAnimalName,
      addAnimal,
      updateAnimal,
      deleteAnimal,
      births,
      getBirthsByAnimalId,
      addBirth,
      updateBirth,
      deleteBirth,
      milkProduction,
      getDailyProductionByAnimalId,
      getProductionStats,
      addMilkProduction,
      updateMilkProduction,
      deleteMilkProduction,
      getActiveAnimalCount,
      getTotalBirths,
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
