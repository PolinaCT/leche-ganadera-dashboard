
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { Birth, MilkProduction } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AnimalForm from '@/components/animals/AnimalForm';
import BirthForm from '@/components/births/BirthForm';
import MilkProductionForm from '@/components/milk/MilkProductionForm';
import LactationCurve from '@/components/milk/LactationCurve';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-react';

const AnimalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { 
    getAnimalById, 
    getAnimalName,
    updateAnimal, 
    deleteAnimal,
    births,
    getBirthsByAnimalId,
    getDailyProductionByAnimalId
  } = useFarm();
  
  const animal = getAnimalById(id!);
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddBirthDialog, setShowAddBirthDialog] = useState(false);
  const [showAddProductionDialog, setShowAddProductionDialog] = useState(false);
  const [selectedBirthId, setSelectedBirthId] = useState<string | null>(null);
  
  // Get births for this animal
  const animalBirths = animal ? getBirthsByAnimalId(animal.id) : [];
  
  // Get milk production for this animal
  const milkProduction = animal ? getDailyProductionByAnimalId(animal.id) : [];
  
  // Sort milk production by date
  const sortedProduction = [...milkProduction].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate age
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    return `${years} años`;
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };
  
  if (!animal) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Animal no encontrado</h2>
          <Button onClick={() => navigate('/inventario')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inventario
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/inventario')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{animal.name}</h1>
          <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-sm">
            {animal.code}
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="mb-4">
                <img 
                  src={animal.imageUrl || '/placeholder.svg'} 
                  alt={animal.name}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Raza:</span>
                  <span className="font-medium">{animal.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sexo:</span>
                  <span className="font-medium">{animal.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de nacimiento:</span>
                  <span className="font-medium">{formatDate(animal.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Edad:</span>
                  <span className="font-medium">{calculateAge(animal.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className={`font-medium ${animal.status === 'Activo' ? 'text-farm-green' : 'text-gray-500'}`}>
                    {animal.status}
                  </span>
                </div>
                {animal.motherId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Madre:</span>
                    <Link to={`/inventario/${animal.motherId}`} className="font-medium text-farm-blue hover:underline">
                      {getAnimalName(animal.motherId)}
                    </Link>
                  </div>
                )}
                {animal.fatherId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Padre:</span>
                    <Link to={`/inventario/${animal.fatherId}`} className="font-medium text-farm-blue hover:underline">
                      {getAnimalName(animal.fatherId)}
                    </Link>
                  </div>
                )}
                
                {animal.observations && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-1">Observaciones</h3>
                    <p className="text-sm">{animal.observations}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="production">
              <TabsList>
                <TabsTrigger value="production">Producción</TabsTrigger>
                {animal.gender === 'Hembra' && (
                  <TabsTrigger value="births">Partos</TabsTrigger>
                )}
                {animal.gender === 'Hembra' && animalBirths.length > 0 && (
                  <TabsTrigger value="lactation">Curva de Lactancia</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="production" className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Historial de Producción</h2>
                  {animal.status === 'Activo' && animal.gender === 'Hembra' && (
                    <Button onClick={() => setShowAddProductionDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar Producción
                    </Button>
                  )}
                </div>
                
                {sortedProduction.length > 0 ? (
                  <div>
                    <div className="h-[300px] mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sortedProduction}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(dateStr) => {
                              const date = new Date(dateStr);
                              return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [`${value} litros`, 'Producción']}
                            labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="liters" 
                            stroke="#2196F3" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted border-b">
                            <th className="text-left py-2 px-4">Fecha</th>
                            <th className="text-left py-2 px-4">Litros</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...sortedProduction]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 10)
                            .map((record) => (
                            <tr key={record.id} className="border-b last:border-0">
                              <td className="py-2 px-4">{formatDate(record.date)}</td>
                              <td className="py-2 px-4">{record.liters.toFixed(1)} L</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay registros de producción para este animal</p>
                  </div>
                )}
              </TabsContent>
              
              {animal.gender === 'Hembra' && (
                <TabsContent value="births" className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Historial de Partos</h2>
                    {animal.status === 'Activo' && (
                      <Button onClick={() => setShowAddBirthDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Parto
                      </Button>
                    )}
                  </div>
                  
                  {animalBirths.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted border-b">
                            <th className="text-left py-2 px-4"># Parto</th>
                            <th className="text-left py-2 px-4">Fecha</th>
                            <th className="text-left py-2 px-4">Cría</th>
                            <th className="text-left py-2 px-4">Peso Cría</th>
                            <th className="text-left py-2 px-4">Peso Madre</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...animalBirths]
                            .sort((a, b) => b.birthNumber - a.birthNumber)
                            .map((birth) => (
                            <tr key={birth.id} className="border-b last:border-0">
                              <td className="py-2 px-4">{birth.birthNumber}</td>
                              <td className="py-2 px-4">{formatDate(birth.date)}</td>
                              <td className="py-2 px-4">
                                {birth.calfId ? (
                                  <Link to={`/inventario/${birth.calfId}`} className="text-farm-blue hover:underline">
                                    {getAnimalName(birth.calfId)}
                                  </Link>
                                ) : (
                                  <span>{birth.calfGender === 'Macho' ? '♂' : '♀'}</span>
                                )}
                              </td>
                              <td className="py-2 px-4">{birth.calfWeight} kg</td>
                              <td className="py-2 px-4">{birth.motherWeight} kg</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No hay registros de partos para este animal</p>
                    </div>
                  )}
                </TabsContent>
              )}
              
              {animal.gender === 'Hembra' && animalBirths.length > 0 && (
                <TabsContent value="lactation" className="pt-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Curva de Lactancia</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {animalBirths.map((birth) => (
                        <Button
                          key={birth.id}
                          variant={selectedBirthId === birth.id ? "default" : "outline"}
                          onClick={() => setSelectedBirthId(birth.id)}
                        >
                          Parto #{birth.birthNumber}
                        </Button>
                      ))}
                    </div>
                    
                    {selectedBirthId ? (
                      <LactationCurve animalId={animal.id} birthId={selectedBirthId} />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Seleccione un parto para ver la curva de lactancia</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Edit Animal Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar animal</DialogTitle>
          </DialogHeader>
          <AnimalForm 
            animal={animal}
            onSubmit={() => setShowEditDialog(false)}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Birth Dialog */}
      <Dialog open={showAddBirthDialog} onOpenChange={setShowAddBirthDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar nuevo parto</DialogTitle>
          </DialogHeader>
          <BirthForm 
            animalId={animal.id}
            onSubmit={() => setShowAddBirthDialog(false)}
            onCancel={() => setShowAddBirthDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Production Dialog */}
      <Dialog open={showAddProductionDialog} onOpenChange={setShowAddProductionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar producción de leche</DialogTitle>
          </DialogHeader>
          <MilkProductionForm 
            animalId={animal.id}
            onSubmit={() => setShowAddProductionDialog(false)}
            onCancel={() => setShowAddProductionDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este animal?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Si el animal está vinculado a otros registros, no podrá ser eliminado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteAnimal(animal.id);
                navigate('/inventario');
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AnimalDetail;
