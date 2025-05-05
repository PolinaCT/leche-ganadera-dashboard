
import { Birth, MilkProduction } from '@/types';
import { toast } from 'sonner';

export const createBirthService = (
  births: Birth[],
  setBirths: React.Dispatch<React.SetStateAction<Birth[]>>,
  milkProduction: MilkProduction[]
) => {
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

  return {
    getBirthsByAnimalId,
    addBirth,
    updateBirth,
    deleteBirth
  };
};
