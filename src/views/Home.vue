<template>
  <div class="home">
    <krpano xml="tour.xml"
      :lazy-load="true"
      class="content"
      @panoCreated="init"
      :scene="scene"
    />
    <div class="opcoes">
      <div class="opcoes-nav">
        <div class="tab" @click="acabamento = 'padrao'">Padrão</div>
        <div class="tab" @click="acabamento = 'classico'">Clássico</div>
        <div class="tab" @click="acabamento = 'contemporaneo'">Contemporâneo</div>
      </div>
        
        <toggle-button v-model="sala" :value="true" id="ambtoggle" :labels="{checked: 'Sala', unchecked: 'Banheiro'}" :width="100" :color="{checked: '#75C791', unchecked: '#0e607f'}"/><br/><br/>
      <div class="opcoes-text">
        <toggle-button v-model="op1" :sync="true"/> Acabamentos e revestimentos <br/><br/>
        <toggle-button v-model="op2"/> Piso áreas secas<br/><br/>
        <toggle-button v-model="op3"/> Substituir porcelanato por pintura<br/><br/>
        <toggle-button v-model="op4"/> Kit gás
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Krpano from "@/components/Krpano";
export default {
  name: "home",
  components: { Krpano },
  data() {
    return {
      sala: true,
      acabamento: "padrao",
      op1: false,
      op2: false,
      op3: false,
      op4: false,

      logRequestVisible: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    scene() {
      let sceneString = "";
      let ambiente = this.sala ? "sala" : "bwc";
      if (this.acabamento === "padrao") {
        sceneString = ambiente + "-" + this.acabamento;
      } else {
        sceneString =
          ambiente +
          "-" +
          this.acabamento +
          "-" +
          Number(this.op1) +
          "_" +
          Number(this.op2);
        if (this.sala) {
          sceneString += "_" + Number(this.op3);
        }
      }
      return sceneString;
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
  margin-left: 40px;
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
</style>
