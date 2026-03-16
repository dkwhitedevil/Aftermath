import { create } from 'zustand';
import { subHours, formatISO } from 'date-fns';

export type ResourceType = 'Food Kits' | 'Water (L)' | 'Medicines' | 'Shelter Capacity (%)' | 'Fuel (L)' | 'Blankets';
export type Camp = 'Camp A' | 'Camp B' | 'Camp C';
export type Severity = 'stable' | 'warning' | 'critical' | 'recovering';
export type Role = 'coordinator' | 'volunteer' | null;

export interface ResourceUpdate {
  id: string;
  timestamp: string;
  resource: ResourceType;
  camp: Camp;
  oldValue: number;
  newValue: number;
  updatedBy: string;
  note?: string;
  severity: Severity;
}

export interface Alert {
  id: string;
  timestamp: string;
  message: string;
  severity: Severity;
  resource: ResourceType;
  camp: Camp;
}

export interface Volunteer {
  id: string;
  name: string;
  updatesCount: number;
  lastUpdate: string;
  trustScore: 'high' | 'medium' | 'low';
  assignedLocation: Camp;
}

interface AppState {
  // Auth State
  role: Role;
  userName: string | null;
  userCamp: string | null;
  login: (role: Role, name: string, camp?: string) => void;
  logout: () => void;

