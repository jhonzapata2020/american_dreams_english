import { Submission, PlacementLead } from '../types';
import { INITIAL_SUBMISSIONS } from '../data/mockData';

const SUBMISSIONS_KEY = 'american_dreams_submissions_v1';
const LEADS_KEY = 'american_dreams_leads_v1';

export function getStoredSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading submissions from localStorage:', error);
    return INITIAL_SUBMISSIONS;
  }
}

export function saveStoredSubmissions(submissions: Submission[]): void {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('Error saving submissions to localStorage:', error);
  }
}

export function getStoredLeads(): PlacementLead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error reading leads from localStorage:', error);
    return [];
  }
}

export function saveStoredLead(lead: PlacementLead): void {
  try {
    const existing = getStoredLeads();
    const updated = [lead, ...existing];
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving lead to localStorage:', error);
  }
}
