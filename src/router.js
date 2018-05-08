import Vue from "vue";
import Router from "vue-router";
const Erro = () => import("./views/Erro.vue");
const Home = () => import("./views/Home.vue");
const Admin = () => import("./views/Admin.vue");
const Login = () => import("./views/Login.vue");
const FinishLogin = () => import("./views/FinishLogin.vue");
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
        auth: true,
        admin: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login
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

router.beforeResolve((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.auth) {
    auth.onAuthStateChanged(user => {
      if (user) {
        store.commit("SET_USER_EMAIL", user.email);
        store.commit("SET_USER_DISPLAY_NAME", user.email);
        if (to.meta.admin) {
          user.getIdToken().then(idToken => {
            // Parse the ID token.
            const payload = JSON.parse(atob(idToken.split(".")[1]));
            // Confirm the user is an Admin.
            if (!!payload["admin"]) {
              console.log("usuário é administrador.");
              next();
            } else {
              console.error("Somente administradores tem acesso a essa rota.");
              next("/login");
            }
          });
        } else {
          next();
        }
      } else {
        store.commit("SET_USER_EMAIL", null);
        next("/login");
      }
    });
  } else {
    next();
  }
});

export default router;
