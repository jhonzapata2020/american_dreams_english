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
  name: string;
  photoUrl: string;
  vulnerabilityCondition: 'Víctima Conflicto Armado' | 'Estrato 1-2' | 'SISBÉN A1-B4' | 'Comunidad Rural Turbo';
  currentCycle: 'A1 Principiante' | 'A2 Elemental' | 'B1 Pre-Intermedio' | 'B2 Intermedio Alto' | 'C1 Avanzado';
  accumulatedHours: number;
  targetHours: number;
  location: string;
  testimonialSnippet: string;
  status: 'Activo' | 'En Certificación' | 'Graduado';
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
