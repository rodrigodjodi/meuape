<template>
  <div id="app">
    <div class="header">
      <router-link class="logo" to="/">
        <img src="@/assets/piemonte.png" alt="logo piemonte">
      </router-link>
      <span v-if="user" class="greeting">Olá, {{displayName}}  </span>
      <span v-if="user" class="logout" @click="logout">SAIR</span>
    </div>
    <router-view class="router"/>
  </div>
</template>
<script>
import { auth } from "./firebase";
export default {
  computed: {
    user() {
      return this.$store.state.userEmail;
    },
    displayName() {
      return this.$store.state.displayName;
    }
  },
  methods: {
    logout() {
      auth.signOut().then(() => this.$router.push("userlogin"));
    }
  },
  created() {}
};
</script>

<style>
h2,
h3 {
  font-weight: 300;
}
html,
body {
  background-color: #2d2d2b;
  margin: 0;
  height: 100%;
  font-family: Lato, sans-serif;
}
#app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100%;
}
.header {
  display: flex;
  background-color: rgba(69, 82, 88, 0.9);
  padding: 10px 20px;
  border-bottom: 1px solid #455258;
  align-items: center;
}
.header .logo {
  width: 200px;
}
.header img {
  max-width: 100%;
}
.header .logout {
  margin-left: auto;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.header .logout:hover {
  color: #9ac088;
}
.header .greeting {
  margin-left: auto;
  color: white;
  text-decoration: none;
}
.router {
  flex: 1;
}
@media (max-width: 479px) {
  .header {
    padding: 8px 8px 0;
  }
}
</style>
