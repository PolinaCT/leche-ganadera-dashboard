
import { useState, useEffect } from 'react';
import { Birth } from '@/types';
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

interface BirthFormProps {
  birth?: Birth;
  animalId?: string;
  onSubmit: () => void;
  onCancel: () => void;
}

const BirthForm = ({ birth, animalId, onSubmit, onCancel }: BirthFormProps) => {
  const { animals, births, addBirth, updateBirth } = useFarm();
  
  const [selectedAnimalId, setSelectedAnimalId] = useState(birth?.animalId || animalId || '');
  const [birthNumber, setBirthNumber] = useState(birth?.birthNumber || 1);
  const [date, setDate] = useState(birth?.date || new Date().toISOString().split('T')[0]);
  const [motherWeight, setMotherWeight] = useState(birth?.motherWeight || 0);
  const [calfWeight, setCalfWeight] = useState(birth?.calfWeight || 0);
  const [calfGender, setCalfGender] = useState<'Macho' | 'Hembra'>(birth?.calfGender || 'Hembra');
  const [calfId, setCalfId] = useState(birth?.calfId || '');
  const [fatherId, setFatherId] = useState(birth?.fatherId || '');
  
  // Get female animals for mother selection
  const femaleAnimals = animals.filter(a => a.gender === 'Hembra');
  
  // Get male animals for father selection
  const maleAnimals = animals.filter(a => a.gender === 'Macho');
  
  // Get all animals that could be the calf
  const possibleCalves = animals.filter(a => 
    a.birthDate >= date && 
    a.gender === calfGender
  );
  
  // Automatically calculate birth number based on previous births
  useEffect(() => {
    if (!birth && selectedAnimalId) {
      const motherBirths = births.filter(b => b.animalId === selectedAnimalId);
      setBirthNumber(motherBirths.length + 1);
    }
  }, [selectedAnimalId, births, birth]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const birthData = {
      animalId: selectedAnimalId,
      birthNumber,
      date,
      motherWeight,
      calfWeight,
      calfGender,
      calfId: calfId || undefined,
      fatherId: fatherId || undefined,
    };
    
    if (birth) {
      updateBirth({ ...birthData, id: birth.id });
    } else {
      addBirth(birthData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="animal">Madre</Label>
          <Select 
            value={selectedAnimalId} 
            onValueChange={setSelectedAnimalId}
            disabled={!!animalId}
          >
            <SelectTrigger id="animal">
              <SelectValue placeholder="Seleccionar madre" />
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
          <Label htmlFor="birthNumber">Número de parto</Label>
          <Input 
            id="birthNumber" 
            type="number"
            value={birthNumber}
            onChange={(e) => setBirthNumber(parseInt(e.target.value))}
            required
            min={1}
          />
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
          <Label htmlFor="motherWeight">Peso de la madre (kg)</Label>
          <Input 
            id="motherWeight" 
            type="number"
            value={motherWeight}
            onChange={(e) => setMotherWeight(parseFloat(e.target.value))}
            required
            min={0}
            step={0.1}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="calfWeight">Peso de la cría (kg)</Label>
          <Input 
            id="calfWeight" 
            type="number"
            value={calfWeight}
            onChange={(e) => setCalfWeight(parseFloat(e.target.value))}
            required
            min={0}
            step={0.1}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="calfGender">Sexo de la cría</Label>
          <Select 
            value={calfGender} 
            onValueChange={(value: 'Macho' | 'Hembra') => setCalfGender(value)}
          >
            <SelectTrigger id="calfGender">
              <SelectValue placeholder="Seleccionar sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="calfId">Cría en inventario</Label>
          <Select 
            value={calfId} 
            onValueChange={setCalfId}
          >
            <SelectTrigger id="calfId">
              <SelectValue placeholder="Seleccionar cría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No especificada</SelectItem>
              {possibleCalves.map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fatherId">Padre</Label>
          <Select 
            value={fatherId} 
            onValueChange={setFatherId}
          >
            <SelectTrigger id="fatherId">
              <SelectValue placeholder="Seleccionar padre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No especificado</SelectItem>
              {maleAnimals.map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {birth ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default BirthForm;
