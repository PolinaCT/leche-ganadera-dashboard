
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Animal } from '@/types';

interface ProductionFiltersProps {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedAnimalId: string;
  setSelectedAnimalId: (value: string) => void;
  timeRange: '7d' | '30d' | '90d' | '365d';
  setTimeRange: (value: '7d' | '30d' | '90d' | '365d') => void;
  animals: Animal[];
}

const ProductionFilters = ({
  searchText,
  setSearchText,
  selectedAnimalId,
  setSelectedAnimalId,
  timeRange,
  setTimeRange,
  animals
}: ProductionFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre de vaca..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-2">
        <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por vaca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Todas las vacas</SelectItem>
            {animals
              .filter(a => a.gender === 'Hembra')
              .map(animal => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '365d') => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Periodo de tiempo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
            <SelectItem value="365d">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductionFilters;
