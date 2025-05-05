
import { Animal, Birth, MilkProduction } from '@/types';

export interface FarmContextType {
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
