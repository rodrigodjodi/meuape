<template>
  <div>
      <h1>Fim do login </h1>
  </div>
</template>
<script>
import { auth } from "../firebase";
export default {
  mounted() {
    console.log(window.location.href);
    if (auth.isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }
      auth
        .signInWithEmailLink(email)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          this.$router.push("/");
        })
        .catch(error => console.log(error));
    }
  }
};
</script>
