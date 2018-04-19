import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false,
    tipologia: "2q",
    ambiente: "sala",
    kit: "padrao",
    op1: true,
    op2: false,
    op3: false,
    op4: false
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
    TOOGLE_LOG(state) {
      state.loggedIn = !state.loggedIn;
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
    }
  },
  actions: {}
});
