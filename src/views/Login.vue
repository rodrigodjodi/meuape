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
      auth
        .sendSignInLinkToEmail(this.email, actionCodeSettings)
        .then(() => {
          console.log("Email de verificação enviado");
          window.localStorage.setItem("emailForSignIn", this.email);
          this.msg = "Enviamos um link de acesso para seu e-mail.";
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
