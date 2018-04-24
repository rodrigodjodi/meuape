import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import Login from "./views/Login.vue";
import UserLogin from "./views/UserLogin.vue";
import FinishLogin from "./views/FinishLogin.vue";
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
        auth.currentUser ? next() : next("login");
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/userlogin",
      name: "userlogin",
      component: UserLogin
    },
    {
      path: "/finishlogin",
      name: "finishlogin",
      component: FinishLogin
    },
    {
      path: "/erro",
      name: "erro",
      component: Erro
    }
  ]
});