  updates: ResourceUpdate[];
  alerts: Alert[];
  volunteers: Volunteer[];
  addUpdate: (update: Omit<ResourceUpdate, 'id' | 'timestamp' | 'severity' | 'oldValue'>) => void;
  getCurrentResourceValue: (camp: Camp, resource: ResourceType) => number;
  getPreviousResourceValue: (camp: Camp, resource: ResourceType) => number;
  getResourceHistory: (camp: Camp, resource: ResourceType) => { time: string; value: number }[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const BASE_DATE = new Date('2026-03-16T12:00:00Z');

const initialUpdates: ResourceUpdate[] = [
  { id: '1', timestamp: formatISO(subHours(BASE_DATE, 5)), resource: 'Food Kits', camp: 'Camp A', oldValue: 25, newValue: 20, updatedBy: 'Volunteer A', severity: 'stable' },
  { id: '2', timestamp: formatISO(subHours(BASE_DATE, 3)), resource: 'Food Kits', camp: 'Camp A', oldValue: 20, newValue: 14, updatedBy: 'Volunteer A', severity: 'warning' },
  { id: '3', timestamp: formatISO(subHours(BASE_DATE, 1)), resource: 'Food Kits', camp: 'Camp A', oldValue: 14, newValue: 8, updatedBy: 'Volunteer A', severity: 'critical', note: 'High demand due to new arrivals' },
  
  { id: '4', timestamp: formatISO(subHours(BASE_DATE, 4)), resource: 'Water (L)', camp: 'Camp B', oldValue: 600, newValue: 500, updatedBy: 'Volunteer B', severity: 'stable' },
  { id: '5', timestamp: formatISO(subHours(BASE_DATE, 2)), resource: 'Water (L)', camp: 'Camp B', oldValue: 500, newValue: 320, updatedBy: 'Volunteer B', severity: 'warning' },
  
  { id: '6', timestamp: formatISO(subHours(BASE_DATE, 6)), resource: 'Medicines', camp: 'Camp C', oldValue: 150, newValue: 120, updatedBy: 'Volunteer C', severity: 'stable' },
  { id: '7', timestamp: formatISO(subHours(BASE_DATE, 2)), resource: 'Medicines', camp: 'Camp C', oldValue: 120, newValue: 90, updatedBy: 'Volunteer C', severity: 'stable' },
  
  { id: '8', timestamp: formatISO(subHours(BASE_DATE, 5)), resource: 'Shelter Capacity (%)', camp: 'Camp A', oldValue: 60, newValue: 70, updatedBy: 'Volunteer A', severity: 'warning' },
  { id: '9', timestamp: formatISO(subHours(BASE_DATE, 1)), resource: 'Shelter Capacity (%)', camp: 'Camp A', oldValue: 70, newValue: 92, updatedBy: 'Volunteer A', severity: 'critical' },
];

const initialAlerts: Alert[] = [
  { id: 'a1', timestamp: formatISO(subHours(BASE_DATE, 1)), message: 'Food depletion accelerating', severity: 'critical', resource: 'Food Kits', camp: 'Camp A' },
  { id: 'a2', timestamp: formatISO(subHours(BASE_DATE, 2)), message: 'Water likely exhausted in 3 hours', severity: 'warning', resource: 'Water (L)', camp: 'Camp B' },
  { id: 'a3', timestamp: formatISO(subHours(BASE_DATE, 1)), message: 'Shelter nearing overload', severity: 'critical', resource: 'Shelter Capacity (%)', camp: 'Camp A' },
];

const initialVolunteers: Volunteer[] = [
  { id: 'v1', name: 'Volunteer A', updatesCount: 5, lastUpdate: formatISO(subHours(BASE_DATE, 1)), trustScore: 'high', assignedLocation: 'Camp A' },
  { id: 'v2', name: 'Volunteer B', updatesCount: 3, lastUpdate: formatISO(subHours(BASE_DATE, 2)), trustScore: 'medium', assignedLocation: 'Camp B' },
  { id: 'v3', name: 'Volunteer C', updatesCount: 8, lastUpdate: formatISO(subHours(BASE_DATE, 2)), trustScore: 'high', assignedLocation: 'Camp C' },
];

export const calculateSeverity = (resource: ResourceType, oldValue: number, newValue: number): Severity => {
  if (newValue > oldValue) {
    if (resource === 'Shelter Capacity (%)') {
      return newValue >= 90 ? 'critical' : newValue >= 75 ? 'warning' : 'stable';
    }
    return 'recovering';
  }
  
  const dropPercent = oldValue > 0 ? ((oldValue - newValue) / oldValue) * 100 : 0;
  
  if (resource === 'Shelter Capacity (%)') {
    return 'recovering'; // Capacity going down is good
  }

  if (dropPercent >= 30) return 'critical';
  if (dropPercent >= 15) return 'warning';
  return 'stable';
};

export const useStore = create<AppState>((set, get) => ({
  role: null,
  userName: null,
  userCamp: null,
  login: (role, name, camp) => set({ role, userName: name, userCamp: camp || null }),
  logout: () => set({ role: null, userName: null, userCamp: null }),

  updates: initialUpdates,
  alerts: initialAlerts,
  volunteers: initialVolunteers,
  
  getCurrentResourceValue: (camp, resource) => {
    const updates = get().updates.filter(u => u.camp === camp && u.resource === resource);
    if (updates.length === 0) return 0;
    return updates[updates.length - 1].newValue;
  },
  
  getPreviousResourceValue: (camp, resource) => {
    const updates = get().updates.filter(u => u.camp === camp && u.resource === resource);
    if (updates.length < 2) return updates.length === 1 ? updates[0].oldValue : 0;
    return updates[updates.length - 2].newValue;
  },
  
  getResourceHistory: (camp, resource) => {
    const updates = get().updates.filter(u => u.camp === camp && u.resource === resource);
    return updates.map(u => ({ time: u.timestamp, value: u.newValue }));
  },
  
  addUpdate: (newUpdate) => {
    set((state) => {
      const oldValue = state.getCurrentResourceValue(newUpdate.camp, newUpdate.resource);
      const severity = calculateSeverity(newUpdate.resource, oldValue, newUpdate.newValue);
      
      const update: ResourceUpdate = {
        ...newUpdate,
        id: generateId(),
        timestamp: formatISO(new Date()),
        oldValue,
        severity,
      };
      
      const newAlerts = [...state.alerts];
      if (severity === 'critical') {
        newAlerts.unshift({
          id: generateId(),
          timestamp: update.timestamp,
          message: `Critical drop detected in ${update.resource}`,
          severity: 'critical',
          resource: update.resource,
          camp: update.camp,
        });
      } else if (severity === 'warning') {
        newAlerts.unshift({
          id: generateId(),
          timestamp: update.timestamp,
          message: `Warning: ${update.resource} declining rapidly`,
          severity: 'warning',
          resource: update.resource,
          camp: update.camp,
        });
      }

      // Update volunteer stats
      const newVolunteers = state.volunteers.map(v => {
        if (v.name === update.updatedBy) {
          return { ...v, updatesCount: v.updatesCount + 1, lastUpdate: update.timestamp };
        }
        return v;
      });
      // If volunteer doesn't exist, add them
      if (!newVolunteers.find(v => v.name === update.updatedBy)) {
        newVolunteers.push({
          id: generateId(),
          name: update.updatedBy,
          updatesCount: 1,
          lastUpdate: update.timestamp,
          trustScore: 'medium',
          assignedLocation: update.camp,
        });
      }

      return {
        updates: [...state.updates, update],
        alerts: newAlerts,
        volunteers: newVolunteers,
      };
    });
  },
}));
