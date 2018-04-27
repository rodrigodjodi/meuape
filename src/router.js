import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import AdmLogin from "./views/AdmLogin.vue";
import UserLogin from "./views/UserLogin.vue";
import FinishUserLogin from "./views/FinishUserLogin.vue";
import FinishAdmLogin from "./views/FinishAdmLogin.vue";
import Erro from "./views/Erro.vue";
import store from "./store";
import { auth } from "./firebase";
Vue.use(Router);
auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("SET_USER", user);
  }
});
export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        auth: true
      }
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      meta: {
        title: "Administração Personalização",
        auth: true
      }
    },
    {
      path: "/admlogin",
      name: "admlogin",
      component: AdmLogin
    },
    {
      path: "/userlogin",
      name: "userlogin",
      component: UserLogin
    },
    {
      path: "/finishuserlogin",
      name: "finishuserlogin",
      component: FinishUserLogin
    },
    {
      path: "/finishadmlogin",
      name: "finishadmlogin",
      component: FinishAdmLogin
    },
    {
      path: "/erro",
      name: "erro",
      component: Erro
    }
  ]
});
