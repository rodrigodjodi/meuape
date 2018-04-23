import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import Login from "./views/Login.vue";
import FinishLogin from "./views/FinishLogin.vue";
import Erro from "./views/Erro.vue";
import { auth, actionCodeSettings } from "./firebase";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      beforeEnter(to, from, next) {
        if (to.query.email) {
          auth
            .sendSignInLinkToEmail(to.query.email, actionCodeSettings)
            .then(function() {
              console.log("Email de verificação enviado");
              window.localStorage.setItem("emailForSignIn", to.query.email);
              next("/finishLogin");
            })
            .catch(function(error) {
              console.log(error);
              next("erro");
            });
        } else {
          next();
        }
      }
    },
    {
      path: "/finishLogin",
      name: "finishLogin",
      component: FinishLogin
    },
    {
      path: "/erro",
      name: "erro",
      component: Erro
    }
  ]
});
