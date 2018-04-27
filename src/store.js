import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { db } from "./firebase";
export default new Vuex.Store({
  state: {
    incc: 0,
    user: null,
    displayName: "Visitante"
  },
  getters: {
    scene: state => {
      let sceneString = "";
      if (state.kit === "padrao") {
        sceneString = state.ambiente + "-" + state.kit;
      } else {
        sceneString =
          state.ambiente +
          "-" +
          state.kit +
          "-" +
          Number(state.op1) +
          "_" +
          Number(state.op2);
        if (state.ambiente === "sala") {
          sceneString += "_" + Number(state.op3);
        }
      }
      return sceneString;
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_DISPLAY_NAME(state, name) {
      state.displayName = name;
    },

    SET_INCC(state, val) {
      state.incc = val;
    },
    SET_LOGIN_STATE(state, val) {
      state.loggedIn = val;
    },
    SET_TIPOLOGIA(state, val) {
      state.tipologia = val;
    },
    SET_VISITANTE(state, val) {
      state.visitante = val;
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
