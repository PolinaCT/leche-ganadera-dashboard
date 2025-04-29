
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChartDisplay from "./PieChartDisplay";
import StatsGrid from "./StatsGrid";

interface AnimalsTabProps {
  animals: Array<any>;
}

const AnimalsTab = ({ animals }: AnimalsTabProps) => {
  // Animals by breed
  const animalsByBreed = animals.reduce<Record<string, number>>((acc, animal) => {
    const breed = animal.breed;
    if (!acc[breed]) {
      acc[breed] = 0;
    }
    acc[breed]++;
    return acc;
  }, {});
  
  const breedChartData = Object.entries(animalsByBreed).map(([breed, count]) => ({
    breed,
    count,
  }));
  
  // Animals by gender
  const animalsByGender = animals.reduce<Record<string, number>>((acc, animal) => {
    const gender = animal.gender;
    if (!acc[gender]) {
      acc[gender] = 0;
    }
    acc[gender]++;
    return acc;
  }, {});
  
  const genderChartData = Object.entries(animalsByGender).map(([gender, count]) => ({
    gender,
    count,
  }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const animalStats = [
    { label: 'Total Animales', value: animals.length },
    { label: 'Animales Activos', value: animals.filter(a => a.status === 'Activo').length },
    { label: 'Vacas en Producción', value: animals.filter(a => a.gender === 'Hembra' && a.status === 'Activo').length },
    { label: 'Toros', value: animals.filter(a => a.gender === 'Macho').length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <Card className="md:col-span-6">
        <CardHeader>
          <CardTitle>Distribución por Raza</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChartDisplay 
            data={breedChartData}
            dataKey="count"
            nameKey="breed"
            colors={COLORS}
            formatter={(value) => [`${value} animales`, 'Cantidad']}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-6">
        <CardHeader>
          <CardTitle>Distribución por Sexo</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChartDisplay
            data={genderChartData}
            dataKey="count"
            nameKey="gender"
            colors={['#2196F3', '#4CAF50']}
            formatter={(value) => [`${value} animales`, 'Cantidad']}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-12">
        <CardHeader>
          <CardTitle>Resumen de Inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsGrid stats={animalStats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalsTab;
