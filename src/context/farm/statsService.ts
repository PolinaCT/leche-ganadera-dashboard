
import { Animal, Birth } from '@/types';

export const createStatsService = (animals: Animal[], births: Birth[]) => {
  const getActiveAnimalCount = () => {
    return animals.filter(animal => animal.status === 'Activo').length;
  };

  const getTotalBirths = () => {
    return births.length;
  };

  return {
    getActiveAnimalCount,
    getTotalBirths
  };
};
