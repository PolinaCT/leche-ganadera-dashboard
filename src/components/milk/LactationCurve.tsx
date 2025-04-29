
import { useFarm } from '@/context/FarmContext';
import { Birth } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface LactationCurveProps {
  animalId: string;
  birthId: string;
}

const LactationCurve = ({ animalId, birthId }: LactationCurveProps) => {
  const { milkProduction, births, getAnimalById, getAnimalName } = useFarm();

  // Get the selected birth
  const birth = births.find((b) => b.id === birthId);
  if (!birth) return <p>Seleccione un parto para ver la curva de lactancia.</p>;

  // Calculate the lactation period (305 days from birth date)
  const birthDate = new Date(birth.date);
  const lactationEndDate = new Date(birthDate);
  lactationEndDate.setDate(birthDate.getDate() + 305);

  // Filter milk production records for this animal and within the lactation period
  const lactationRecords = milkProduction
    .filter(
      (record) =>
        record.animalId === animalId &&
        record.birthId === birthId &&
        new Date(record.date) >= birthDate &&
        new Date(record.date) <= lactationEndDate
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate days since birth for each record
  const recordsWithDaysSinceBirth = lactationRecords.map((record) => {
    const recordDate = new Date(record.date);
    const daysSinceBirth = Math.floor(
      (recordDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      ...record,
      daysSinceBirth,
    };
  });

  // Calculate total liters produced in this lactation
  const totalLiters = lactationRecords.reduce((sum, record) => sum + record.liters, 0);
  
  // Calculate projected total (if lactation is incomplete)
  let projectedTotal = totalLiters;
  if (recordsWithDaysSinceBirth.length > 0 && recordsWithDaysSinceBirth[recordsWithDaysSinceBirth.length - 1].daysSinceBirth < 305) {
    // Simple projection based on current average
    const averageDailyProduction = totalLiters / recordsWithDaysSinceBirth.length;
    const remainingDays = 305 - recordsWithDaysSinceBirth[recordsWithDaysSinceBirth.length - 1].daysSinceBirth;
    projectedTotal = totalLiters + (averageDailyProduction * remainingDays);
  }

  // Peak production
  const peakProduction = Math.max(...recordsWithDaysSinceBirth.map(record => record.liters));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="data-card">
          <h4 className="text-sm font-medium text-muted-foreground">Parto #</h4>
          <p className="text-2xl font-semibold mt-1">{birth.birthNumber}</p>
        </div>
        <div className="data-card">
          <h4 className="text-sm font-medium text-muted-foreground">Producción Total</h4>
          <p className="text-2xl font-semibold mt-1">{totalLiters.toFixed(1)} L</p>
          {totalLiters !== projectedTotal && (
            <p className="text-xs text-muted-foreground mt-1">
              Proyección: {projectedTotal.toFixed(1)} L
            </p>
          )}
        </div>
        <div className="data-card">
          <h4 className="text-sm font-medium text-muted-foreground">Pico de Producción</h4>
          <p className="text-2xl font-semibold mt-1">{peakProduction.toFixed(1)} L</p>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-card h-[400px]">
        <h3 className="card-header">Curva de Lactancia</h3>
        {recordsWithDaysSinceBirth.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={recordsWithDaysSinceBirth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="daysSinceBirth"
                label={{ value: 'Días de Lactancia', position: 'bottom', offset: -5 }}
              />
              <YAxis
                label={{ value: 'Litros de Leche', angle: -90, position: 'left' }}
                domain={[0, 'dataMax + 2']}
              />
              <Tooltip
                formatter={(value) => [`${value} litros`, 'Producción']}
                labelFormatter={(label) => `Día ${label}`}
              />
              <Line
                type="monotone"
                dataKey="liters"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <ReferenceLine
                y={peakProduction}
                label="Pico"
                stroke="#ff7300"
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              No hay datos de producción para este periodo de lactancia
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LactationCurve;
