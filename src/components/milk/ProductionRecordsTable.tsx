
import { MilkProduction } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface ProductionRecordsTableProps {
  records: MilkProduction[];
  formatDate: (dateStr: string) => string;
  getAnimalName: (animalId: string) => string;
  onEdit: (record: MilkProduction) => void;
  onDelete: (record: MilkProduction) => void;
}

const ProductionRecordsTable = ({
  records,
  formatDate,
  getAnimalName,
  onEdit,
  onDelete
}: ProductionRecordsTableProps) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay registros que coincidan con los filtros aplicados</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted border-b">
            <th className="text-left py-2 px-4">Fecha</th>
            <th className="text-left py-2 px-4">Vaca</th>
            <th className="text-left py-2 px-4">Litros</th>
            <th className="text-left py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b last:border-0">
              <td className="py-2 px-4">{formatDate(record.date)}</td>
              <td className="py-2 px-4">
                <Link 
                  to={`/inventario/${record.animalId}`} 
                  className="font-medium text-farm-blue hover:underline"
                >
                  {getAnimalName(record.animalId)}
                </Link>
              </td>
              <td className="py-2 px-4">{record.liters.toFixed(1)} L</td>
              <td className="py-2 px-4">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(record)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductionRecordsTable;
