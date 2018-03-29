<template>
  <div id="app">
    <div id="nav">
      <router-link class="logo" to="/">
        <img src="images/piemonte.png" alt="logo piemonte">
      </router-link>
      <div @click="toggleLog" class="login">{{rightText}}</div>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  computed: {
    rightText() {
      return this.$store.state.loggedIn ? "Olá, Piemonte." : "ENTRAR";
    }
  },
  methods: {
    toggleLog() {
      this.$store.commit("TOOGLE_LOG");
    }
  }
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
}
#app {
  font-family: "Lato", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  display: flex;
  background-color: rgba(69, 82, 88, 0.9);
  padding: 10px 20px;
  border-bottom: 1px solid #455258;
  align-items: center;
}
#nav img {
  width: 200px;
  height: 49px;
}
.login {
  margin-left: auto;
  color: white;
  text-decoration: none;
  color: #42b983;
  cursor: pointer;
}
.logo {
  flex: 1;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
