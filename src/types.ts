export type GameMode = 'tonpu' | 'hanchan' | 'sanma';
export type InputMode = 'move' | 'overwrite';
export type UmaType = '10-30' | '5-10' | 'none' | 'custom';

export interface Setup {
  mode: GameMode;
  players: string[];
  startScore: number;
  returnScore: number;
  uma: UmaType;
  umaCustom: number[];
  oka: boolean;
  tobi: boolean;
  tobiAmount: number;
  yakitori: boolean;
  yakitoriAmount: number;
  inputMode: InputMode;
  n: number;
}

export interface Player {
  name: string;
  score: number;
  scored: boolean;
}

export interface Round {
  wind: number;
  kyoku: number;
  honba: number;
  riichiSticks: number;
}

export interface Snapshot {
  players: Player[];
  round: Round;
}

export interface HandResult {
  type: 'tsumo' | 'ron' | 'ryukyoku' | 'overwrite';
  winners: number[];
  dealIn: number | null;
  riichi: number[];
}

export interface Game {
  setup: Setup;
  players: Player[];
  round: Round;
  history: Snapshot[];
  handResults: HandResult[];
  finished: boolean;
}

export interface SettledPlayer extends Player {
  idx: number;
  rank: number;
  raw: number;
  oka: number;
  uma: number;
  tobi: number;
  yakitori: number;
  total: number;
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
}
