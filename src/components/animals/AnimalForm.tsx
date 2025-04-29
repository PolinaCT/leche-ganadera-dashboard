
import { useState } from 'react';
import { Animal } from '@/types';
import { useFarm } from '@/context/FarmContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AnimalFormProps {
  animal?: Animal;
  onSubmit: () => void;
  onCancel: () => void;
}

const AnimalForm = ({ animal, onSubmit, onCancel }: AnimalFormProps) => {
  const { animals, addAnimal, updateAnimal } = useFarm();
  
  const [name, setName] = useState(animal?.name || '');
  const [code, setCode] = useState(animal?.code || '');
  const [breed, setBreed] = useState(animal?.breed || '');
  const [gender, setGender] = useState<'Macho' | 'Hembra'>(animal?.gender || 'Hembra');
  const [birthDate, setBirthDate] = useState(animal?.birthDate || '');
  const [status, setStatus] = useState<'Activo' | 'Vendido'>(animal?.status || 'Activo');
  const [motherId, setMotherId] = useState(animal?.motherId || '');
  const [fatherId, setFatherId] = useState(animal?.fatherId || '');
  const [observations, setObservations] = useState(animal?.observations || '');
  const [imageUrl, setImageUrl] = useState(animal?.imageUrl || '');
  
  const femaleAnimals = animals.filter(a => a.gender === 'Hembra');
  const maleAnimals = animals.filter(a => a.gender === 'Macho');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const animalData = {
      name,
      code,
      breed,
      gender,
      birthDate,
      status,
      motherId: motherId || undefined,
      fatherId: fatherId || undefined,
      observations,
      imageUrl,
    };
    
    if (animal) {
      updateAnimal({ ...animalData, id: animal.id });
    } else {
      addAnimal(animalData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input 
            id="code" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="breed">Raza</Label>
          <Input 
            id="breed" 
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Sexo</Label>
          <Select 
            value={gender} 
            onValueChange={(value: 'Macho' | 'Hembra') => setGender(value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Seleccionar sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input 
            id="birthDate" 
            type="date" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select 
            value={status} 
            onValueChange={(value: 'Activo' | 'Vendido') => setStatus(value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Vendido">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mother">Madre</Label>
          <Select 
            value={motherId} 
            onValueChange={setMotherId}
          >
            <SelectTrigger id="mother">
              <SelectValue placeholder="Seleccionar madre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No especificada</SelectItem>
              {femaleAnimals.map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="father">Padre</Label>
          <Select 
            value={fatherId} 
            onValueChange={setFatherId}
          >
            <SelectTrigger id="father">
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
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de imagen</Label>
          <Input 
            id="imageUrl" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observations">Observaciones</Label>
        <Textarea 
          id="observations" 
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {animal ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default AnimalForm;
