
import { Card, CardContent } from '@/components/ui/card';
import { ChartBar } from 'lucide-react';

interface ProductionStatsProps {
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
}

const ProductionSummaryCards = ({ daily, weekly, monthly, annual }: ProductionStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Producción diaria</p>
              <p className="text-2xl font-bold mt-1">{daily} L</p>
            </div>
            <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Producción semanal</p>
              <p className="text-2xl font-bold mt-1">{weekly} L</p>
            </div>
            <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Producción mensual</p>
              <p className="text-2xl font-bold mt-1">{monthly} L</p>
            </div>
            <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Producción anual</p>
              <p className="text-2xl font-bold mt-1">{annual} L</p>
            </div>
            <ChartBar className="h-8 w-8 text-farm-blue opacity-70" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionSummaryCards;
