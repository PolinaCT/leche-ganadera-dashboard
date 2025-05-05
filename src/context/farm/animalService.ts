
import { Animal, Birth, MilkProduction } from '@/types';
import { toast } from 'sonner';

export const createAnimalService = (
  animals: Animal[],
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>,
  births: Birth[],
  milkProduction: MilkProduction[]
) => {
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

  return {
    getAnimalById,
    getAnimalName,
    addAnimal,
    updateAnimal,
    deleteAnimal
  };
};
