
import { useFarm } from '@/context/FarmContext';
import { Birth } from '@/types';
import { Link } from 'react-router-dom';

const RecentBirths = () => {
  const { births, getAnimalName } = useFarm();
  
  // Get recent births (last 5)
  const recentBirths = [...births]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };
  
  return (
    <div className="dashboard-card">
      <h3 className="card-header">Partos Recientes</h3>
      {recentBirths.length > 0 ? (
        <div className="space-y-3">
          {recentBirths.map((birth) => (
            <div key={birth.id} className="flex justify-between items-center border-b pb-2 last:border-0">
              <div>
                <Link to={`/partos/${birth.id}`} className="font-medium hover:text-farm-blue">
                  {getAnimalName(birth.animalId)}
                </Link>
                <p className="text-xs text-muted-foreground">
                  Cría: {birth.calfGender === 'Macho' ? '♂' : '♀'} ({birth.calfWeight} kg)
                </p>
              </div>
              <div className="text-sm">{formatDate(birth.date)}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No hay partos recientes.</p>
      )}
      <div className="mt-3">
        <Link to="/partos" className="text-sm text-farm-blue hover:underline">
          Ver todos
        </Link>
      </div>
    </div>
  );
};

export default RecentBirths;
