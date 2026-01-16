
export enum UserRole {
  GUEST = 'GUEST',
  OBSERVER = 'OBSERVER',
  RESEARCHER = 'RESEARCHER'
}

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  identityId: string | null;
  lastLogin: string | null;
}

export interface CipherSymbol {
  id: string;
  name: string;
  glyph: string;
  meaning: string;
  category: 'DIRECTION' | 'STATUS' | 'TIME' | 'RISK';
}

export interface TransformationState {
  symbolOverlay: boolean;
  colorShift: number; // 0 - 360
  gridDistortion: number; // 0 - 100
  noiseMask: number; // 0 - 100
  bitGlitch: number; // 0 - 100
}

export interface ResearchBrief {
  title: string;
  description: string;
  securityRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
