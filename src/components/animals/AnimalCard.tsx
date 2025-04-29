
import { Animal } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard = ({ animal }: AnimalCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48">
        <img 
          src={animal.imageUrl || '/placeholder.svg'} 
          alt={animal.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
          {animal.status === 'Activo' ? (
            <span className="text-farm-green">Activo</span>
          ) : (
            <span className="text-gray-500">Vendido</span>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{animal.name}</h3>
            <p className="text-xs text-muted-foreground">{animal.code}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${animal.gender === 'Macho' ? 'bg-farm-blue-light/20 text-farm-blue' : 'bg-farm-green-light/20 text-farm-green'}`}>
            {animal.gender}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-sm">Raza: {animal.breed}</p>
          <p className="text-sm">Edad: {calculateAge(animal.birthDate)}</p>
        </div>
        <div className="mt-3">
          <Link 
            to={`/inventario/${animal.id}`}
            className="text-sm text-farm-blue hover:underline"
          >
            Ver detalles
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate age
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

export default AnimalCard;
