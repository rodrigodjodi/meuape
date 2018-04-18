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
        <div class="tab" :class="[acabamento === 'padrao' ? 'active' : '']" @click="acabamento = 'padrao'">Padrão</div>
        <div class="tab" :class="[acabamento === 'classico' ? 'active' : '']" @click="acabamento = 'classico'">Clássico</div>
        <div class="tab" :class="[acabamento === 'contemporaneo' ? 'active' : '']" @click="acabamento = 'contemporaneo'">Contemporâneo</div>
      </div>
      <div class="opcoes-amb">
        <toggle-button 
          v-model="sala"
          :value="true"
          id="ambtoggle"
          :labels="{checked: 'Sala', unchecked: 'Banheiro'}"
          :width="100"
          :color="{checked: '#75C791', unchecked: '#0e607f'}"
        />
      </div>
      <div class="opcoes-text">
        <div class="opItem"  v-if="acabamento !== 'padrao'">
          <toggle-button  
            :labels="{checked: 'Sim (kit)', unchecked: 'Não'}"
            :width="90"
            v-if="acabamento !== 'padrao'" :value="true" :disabled="true"/> Acabamentos e revestimentos {{getCost('op1')}}<br/><br/>
        </div>
        <div class="opItem"  v-if="acabamento !== 'padrao'">
          <toggle-button
            v-model="op2"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          /> Piso áreas secas {{getCost('op2')}}<br/><br/>
        </div>
        <div class="opItem"  v-if="acabamento !== 'padrao'">
          <toggle-button
            v-model="op3"
            :width="90"
            :labels="{checked: 'Pintura', unchecked: 'Porcelanato'}"
          /> Parede da Cozinha<br/><br/>
        </div>
        <div class="opItem">
          <toggle-button
            v-model="op4"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          /> Kit aquecedor {{getCost('op4')}}
        </div>
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
      tipologia: "2q",
      sala: true,
      acabamento: "padrao",
      op1: true,
      op2: false,
      op3: false,
      op4: false,
      custos: {
        "2q": {
          padrao: {
            op4: 3478.9
          },
          classico: {
            op1: 3329.91,
            op2: 7368.66,
            op3: 0,
            op4: 3478.9
          },
          contemporaneo: {
            op1: 4069.22,
            op2: 6433.01,
            op3: 0,
            op4: 3478.9
          }
        },
        "3q": {
          padrao: {
            op4: 3478.9
          },
          classico: {
            op1: 0,
            op2: 0,
            op3: 0,
            op4: 0
          },
          contemporaneo: {
            op1: 0,
            op2: 0,
            op3: 0,
            op4: 0
          }
        },
        duplex: {
          padrao: {
            op4: 3478.9
          },
          classico: {
            op1: 0,
            op2: 0,
            op3: 0,
            op4: 0
          },
          contemporaneo: {
            op1: 0,
            op2: 0,
            op3: 0,
            op4: 0
          }
        }
      }
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
    getCost(op) {
      var cost = this[op]
        ? this.custos[this.tipologia][this.acabamento][op]
        : 0;
      return cost.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
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
.opcoes-amb {
  flex: 0;
  align-self: center;
  margin: 10px 0;
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
}
.tab:hover {
  background-color: #b5e29f;
}
.active {
  background-color: #9ac088;
}
</style>
