<template>
  <div class="home">
    <krpano xml="tour.xml"
      :lazy-load="true"
      @panoCreated="init"
      :scene="scene"
    />
    <div class="opcoes">
      <div class="opcoes-nav">
        <div class="tab" :class="[kit === 'padrao' ? 'active' : '']" @click="kit='padrao'">Padrão</div>
        <div class="tab" :class="[kit === 'classico' ? 'active' : '']" @click="kit='classico'">Clássico</div>
        <div class="tab" :class="[kit === 'contemporaneo' ? 'active' : '']" @click="kit='contemporaneo'">Contemporâneo</div>
      </div>
      <div class="opcoes-text">
        <h4 class="section-title">Personalizando apartamento &nbsp;
          <select v-if="tipologia" @change="changeApto">
            <option v-for="apto in nomesUnidades" :key="apto" :value="apto">{{apto}}</option>
          </select>
        </h4>
        <p v-if="tipologia">
           Tipologia: {{tipologia}}
        </p>
        <div style="text-align:center" v-else>
            <h3>Modo visitante. </h3>
            <p>Somente usuários registrados podem ver preços e condições.</p>
        </div>
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button  
            :labels="{checked: 'Sim (kit)', unchecked: 'Não'}"
            :width="90"
            v-if="kit !== 'padrao'" :value="true" :disabled="true"
          />
         <span style="margin-left:8px;">Acabamentos kit</span>
          <span v-if="tipologia" class="opItemValor">{{getCost('op1')|currency}}</span>
        </div>
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button
            :value="op2"
            :sync="true"
            @change = "setOption(2)"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          />
          <span style="margin-left:8px;">Piso áreas secas</span>
          <span v-if="tipologia"  class="opItemValor">{{getCost('op2')|currency}}</span>
        </div>
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button
            :value="op3"
            :sync="true"
            @change = "setOption(3)"
            :width="90"
            :labels="{checked: 'Pintura', unchecked: 'Porcelanato'}"
            :color="{checked: '#75C791', unchecked: '#75C791'}"
          />
          <span style="margin-left:8px;">Parede da Cozinha</span>
          <span v-if="tipologia"  class="opItemValor">{{getCost('op3')|currency}}</span>

        </div>
        <div class="opItem">
          <toggle-button
            :value="op4"
            :sync="true"
            @change = "setOption(4)"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          />
          <span style="margin-left:8px;">Kit aquecedor</span>
          <span v-if="tipologia"  class="opItemValor">{{getCost('op4')|currency}}</span>
        </div>
      </div>
      <div v-if="tipologia" class="opcoes-text">
        <h4 class="section-title">Resumo do orçamento</h4>
        
          <span class="opItemValor">VALOR TOTAL DO ORÇAMENTO: {{custoTotal|currency}}</span>
        
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Krpano from "@/components/Krpano";
import { mapState } from "vuex";
import { db } from "../firebase";
export default {
  name: "home",
  components: { Krpano },
  data() {
    return {
      constants: {
        PRAZO_MAX_QUITACAO: new Date(2019, 7, 31),
        VALOR_MINIMO_PARCELA: 2000
      },
      apto: "",
      tipologia: "",
      ambiente: "sala",
      kit: "padrao",
      op1: true,
      op2: false,
      op3: false,
      op4: false,
      unidades: null,
      nomesUnidades: [],
      custos: {
        "2quartos": {
          op1: 12.917,
          op2: 18.197,
          op3: 0,
          op4: 8.595
        },
        "3quartos": {
          op1: 13.293,
          op2: 24.592,
          op3: 0,
          op4: 8.595
        },
        duplex: {
          op1: 15.04,
          op2: 33.641,
          op3: 0,
          op4: 8.595
        }
      }
    };
  },
  filters :{
    currency(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }
  },
  computed: {
    ...mapState(["incc", "userEmail"]),
    parcelasMaximasData() {
      let DisplayFrom = new Date();
      let DisplayTo = this.constants.PRAZO_MAX_QUITACAO;
      console.log(DisplayFrom, DisplayTo)
      if (DisplayFrom < DisplayTo) {
        return (
          DisplayTo.getMonth() -
          DisplayFrom.getMonth() +
          12 * (DisplayTo.getFullYear() - DisplayFrom.getFullYear())
        );
      } else {
        return 0;
      }
    },
    parcelasMaximasValor () {
      return this.CustoTotal / this.constants.VALOR_MINIMO_PARCELA
    },
    custoTotal() {
      let sum = 0;
      this.kit === "padrao"
        ? (sum += 0)
        : (sum += this.custos[this.tipologia]["op1"]);
      this.op2 ? (sum += this.custos[this.tipologia]["op2"]) : (sum += 0);
      this.op4 ? (sum += this.custos[this.tipologia]["op4"]) : (sum += 0);

      let cost = sum * this.incc;

      return cost;
    },
    scene() {
      let sceneString = "";
      if (this.kit === "padrao") {
        sceneString = this.ambiente + "-" + this.kit;
      } else {
        sceneString =
          this.ambiente +
          "-" +
          this.kit +
          "-" +
          Number(this.op1) +
          "_" +
          Number(this.op2);
        if (this.ambiente === "sala") {
          sceneString += "_" + Number(this.op3);
        }
      }
      return sceneString;
    }
  },
  methods: {
    changeApto(ev) {
      let ap = ev.target.value;
      this.apto = ap;
      this.tipologia = this.unidades[ap].tipologia;
    },
    setKit(kit) {
      this.$store.commit("TOGGLE_KIT", kit);
    },
    setOption(op) {
      this["op" + op] = !this["op" + op];
    },
    getCost(op) {
      if (this.visitante) return 0;
      var cost = this[op] ? this.custos[this.tipologia][op] * this.incc : 0;
      return cost;
    },
    init() {
      console.log("initialized");
    },
    getUserInfo() {
      console.log("home user: " + this.userEmail);
      if (!this.userEmail) return;
      db
        .ref("empreendimentos/bosc")
        .orderByChild("adm/email")
        .equalTo(this.userEmail)
        .once("value")
        .then(snapshot => {
          let result = snapshot.val();
          console.log(result);
          if (!result) {
            console.log("É visitante");
          }
          let arrayUnidades = Object.keys(result).sort((a, b) => a - b);
          this.nomesUnidades = arrayUnidades;
          this.apto = arrayUnidades[0];
          this.tipologia = result[arrayUnidades[0]].tipologia;
          this.$store.commit(
            "SET_USER_DISPLAY_NAME",
            result[arrayUnidades[0]].adm.nome
          );
          this.unidades = result;
        })
        .catch(error => console.log(error));
    }
  },
  watch: {
    userEmail: "getUserInfo"
  },
  created() {
    console.log(".Home.vue created hook:");
    window.vm = this;
    this.$store.dispatch("getINCC");
    this.getUserInfo();
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
.krpano {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 480px;
  min-height: 360px;
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
  border: 2px groove #555;
  align-self: stretch;
  color: #fff;
  padding: 10px;
  margin: 20px 4px;
  display: flex;
  flex-direction: column;
}
.section-title {
  margin: -20px -4px 0;
  background-color: #2d2d2b;
  align-self: flex-start;
  padding: 0 4px;
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
.opItem {
  display: flex;
  border: 2px groove #555;
  margin: 8px 0;
  padding: 4px;
}
.opItemValor {
  margin-left: auto;
}

@media (max-width: 479px) {
  .home {
    margin: 0;
    border: none;
  }
}
</style>
