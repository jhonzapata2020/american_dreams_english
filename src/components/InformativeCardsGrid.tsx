'use client';

import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  MapPin, 
  TrendingUp, 
  Laptop, 
  ShieldCheck, 
  Award, 
  Globe, 
  Briefcase 
} from 'lucide-react';

export interface InformativeCardItem {
  id: string;
  headline: string;
  tabColor: string;
  textColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

// 9 tarjetas organizadas en cuadrícula de 3x3 con los 9 colores exactos solicitados:
// 1. Amarillo  2. Naranja  3. Marrón
// 4. Verde     5. Turquesa 6. Azul
// 7. Gris azulado 8. Morado 9. Fucsia
export const INFORMATIVE_CARDS: InformativeCardItem[] = [
  {
    id: 'card-yellow',
    headline: 'PROPÓSITO SOCIAL',
    tabColor: 'bg-[#F59E0B]',
    textColor: 'text-[#D97706]',
    icon: Sparkles,
    description: 'Democratizar el acceso a la educación bilingüe de calidad internacional en el Urabá antioqueño, impulsando el talento de jóvenes con alto potencial académico.',
  },
  {
    id: 'card-orange',
    headline: 'METODOLOGÍA MCER',
    tabColor: 'bg-[#F97316]',
    textColor: 'text-[#EA580C]',
    icon: BookOpen,
    description: 'Plan pedagógico alineado con el Marco Común Europeo de Referencia (A1 a B2), enfocado en fluidez verbal, fonética y habilidades comunicativas reales.',
  },
  {
    id: 'card-brown',
    headline: 'IDENTIDAD URABÁ',
    tabColor: 'bg-[#8D6E63]',
    textColor: 'text-[#6D4C41]',
    icon: MapPin,
    description: 'Arraigo regional y compromiso con el desarrollo económico y portuario de Turbo y el eje bananero, fortaleciendo la inserción laboral juvenil bilingüe.',
  },
  {
    id: 'card-green',
    headline: 'IMPACTO TANGIBLE',
    tabColor: 'bg-[#10B981]',
    textColor: 'text-[#059669]',
    icon: TrendingUp,
    description: 'Seguimiento medible con más de 64 becarios activos, 3.840 horas de clase financiadas y un 92% de permanencia académica durante el ciclo formativo.',
  },
  {
    id: 'card-turquoise',
    headline: 'TECNOLOGÍA & IA',
    tabColor: 'bg-[#06B6D4]',
    textColor: 'text-[#0891B2]',
    icon: Laptop,
    description: 'Acompañamiento 24/7 con el tutor conversacional ADE IA, audiolibros descargables y laboratorios digitales de fonética interactiva desde cualquier dispositivo.',
  },
  {
    id: 'card-blue',
    headline: 'TRANSPARENCIA TOTAL',
    tabColor: 'bg-[#2563EB]',
    textColor: 'text-[#1D4ED8]',
    icon: ShieldCheck,
    description: 'Panel de auditoría en vivo con código único anonimizado por cada becario, cumpliendo rigurosamente la Ley 1581 de protección de datos personales.',
  },
  {
    id: 'card-slate',
    headline: 'CERTIFICACIÓN OFICIAL',
    tabColor: 'bg-[#64748B]',
    textColor: 'text-[#475569]',
    icon: Award,
    description: 'Validez institucional respaldada por la Secretaría de Educación Distrital bajo Resolución SED 2471, acreditando competencias lingüísticas formales.',
  },
  {
    id: 'card-purple',
    headline: 'COOPERACIÓN GLOBAL',
    tabColor: 'bg-[#8B5CF6]',
    textColor: 'text-[#7C3AED]',
    icon: Globe,
    description: 'Alianzas estratégicas con donantes particulares, empresas y entidades internacionales que apuestan por la transformación bilingüe en Urabá.',
  },
  {
    id: 'card-fuchsia',
    headline: 'INCLUSIÓN LABORAL',
    tabColor: 'bg-[#EC4899]',
    textColor: 'text-[#DB2777]',
    icon: Briefcase,
    description: 'Ruta de empleabilidad y vinculación en operaciones logísticas, comercio exterior y servicios internacionales para becarios graduados en nivel B2.',
  },
];

interface InformativeCardsGridProps {
  cards?: InformativeCardItem[];
  className?: string;
}

export const InformativeCardsGrid: React.FC<InformativeCardsGridProps> = ({
  cards = INFORMATIVE_CARDS,
  className = '',
}) => {
  return (
    <div className={`w-full bg-[#EBF0F5] rounded-[28px] p-6 sm:p-8 lg:p-10 border border-slate-200/70 shadow-sm ${className}`}>
      
      {/* CUADRÍCULA 3x3: 3 Columnas en Desktop, 2 en Tablet, 1 en Móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
        {cards.map((card) => {
          const IconComponent = card.icon;

          return (
            <div
              key={card.id}
              className="relative bg-white rounded-[14px] p-6 pt-7 border border-slate-100/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.01)] hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between select-none"
            >
              {/* Pestaña horizontal de color centrada en el borde superior con esquinas redondeadas y sombra ligera */}
              <div
                className={`absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full shadow-xs ${card.tabColor}`}
              />

              <div>
                {/* Cabecera: Título corto en mayúsculas a la izquierda + Icono minimalista a la derecha */}
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className={`text-xs font-bold tracking-widest uppercase line-clamp-1 ${card.textColor}`}>
                    {card.headline}
                  </span>
                  <IconComponent className="w-5 h-5 text-slate-400 stroke-[1.8] shrink-0" />
                </div>

                {/* Línea horizontal fina en gris claro */}
                <div className="h-px w-full bg-slate-100 my-3" />

                {/* Párrafo descriptivo de 3 a 4 líneas en tipografía sans-serif pequeña y cómoda */}
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default InformativeCardsGrid;
