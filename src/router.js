import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Admin from "./views/Admin.vue";
import Login from "./views/Login.vue";
import FinishLogin from "./views/FinishLogin.vue";
import Erro from "./views/Erro.vue";
import { auth } from "./firebase";
import store from "./store";
Vue.use(Router);

const router = new Router({
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
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/erro",
      name: "erro",
      component: Erro
    }
  ]
});

router.beforeResolve((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.auth) {
    auth.onAuthStateChanged(user => {
      console.log("2. : onAuthStateChanged fired");
      if (user) {
        console.log("3. user exists:");
        console.log(user);
        store.commit("SET_USER_EMAIL", user.email);
        store.commit("SET_USER_DISPLAY_NAME", user.email);
        console.log("4. user email commited");
        next();
      } else {
        console.log("else do if user");
        store.commit("SET_USER_EMAIL", null);
        if (to.name === "admin") {
          next("/admlogin");
        } else {
          next("/userlogin");
        }
      }
    });
  } else {
    next();
  }
});

export default router;
