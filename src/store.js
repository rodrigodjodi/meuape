import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    TOOGLE_LOG(state) {
      state.loggedIn = !state.loggedIn;
    }
  },
  actions: {}
});
