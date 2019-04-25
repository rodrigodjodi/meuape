<template>
  <div class="wrapper">
    <form @submit="onSubmit" class="login" :class="{loading:generatingLink, ok:linkReady}">
      <p class="title">Use seu e-mail para entrar</p>
      <input ref="email" v-model="email" type="email" placeholder="email" autofocus required>
      <svg
        data-v-02d38ff2
        aria-hidden="true"
        data-prefix="fas"
        data-icon="envelope"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="svg-inline--fa fa-envelope fa-w-16"
      >
        <path
          data-v-02d38ff2
          fill="currentColor"
          d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"
          class
        ></path>
      </svg>
      <span class="errorMessage">{{errMsg}}</span>
      <button>
        <h2 v-if="generatingLink">{{titleMsg}}</h2>
        <i v-if="generatingLink" class="spinner"></i>
        <span>{{msg}}</span>
      </button>
    </form>
  </div>
</template>

<script>
import { auth, actionCodeSettings } from "../firebase";
export default {
  components: {},
  data() {
    return {
      email: "",
      generatingLink: false,
      linkReady: false,
      errMsg: null
    };
  },
  computed: {
    titleMsg() {
      if (this.linkReady) {
        return "Pronto!";
      } else if (this.generatingLink) {
        return "Gerando link...";
      }
    },
    msg() {
      if (this.linkReady) {
        return `Enviamos um email para ${this.email} com o link de acesso.
        Você pode fechar essa janela.`;
      } else if (this.generatingLink) {
        return "";
      } else {
        return "ENTRAR";
      }
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.generatingLink = "true";
      this.sendEmailLink();
    },
    sendEmailLink() {
      actionCodeSettings.url = process.env.VUE_APP_URL + "finishlogin";
      auth
        .sendSignInLinkToEmail(this.email, actionCodeSettings)
        .then(() => {
          window.localStorage.setItem("emailForSignIn", this.email);
          this.linkReady = true;
        })
        .catch(error => {
          if (error.code === "auth/invalid-email") {
            this.email = "";
            this.$refs.email.focus();
            this.errMsg =
              "Houve um problema com o email fornecido. Tente novamente.";
          } else {
            console.error(error);
          }
        });
    }
  },
  created() {
    if (this.$route.query.email) {
      this.email = this.$route.query.email;
      this.generatingLink = "true";
      this.sendEmailLink();
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

    & + svg.fa-envelope {
      color: #fff;
      font-size: 1em;
      position: absolute;
      margin-top: -42px;
      opacity: 0;
      left: 0;
      transition: all 0.1s ease-in;
    }

    &:focus {
      & + svg.fa-envelope {
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
  .svg-inline--fa {
    display: inline-block;
    font-size: inherit;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
  }
  .svg-inline--fa.fa-w-16 {
    width: 1em;
  }
  svg:not(:root).svg-inline--fa {
    overflow: visible;
  }
}
</style>
