import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GameStateInterface } from './state';

const actions: ActionTree<GameStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default actions;
