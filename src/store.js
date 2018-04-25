import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { db, auth } from "./firebase";
export default new Vuex.Store({
  state: {
    loggedIn: false,
    tipologia: "",
    ambiente: "sala",
    kit: "padrao",
    op1: true,
    op2: false,
    op3: false,
    op4: false,
    incc: 0,
    user: null,
    unidades: {},
    visitante: false
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
    TOGGLE_OPTION(state, op) {
      state[op] = !state[op];
    },
    TOGGLE_KIT(state, kit) {
      if (["padrao", "classico", "contemporaneo"].includes(kit)) {
        state.kit = kit;
      } else {
        console.error("kit não existe:" + kit);
      }
    },
    CHANGE_AMBIENTE(state, amb) {
      if (["sala", "bwc"].includes(amb)) {
        state.ambiente = amb;
      } else {
        console.error("ambiente não existe:" + amb);
      }
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
    },
    SET_UNIDADES(state, val) {
      state.unidades = val;
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
    },
    getUnidades({ commit }) {
      db
        .ref("empreendimentos/bosc")
        .orderByChild("email")
        .equalTo(auth.currentUser.email)
        .once("value")
        .then(function(snapshot) {
          let result = snapshot.val();
          if (!result) {
            commit("SET_VISITANTE", true);
          } else if (Object.keys(result).length === 1) {
            commit("SET_TIPOLOGIA", result[Object.keys(result)[0]].tipologia);
          } else if (Object.keys(result).length === 1) {
            commit("SET_UNIDADES", result);
          }
        })
        .catch(error => console.log(error));
    }
  }
});
