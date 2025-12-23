export interface Phrase {
  portuguese: string;
  spanish: string;
  context: string;
}

export interface SavedPhrase extends Phrase {
  id: string;
  timestamp: number;
}

export enum AppState {
  HOME = 'HOME',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  SAVED = 'SAVED',
}

export enum AudioState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
}
