export interface GameStateInterface {
  prop: boolean;
}

function state(): GameStateInterface {
  return {
    prop: false
  }
};

export default state;
