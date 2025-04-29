
export interface Animal {
  id: string;
  name: string;
  code: string;
  breed: string;
  gender: 'Macho' | 'Hembra';
  birthDate: string;
  status: 'Activo' | 'Vendido';
  motherId?: string;
  fatherId?: string;
  observations?: string;
  imageUrl?: string;
}

export interface Birth {
  id: string;
  animalId: string; // mother
  birthNumber: number;
  date: string;
  motherWeight: number;
  calfWeight: number;
  calfGender: 'Macho' | 'Hembra';
  calfId?: string; // Link to the calf in the animals collection
  fatherId?: string; // father of the calf
}

export interface MilkProduction {
  id: string;
  animalId: string;
  date: string;
  liters: number;
  birthId?: string; // To associate with which lactation period
}

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'annual';
