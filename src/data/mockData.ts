
import { Animal, Birth, MilkProduction } from '@/types';

export const mockAnimals: Animal[] = [
  {
    id: '1',
    name: 'Lucero',
    code: 'VC001',
    breed: 'Holstein',
    gender: 'Hembra',
    birthDate: '2020-04-15',
    status: 'Activo',
    observations: 'Excelente productora',
    imageUrl: 'https://images.unsplash.com/photo-1565073624797-5e084efa1c7d?q=80&w=200'
  },
  {
    id: '2',
    name: 'Estrella',
    code: 'VC002',
    breed: 'Jersey',
    gender: 'Hembra',
    birthDate: '2019-08-22',
    status: 'Activo',
    motherId: '5',
    fatherId: '7',
    observations: 'Alta producción de grasa butírica',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=200'
  },
  {
    id: '3',
    name: 'Roble',
    code: 'TR001',
    breed: 'Holstein',
    gender: 'Macho',
    birthDate: '2018-03-10',
    status: 'Activo',
    observations: 'Semental principal',
    imageUrl: 'https://images.unsplash.com/photo-1584840004224-9804c7fcfdb5?q=80&w=200'
  },
  {
    id: '4',
    name: 'Luna',
    code: 'VC003',
    breed: 'Holstein',
    gender: 'Hembra',
    birthDate: '2021-01-05',
    status: 'Activo',
    motherId: '1',
    fatherId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29868c9bkah3?q=80&w=200'
  },
  {
    id: '5',
    name: 'Blanca',
    code: 'VC004',
    breed: 'Jersey',
    gender: 'Hembra',
    birthDate: '2017-11-30',
    status: 'Activo',
    imageUrl: 'https://images.unsplash.com/photo-1597732081142-329aef20b8b4?q=80&w=200'
  },
  {
    id: '6',
    name: 'Manchas',
    code: 'VC005',
    breed: 'Holstein',
    gender: 'Hembra',
    birthDate: '2020-09-12',
    status: 'Activo',
    motherId: '1',
    fatherId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=200'
  },
  {
    id: '7',
    name: 'Trueno',
    code: 'TR002',
    breed: 'Jersey',
    gender: 'Macho',
    birthDate: '2017-06-18',
    status: 'Vendido',
    observations: 'Vendido para reproductor',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=200'
  }
];

export const mockBirths: Birth[] = [
  {
    id: '1',
    animalId: '1',
    birthNumber: 1,
    date: '2022-05-20',
    motherWeight: 550,
    calfWeight: 38,
    calfGender: 'Hembra',
    calfId: '4',
    fatherId: '3'
  },
  {
    id: '2',
    animalId: '1',
    birthNumber: 2,
    date: '2023-06-15',
    motherWeight: 570,
    calfWeight: 35,
    calfGender: 'Hembra',
    calfId: '6',
    fatherId: '3'
  },
  {
    id: '3',
    animalId: '2',
    birthNumber: 1,
    date: '2022-02-10',
    motherWeight: 480,
    calfWeight: 32,
    calfGender: 'Macho',
    fatherId: '7'
  },
  {
    id: '4',
    animalId: '5',
    birthNumber: 3,
    date: '2021-04-25',
    motherWeight: 510,
    calfWeight: 34,
    calfGender: 'Hembra',
    calfId: '2',
    fatherId: '7'
  }
];

// Generate mock milk production data for the past 30 days
export const generateMockMilkProductionData = (): MilkProduction[] => {
  const data: MilkProduction[] = [];
  const cows = mockAnimals.filter(animal => animal.gender === 'Hembra' && animal.status === 'Activo');
  
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    cows.forEach((cow) => {
      // Base production values that follow a lactation curve pattern
      let baseProduction = 0;
      
      // Simulate different lactation stages for different cows
      if (cow.id === '1') {  // Peak lactation
        baseProduction = 28;
      } else if (cow.id === '2') {  // Early lactation, increasing
        baseProduction = 22 + (i % 7);
      } else if (cow.id === '4') {  // Late lactation, decreasing
        baseProduction = Math.max(12, 20 - (i % 8));
      } else if (cow.id === '5') {  // Mid lactation, stable
        baseProduction = 24;
      } else if (cow.id === '6') {  // Very early lactation
        baseProduction = 18 + (i % 5);
      }
      
      // Add some random variation
      const variation = (Math.random() * 4) - 2;  // +/- 2 liters
      const liters = Math.max(0, baseProduction + variation).toFixed(1);
      
      data.push({
        id: `${cow.id}-${dateStr}`,
        animalId: cow.id,
        date: dateStr,
        liters: parseFloat(liters),
        birthId: cow.id === '1' ? '2' : undefined  // Link to a birth for cow #1
      });
    });
  }
  
  return data;
};

export const mockMilkProduction = generateMockMilkProductionData();
