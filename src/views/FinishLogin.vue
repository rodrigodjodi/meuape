<template>
  <div class="wrapper">
    <form class="login loading" :class="{ok:loginComplete}">
      <button>
      <h2>{{title}}</h2>
        <i class="spinner"></i>
        <span v-if="loginComplete">{{completeMsg}}</span>
      </button>
    </form>
  </div>
</template>
<script>
import { auth } from "../firebase";
export default {
  data() {
    return {
      loginComplete: false,
      loginError: false,
      completeMsg: "Você está sendo direcionado à personalização."
    };
  },
  computed: {
    title() {
      let titleMsg;
      if (!this.loginComplete) {
        titleMsg = "Validando...";
      } else {
        if (this.loginError) {
          titleMsg = "Erro :(";
        } else {
          titleMsg = "Pronto!";
        }
      }
      return titleMsg;
    }
  },
  created() {
    auth.onAuthStateChanged(user => {
      if (user) {
        setTimeout(() => this.$router.push("/"), 1000);
      }
    });
  },
  mounted() {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Por favor confirme seu e-mail");
      }
      auth
        .signInWithEmailLink(email)
        .then(() => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          this.loginComplete = true;
        })
        .catch(error => {
          this.loginError = true;
          this.loginComplete = true;

          this.completeMsg =
            "Parece que você usou um link expirado ou inválido. Redirecionando para login...";

          setTimeout(() => this.$router.push("/"), 3000);
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$primary: #42b983;
@keyframes spinner {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(359deg);
  }
}

* {
  box-sizing: border-box;
}
.errorMessage {
  color: rgb(235, 109, 109);
}
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background: rgba(darken($primary, 40%), 0.85);
}

.login {
  border-radius: 2px 2px 5px 5px;
  padding: 10px 20px 20px 20px;
  width: 90%;
  max-width: 320px;
  min-height: 240px;
  background: #ffffff;
  position: relative;
  padding-bottom: 80px;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);

  &.loading {
    button {
      max-height: 100%;
      padding-top: 50px;
      .spinner {
        opacity: 1;
        top: 40%;
      }
    }
  }

  &.ok {
    button {
      background-color: #8bc34a;
      .spinner {
        border-radius: 0;
        border-top-color: transparent;
        border-right-color: transparent;
        height: 20px;
        animation: none;
        transform: rotateZ(-45deg);
      }
    }
  }

  input {
    display: block;
    padding: 15px 10px;
    margin-bottom: 10px;
    width: 100%;
    border: 1px solid #ddd;
    transition: border-width 0.2s ease;
    border-radius: 2px;
    color: #ccc;

    & + i.fa {
      color: #fff;
      font-size: 1em;
      position: absolute;
      margin-top: -42px;
      opacity: 0;
      left: 0;
      transition: all 0.1s ease-in;
    }

    &:focus {
      & + i.fa {
        opacity: 1;
        left: 30px;
        transition: all 0.25s ease-out;
      }
      outline: none;
      color: #444;
      border-color: $primary;
      border-left-width: 35px;
    }
  }

  a {
    font-size: 0.8em;
    color: $primary;
    text-decoration: none;
  }

  .title {
    color: #444;
    font-size: 1.2em;
    font-weight: bold;
    margin: 10px 0 30px 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
  }

  button {
    width: 100%;
    height: 100%;
    padding: 10px 10px;
    background: $primary;
    color: #fff;
    display: block;
    border: none;
    margin-top: 20px;
    position: absolute;
    left: 0;
    bottom: 0;
    max-height: 60px;
    border: 0px solid rgba(0, 0, 0, 0.1);
    border-radius: 0 0 2px 2px;
    transform: rotateZ(0deg);

    transition: all 0.1s ease-out;
    border-bottom-width: 7px;

    .spinner {
      display: block;
      width: 40px;
      height: 40px;
      position: absolute;
      border: 4px solid #ffffff;
      border-top-color: rgba(255, 255, 255, 0.3);
      border-radius: 100%;
      left: 50%;
      top: 0;
      opacity: 0;
      margin-left: -20px;
      margin-top: -20px;
      animation: spinner 0.6s infinite linear;
      transition: top 0.3s 0.3s ease, opacity 0.3s 0.3s ease,
        border-radius 0.3s ease;
      box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.2);
    }
  }

  &:not(.loading) button:hover {
    box-shadow: 0px 1px 3px $primary;
  }
  &:not(.loading) button:focus {
    border-bottom-width: 4px;
  }
}
</style>
