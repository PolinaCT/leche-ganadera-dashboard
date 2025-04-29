
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useFarm } from '@/context/FarmContext';
import { Birth } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import BirthForm from '@/components/births/BirthForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Trash2, Edit } from 'lucide-react';

const Births = () => {
  const { births, animals, getAnimalName, deleteBirth } = useFarm();
  
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBirth, setSelectedBirth] = useState<Birth | null>(null);
  
  // Filter births based on search
  const filteredBirths = births.filter(birth => {
    const motherName = getAnimalName(birth.animalId).toLowerCase();
    const calfName = getAnimalName(birth.calfId).toLowerCase();
    
    return motherName.includes(searchText.toLowerCase()) || 
           calfName.includes(searchText.toLowerCase());
  });
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };
  
  // Handle edit
  const handleEdit = (birth: Birth) => {
    setSelectedBirth(birth);
    setShowEditDialog(true);
  };
  
  // Handle delete
  const handleDelete = (birth: Birth) => {
    setSelectedBirth(birth);
    setShowDeleteDialog(true);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Registro de Partos</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Parto
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre de madre o cría..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {filteredBirths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBirths
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(birth => {
                const mother = animals.find(a => a.id === birth.animalId);
                
                return (
                  <Card key={birth.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Parto #{birth.birthNumber}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(birth.date)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(birth)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(birth)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Madre:</span>
                          <Link 
                            to={`/inventario/${birth.animalId}`} 
                            className="font-medium text-farm-blue hover:underline"
                          >
                            {getAnimalName(birth.animalId)}
                          </Link>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cría:</span>
                          {birth.calfId ? (
                            <Link 
                              to={`/inventario/${birth.calfId}`} 
                              className="font-medium text-farm-blue hover:underline"
                            >
                              {getAnimalName(birth.calfId)}
                            </Link>
                          ) : (
                            <span className="font-medium">
                              {birth.calfGender === 'Macho' ? '♂' : '♀'} (No registrado)
                            </span>
                          )}
                        </div>
                        
                        {birth.fatherId && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Padre:</span>
                            <Link 
                              to={`/inventario/${birth.fatherId}`} 
                              className="font-medium text-farm-blue hover:underline"
                            >
                              {getAnimalName(birth.fatherId)}
                            </Link>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peso de la cría:</span>
                          <span className="font-medium">{birth.calfWeight} kg</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peso de la madre:</span>
                          <span className="font-medium">{birth.motherWeight} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
            })}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No se encontraron registros de partos</p>
          </div>
        )}
      </div>
      
      {/* Add Birth Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar nuevo parto</DialogTitle>
          </DialogHeader>
          <BirthForm 
            onSubmit={() => setShowAddDialog(false)}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Birth Dialog */}
      {selectedBirth && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar registro de parto</DialogTitle>
            </DialogHeader>
            <BirthForm 
              birth={selectedBirth}
              onSubmit={() => setShowEditDialog(false)}
              onCancel={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Si el parto está vinculado a registros de producción, no podrá ser eliminado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (selectedBirth) {
                  deleteBirth(selectedBirth.id);
                }
                setShowDeleteDialog(false);
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

export default Births;
