
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { Animal } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimalCard from '@/components/animals/AnimalCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AnimalForm from '@/components/animals/AnimalForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

const Inventory = () => {
  const { animals } = useFarm();
  const navigate = useNavigate();
  
  const [searchText, setSearchText] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [breedFilter, setBreedFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Get unique breeds for filter
  const uniqueBreeds = [...new Set(animals.map(animal => animal.breed))];
  
  // Filter animals based on search and filters
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchText.toLowerCase()) ||
                        animal.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesGender = genderFilter === 'all' || animal.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;
    const matchesBreed = breedFilter === 'all' || animal.breed === breedFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'cows' && animal.gender === 'Hembra') ||
                      (activeTab === 'bulls' && animal.gender === 'Macho');
    
    return matchesSearch && matchesGender && matchesStatus && matchesBreed && matchesTab;
  });
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Inventario de Animales</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Animal
          </Button>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="cows">Vacas</TabsTrigger>
            <TabsTrigger value="bulls">Toros</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sexos</SelectItem>
                <SelectItem value="Hembra">Hembra</SelectItem>
                <SelectItem value="Macho">Macho</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={breedFilter} onValueChange={setBreedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por raza" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las razas</SelectItem>
                {uniqueBreeds.map(breed => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnimals.map(animal => (
              <AnimalCard 
                key={animal.id} 
                animal={animal} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No se encontraron animales con los filtros aplicados</p>
          </div>
        )}
      </div>
      
      {/* Add Animal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo animal</DialogTitle>
          </DialogHeader>
          <AnimalForm 
            onSubmit={() => setShowAddDialog(false)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
