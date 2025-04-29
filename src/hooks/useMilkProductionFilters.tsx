
import { useState, useMemo } from 'react';
import { MilkProduction } from '@/types';

interface UseMilkProductionFiltersProps {
  milkProduction: MilkProduction[];
  getAnimalName: (animalId: string) => string;
}

interface ChartDataItem {
  date: string;
  liters: number;
}

interface AnimalChartDataItem {
  animal: string;
  animalId: string;
  liters: number;
}

export const useMilkProductionFilters = ({ milkProduction, getAnimalName }: UseMilkProductionFiltersProps) => {
  const [searchText, setSearchText] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('none');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '365d'>('30d');

  // Calculate date range based on selected time range
  const { startDate, today } = useMemo(() => {
    const today = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case '30d':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      case '365d':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);
        break;
    }
    
    return { startDate, today };
  }, [timeRange]);

  // Filter records based on search, animal filter and time range
  const filteredRecords = useMemo(() => {
    return milkProduction.filter(record => {
      const animalName = getAnimalName(record.animalId).toLowerCase();
      const matchesSearch = animalName.includes(searchText.toLowerCase());
      const matchesAnimal = selectedAnimalId === 'none' || record.animalId === selectedAnimalId;
      const recordDate = new Date(record.date);
      const matchesTimeRange = recordDate >= startDate && recordDate <= today;
      
      return matchesSearch && matchesAnimal && matchesTimeRange;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [milkProduction, searchText, selectedAnimalId, startDate, today, getAnimalName]);

  // Aggregate data by date for trend chart
  const chartData = useMemo<ChartDataItem[]>(() => {
    // Aggregate data by date
    const aggregatedData = filteredRecords.reduce<Record<string, number>>((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += record.liters;
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.entries(aggregatedData).map(([date, liters]) => ({
      date,
      liters,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredRecords]);

  // Aggregate data by animal
  const animalChartData = useMemo<AnimalChartDataItem[]>(() => {
    const animalProduction = filteredRecords.reduce<Record<string, number>>((acc, record) => {
      const animalId = record.animalId;
      if (!acc[animalId]) {
        acc[animalId] = 0;
      }
      acc[animalId] += record.liters;
      return acc;
    }, {});
    
    // Convert to array and sort by production
    return Object.entries(animalProduction).map(([animalId, liters]) => ({
      animal: getAnimalName(animalId),
      animalId,
      liters,
    })).sort((a, b) => b.liters - a.liters);
  }, [filteredRecords, getAnimalName]);

  // Format date utilities
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES');
  };
  
  const formatDateForChart = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return {
    searchText,
    setSearchText,
    selectedAnimalId,
    setSelectedAnimalId,
    timeRange,
    setTimeRange,
    filteredRecords,
    chartData,
    animalChartData,
    formatDate,
    formatDateForChart
  };
};

export default useMilkProductionFilters;
