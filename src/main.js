import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import ToggleButton from "vue-js-toggle-button";
import "./firebase";
import VueFire from "vuefire";
Vue.use(VueFire);
Vue.use(ToggleButton);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
