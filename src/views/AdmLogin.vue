<template>
  <div>
      <h1>Login adm </h1>
      <input v-model="email" type="email" name="email" id="">
      <button @click="sendEmailLink" type="submit">LOG IN</button>
      <p v-if="msg">{{msg}}</p>
  </div>
</template>

<script>
import { auth, actionCodeSettings } from "../firebase";
export default {
  data() {
    return {
      email: "",
      msg: null
    };
  },
  methods: {
    sendEmailLink() {
      actionCodeSettings.url += "finishadmlogin";
      auth
        .sendSignInLinkToEmail(this.email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem("emailForSignIn", this.email);
          this.email = "";
          this.msg = `Enviamos um link de acesso para seu email.
           Você pode fechar essa janela e continuar pelo link enviado.`;
        })
        .catch(error => {
          if (error.code === "auth/invalid-email") {
            this.email = "";
            this.msg =
              "Houve um problema com o email fornecido. Tente novamente.";
          } else {
            console.error(error);
          }
        });
    }
  },
  created() {
    console.log("este é o component admlogin");
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("tem um usuario");
        this.$router.push("admin");
      } else {
        console.log("why not user?");
      }
    });
  }
};
</script>
