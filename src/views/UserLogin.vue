<template>
  <div>
      <h1>Login Usuário </h1>
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
          }
        });
    }
  },
  created() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$router.push("/");
      } else {
        if (this.$route.query.email) {
          this.email = this.$route.query.email;
          this.sendEmailLink();
        }
      }
    });
  }
};
</script>
