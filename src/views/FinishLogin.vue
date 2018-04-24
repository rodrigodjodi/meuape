<template>
  <div>
    <div v-if="loginSuccess">
        <h1>Fim do login </h1>
        <p>Seu login foi realizado com êxito!</p>
        <p>Você pode fechar essa janela e voltar para a página de personalização.</p>
    </div>
  </div>
</template>
<script>
import { auth } from "../firebase";
export default {
  data() {
    return {
      loginSuccess: false
    };
  },
  mounted() {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      auth
        .signInWithEmailLink(email)
        .then(() => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          this.loginSuccess = true;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
