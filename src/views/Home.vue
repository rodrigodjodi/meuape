<template>
  <div class="home">
    <krpano :xml="'tour.xml'"
      :lazy-load="true"
      class="content"
      @panoCreated="init"
      :scene="scene"
    />
    <div class="opcoes">
      <div class="opcoes-nav">
        <div class="tab" :class="{active:scenepadrao}" @click="scene = 'padrao'">Padrão</div>
        <div class="tab" :class="{active:sceneclassico}" @click="scene = 'classico'">Clássico</div>
        <div class="tab" :class="{active:scenecontemporaneo}" @click="scene = 'contemporaneo'">Contemporâneo</div>
      </div>
        
      <div class="opcoes-text">
        <h2>Pisos</h2>
        <p>Sala: {{opcoes.pisoSala}}</p>
        <p>Cozinha: {{opcoes.pisoCozinha}}</p>
        <h2>Forros</h2>
        <p>Sala: {{opcoes.forroSala}}</p>
        <p>Cozinha: {{opcoes.forroCozinha}}</p>
      </div>
      <div>
          <select :disabled="!loggedIn" id="soflow" name="apartamentos">
            <option value="0">Selecione um apartamento</option>
            <option v-for="ap in apartamentos" :key="ap" value="ap">{{ap}}</option>
          </select>
        <button @click="confirmaPedido" class="opcoes-confirm">CONFIRMAR PEDIDO</button>
      </div>
      <p v-show="!loggedIn" style="color:red">É necessário entrar para confirmar o pedido.</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Krpano from "vue-krpano";
export default {
  name: "home",
  components: { Krpano },
  data() {
    return {
      scene: "padrao",
      apartamentos: [
        101,
        102,
        103,
        104,
        201,
        202,
        203,
        204,
        301,
        302,
        303,
        304,
        401,
        402,
        403,
        404
      ],
      logRequestVisible: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    opcoes() {
      let options = {};
      switch (this.scene) {
        case "padrao":
          options.pisoSala = "Contrapiso em concreto.";
          options.pisoCozinha = "Cerâmica branca 40x40.";
          options.forroSala = "Laje com pintura branca.";
          options.forroCozinha = "Forro de gesso com pintura branca.";
          break;
        case "classico":
          options.pisoSala = "  Laminado madeira padrão carvalho";
          options.pisoCozinha = "Porcelanato ";
          options.forroSala = "Forro de gesso com rodateto";
          options.forroCozinha = "Forro de gesso com pintura branca.";
          break;
        case "contemporaneo":
          options.pisoSala = "  Porcelanato 60x60";
          options.pisoCozinha = "Porcelanato";
          options.forroSala = "Forro de gesso com destaque";
          options.forroCozinha = "Forro de gesso com pintura branca.";
          break;

        default:
          break;
      }
      return options;
    },
    scenepadrao() {
      return this.scene === "padrao" ? true : false;
    },
    sceneclassico() {
      return this.scene === "classico" ? true : false;
    },
    scenecontemporaneo() {
      return this.scene === "contemporaneo" ? true : false;
    }
  },
  methods: {
    init() {
      console.log("initialized");
    },
    confirmaPedido() {
      if (!this.loggedIn) {
        this.logRequestVisible = true;
      } else {
        alert(
          "Aqui leva para o downlaod de um pdf com as informações do contato, apartamento e escolha do kit para assinatura."
        );
      }
    }
  }
};
</script>
<style>
.home {
  display: flex;
  border: 2px solid #9ac088;
  padding: 10px;
  margin: 10px 5px;
  flex-wrap: wrap;
}
.content {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 480px;
  height: 60vmin;
}
.opcoes {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 480px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.opcoes-nav {
  display: flex;
  width: 100%;
}
.opcoes-text {
  flex: 0;
  align-self: flex-start;
  color: #fff;
  padding: 10px;
}
.opcoes-confirm {
  align-self: center;
  background-color: #9ac088;
  border: 0;
  border-radius: 10px;
  padding: 9px 15px;
  color: white;
}
.tab {
  height: 40px;
  flex: 1;
  cursor: pointer;
  text-align: center;
  background-color: #555;
  color: white;
  padding-top: 12px;
  border: 1px solid #9ac088;
  margin: 4px;
}
.tab:hover {
  border: 2px solid #9ac088;
}
.active {
  background-color: #9ac088;
}
select#soflow {
  -webkit-appearance: button;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  -webkit-padding-end: 20px;
  -webkit-padding-start: 2px;
  -webkit-user-select: none;
  user-select: none;
  background-image: url(http://i62.tinypic.com/15xvbd5.png),
    -webkit-linear-gradient(#fafafa, #f4f4f4 40%, #e5e5e5);
  background-position: 97% center;
  background-repeat: no-repeat;
  border: 1px solid #aaa;
  color: #555;
  font-size: inherit;
  margin: 20px;
  overflow: hidden;
  padding: 5px 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
}
</style>
