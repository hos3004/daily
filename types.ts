
export interface HabitDefinition {
  key: string;
  label: string;
  points: number;
}

export interface HabitStatus {
  key: string;
  done: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  habits: HabitStatus[];
  notes?: string;
  meals?: { type: 'breakfast' | 'lunch' | 'snack', title: string }[];
  supplements_status?: Record<string, boolean>;
  movementDetails?: {
    type: 'walk' | 'exercise' | null;
    duration?: number; // in minutes
    steps?: number;
  };
  waterCups?: number;
}

export interface PointsState {
  current_points: number;
  lifetime_points: number;
  streak_days: number;
}

export interface Reward {
  id: number;
  title: string;
  cost: number;
}

export interface Measurement {
  date: string; // ISO 8601 format
  weight: number;
  waist?: number;
  fat_percentage?: number;
  visceral_fat?: number;
  body_water?: number;
  protein_percentage?: number;
  bmr?: number; // Basal Metabolic Rate
  muscle_mass?: number;
}

export interface ResetProtocol {
  is_active: boolean;
  start_date: string | null;
  day: number;
}

export interface Meal {
  id: number;
  type: 'breakfast' | 'lunch' | 'snack';
  title: string;
  image_url: string;
  ingredients: string[];
  notes: string;
  tags: string[];
}

export enum Page {
  Dashboard = 'DASHBOARD',
  Habits = 'HABITS',
  Measurements = 'MEASUREMENTS',
  Rewards = 'REWARDS',
  Progress = 'PROGRESS',
  Info = 'INFO',
  Reset = 'RESET',
  Meals = 'MEALS'
}