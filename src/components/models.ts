export interface Player {
  id: number;
  name: string;
  stats: Date[]

}

export interface Game {
  id: number;
  name: string;
  description: string;
  players: Player[];
}
