export interface Player {
  id: number;
  name: string;
  stats: string[]
}

export interface Game {
  id: number;
  name: string;
  description: string;
  players: Player[];
}

export interface GamesWin {
  [property: string]: number;
}

export interface ApexTimestampSerie {
  name: string;
  data: Array<Array<number>>;
}
