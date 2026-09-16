export type Currency = 'USD' | 'COP' | 'EUR';
export type DonationFrequency = 'monthly' | 'one_time';
export type PaymentProvider = 'stripe' | 'paypal' | 'redeban' | 'wompi';

export interface DonationTier {
  id: string;
  usdAmount: number;
  copAmount: number;
  title: string;
  subtitle: string;
  impactDescription: string;
  badge?: string;
  recommended?: boolean;
}

export interface DonationRequest {
  tierId?: string;
  amount: number;
  currency: Currency;
  frequency: DonationFrequency;
  provider: PaymentProvider;
  coversFee: boolean;
  donorName: string;
  donorEmail: string;
  organizationName?: string;
  studentId?: string;
}

export interface ScholarshipRecipient {
  id: string;
  anonymizedCode: string; // Ej. 'Becario #URB-101'
  programCategory: string; // Ej. 'Programa Talento & Bilingüismo Urabá'
  currentCycle: 'A1 Principiante' | 'A2 Elemental' | 'B1 Pre-Intermedio' | 'B2 Intermedio Alto' | 'C1 Avanzado';
  accumulatedHours: number;
  targetHours: number;
  location: string; // Ej. 'Distrito de Turbo, Antioquia'
  academicStatus: 'En curso' | 'En certificación' | 'Graduado';
  impactAchievementQuote: string; // Testimonio enfocado únicamente en la meta profesional/académica
}

export interface CohortMetrics {
  totalActiveScholars: number;
  totalFundedHours: number;
  completionRate: string;
  certifiedStudentsMCER: number;
}

export interface BusinessSegment {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  features: string[];
  ctaText: string;
  ctaAction: 'donate' | 'catalog' | 'live' | 'campus';
  gradientBg: string;
  iconName: string;
}
