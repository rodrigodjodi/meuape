import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import AdmLogin from "./views/AdmLogin.vue";
import UserLogin from "./views/UserLogin.vue";
import FinishUserLogin from "./views/FinishUserLogin.vue";
import FinishAdmLogin from "./views/FinishAdmLogin.vue";
import Erro from "./views/Erro.vue";
import { auth } from "./firebase";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      beforeEnter(to, from, next) {
        auth.currentUser ? next() : next("userlogin");
      }
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      beforeEnter(to, from, next) {
        auth.currentUser ? next() : next("admlogin");
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
