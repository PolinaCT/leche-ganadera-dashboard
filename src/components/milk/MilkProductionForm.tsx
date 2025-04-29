
import { useState, useEffect } from 'react';
import { MilkProduction } from '@/types';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface MilkProductionFormProps {
  production?: MilkProduction;
  animalId?: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const MilkProductionForm = ({ 
  production, 
  animalId, 
  onSubmit, 
  onCancel 
}: MilkProductionFormProps) => {
  const { animals, births, addMilkProduction, updateMilkProduction } = useFarm();
  
  const [selectedAnimalId, setSelectedAnimalId] = useState(production?.animalId || animalId || '');
  const [date, setDate] = useState(production?.date || new Date().toISOString().split('T')[0]);
  const [liters, setLiters] = useState(production?.liters || 0);
  const [birthId, setBirthId] = useState(production?.birthId || '');
  
  // Get female animals for cow selection
  const femaleAnimals = animals.filter(a => a.gender === 'Hembra' && a.status === 'Activo');
  
  // Get births for the selected animal
  const animalBirths = births.filter(b => b.animalId === selectedAnimalId);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productionData = {
      animalId: selectedAnimalId,
      date,
      liters,
      birthId: birthId || undefined,
    };
    
    if (production) {
      updateMilkProduction({ ...productionData, id: production.id });
    } else {
      addMilkProduction(productionData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="animal">Vaca</Label>
          <Select 
            value={selectedAnimalId} 
            onValueChange={setSelectedAnimalId}
            disabled={!!animalId}
          >
            <SelectTrigger id="animal">
              <SelectValue placeholder="Seleccionar vaca" />
            </SelectTrigger>
            <SelectContent>
              {femaleAnimals.map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input 
            id="date" 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="liters">Litros de leche</Label>
          <Input 
            id="liters" 
            type="number"
            value={liters}
            onChange={(e) => setLiters(parseFloat(e.target.value))}
            required
            min={0}
            step={0.1}
          />
        </div>
        
        {selectedAnimalId && animalBirths.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="birthId">Asociar a parto</Label>
            <Select 
              value={birthId} 
              onValueChange={setBirthId}
            >
              <SelectTrigger id="birthId">
                <SelectValue placeholder="Seleccionar parto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No asociar</SelectItem>
                {animalBirths.map(birth => (
                  <SelectItem key={birth.id} value={birth.id}>
                    Parto #{birth.birthNumber} - {new Date(birth.date).toLocaleDateString('es-ES')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {production ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default MilkProductionForm;
