export interface Trip {
  user?: string;
  destination: string;
  days: number;
  preferences: string[];
}

export interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
}
