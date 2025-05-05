
import { createContext, useContext, useState, ReactNode } from 'react';
import { Animal, Birth, MilkProduction } from '@/types';
import { mockAnimals, mockBirths, mockMilkProduction } from '@/data/mockData';
import { FarmContextType } from './types';
import { createAnimalService } from './animalService';
import { createBirthService } from './birthService';
import { createMilkProductionService } from './milkProductionService';
import { createStatsService } from './statsService';

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [births, setBirths] = useState<Birth[]>(mockBirths);
  const [milkProduction, setMilkProduction] = useState<MilkProduction[]>(mockMilkProduction);

  // Services
  const animalService = createAnimalService(animals, setAnimals, births, milkProduction);
  const birthService = createBirthService(births, setBirths, milkProduction);
  const milkProductionService = createMilkProductionService(milkProduction, setMilkProduction);
  const statsService = createStatsService(animals, births);

  // Combine all services for the context value
  const contextValue: FarmContextType = {
    // Animals
    animals,
    ...animalService,
    
    // Births
    births,
    ...birthService,
    
    // Milk Production
    milkProduction,
    ...milkProductionService,
    
    // Stats
    ...statsService,
  };

  return (
    <FarmContext.Provider value={contextValue}>
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
