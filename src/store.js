import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { db } from "./firebase";
export default new Vuex.Store({
  state: {
    incc: 0,
    userEmail: null,
    displayName: ""
  },
  mutations: {
    SET_USER_EMAIL(state, email) {
      state.userEmail = email;
    },
    SET_USER_DISPLAY_NAME(state, name) {
      state.displayName = name;
    },
    SET_INCC(state, val) {
      state.incc = val;
    }
  },
  actions: {
    getINCC({ commit }) {
      db
        .ref("incc")
        .once("value")
        .then(function(snapshot) {
          commit("SET_INCC", snapshot.val());
        })
        .catch(error => console.log(error));
    }
  }
});
