'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AcademicPricingData } from '../lib/academicPricing';

const defaultPricing: AcademicPricingData = {
  presencial: {
    ninos: { matricula: 50000, mensualidad: 150000 },
    adultos: { matricula: 50000, mensualidad: 200000 },
    becaElegible: true
  },
  virtual: {
    ninos: { matricula: 50000, mensualidad: 250000 },
    adultos: { matricula: 50000, mensualidad: 300000 },
    becaElegible: false
  },
  becados: {
    ninos: { matricula: 25000, mensualidad: 75000 },
    adultos: { matricula: 25000, mensualidad: 100000 },
    porcentajeSubvencion: 50
  },
  subvencionesInfo: {
    aplicaPara: 'Sede Presencial Turbo - Urabá (Exclusivo)',
    titulo: 'Subvenciones y Becas Sociales Comunitarias',
    descripcion: 'El Fondo de Becas ADE está destinado con estricto sentido ético exclusivamente a niños, jóvenes y adultos de bajos recursos de la región de Urabá que asisten presencialmente a nuestras instalaciones físicas.',
    requisito: 'Residencia en Urabá, estrato 1-2 o SISBÉN A-B y modalidad presencial.'
  },
  updatedAt: new Date().toISOString()
};

interface PricingContextType {
  pricing: AcademicPricingData;
  isLoading: boolean;
  refreshPricing: () => Promise<void>;
  formatCop: (amount: number) => string;
}

const PricingContext = createContext<PricingContextType>({
  pricing: defaultPricing,
  isLoading: false,
  refreshPricing: async () => {},
  formatCop: (amount) => `$${Number(amount || 0).toLocaleString('es-CO')} COP`
});

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pricing, setPricing] = useState<AcademicPricingData>(defaultPricing);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/pricing', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success && data?.pricing) {
        setPricing(data.pricing);
      }
    } catch (e) {
      console.warn('[PricingProvider] Using initial pricing:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const formatCop = (amount: number) => {
    return `$${Number(amount || 0).toLocaleString('es-CO')} COP`;
  };

  return (
    <PricingContext.Provider value={{ pricing, isLoading, refreshPricing: fetchPricing, formatCop }}>
      {children}
    </PricingContext.Provider>
  );
};

export const useAcademicPricing = () => useContext(PricingContext);
