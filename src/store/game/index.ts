import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { GameStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const gameModule: Module<GameStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default gameModule;