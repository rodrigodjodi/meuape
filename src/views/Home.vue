<template>
  <div class="home">
    <krpano xml="tour.xml"
      :lazy-load="true"
      @panoCreated="init"
      :scene="scene"
    />
    <div class="opcoes">
      <div class="panel">
        <h4 class="section-center">Personalizando apartamento &nbsp;
          <select v-if="tipologia" @change="changeApto">
            <option v-for="apto in nomesUnidades" :key="apto" :value="apto">{{apto}}</option>
          </select> :
          {{tipologia}}
        </h4>
        <section class="opItem">
          <div class="section-titles">
            <h4 @click="sectionExpanded = !sectionExpanded" style="cursor:pointer;" class="section-left">Kit Acabamentos</h4>
            <h4 v-if="tipologia" class="section-right">{{getCost('op1')|currency}}</h4>
          </div>
          <div class="opcoes-nav">
            <button :disabled="lockdown" class="tab" :class="[kit === 'padrao' ? 'active' : '', {locked:lockdown}]" @click="kit='padrao'">Padrão</button>
            <button :disabled="lockdown" class="tab" :class="[kit === 'classico' ? 'active' : '', {locked:lockdown}]" @click="kit='classico'">Clássico</button>
            <button :disabled="lockdown" class="tab" :class="[kit === 'contemporaneo' ? 'active' : '', {locked:lockdown}]" @click="kit='contemporaneo'">Contemporâneo</button>
          </div>
          <div v-if="sectionExpanded">
            <p>Acabamentos</p>
            <ul>
              <li>Pisos Banheiros:</li>
              <li>Paredes Banheiros:</li>
              <li>Metais Banheiros:</li>
              <li>Piso Cozinha:</li>
              <li>Paredes Cozinha:</li>
              <li>Piso Sacada:</li>
            </ul>
          </div>
        </section>

        <section class="opItem">
          <div class="section-titles">
            <h4 class="section-left">Piso áreas secas</h4>
            <h4 v-if="tipologia" class="section-right">{{getCost('op2')|currency}}</h4>
          </div>
          <div class="opcoes-nav">
            <button :disabled="lockdown" class="tab" :class="[op2 ? '' : 'active', {locked:lockdown}]" @click="op2=false">Contrapiso</button>
            <button :disabled="lockdown" class="tab" :class="[op2  ? 'active' : '', {locked:lockdown}]" @click="op2=true" v-if="kit !== 'padrao'">Opção do kit</button>
          </div>
        </section>

        <section class="opItem">
          <div class="section-titles">
            <h4 class="section-left">Paredes cozinha / lavanderia</h4>
            <h4 v-if="tipologia" class="section-right">sem alteração</h4>
          </div>
          <div class="opcoes-nav">
            <button :disabled="lockdown" class="tab" :class="[op3 ? '' : 'active', {locked:lockdown}]" @click="op3=false">Porcelanato</button>
            <button :disabled="lockdown" class="tab" :class="[op3  ? 'active' : '', {locked:lockdown}]" @click="op3=true" v-if="kit !== 'padrao'">Pintura</button>
          </div>
        </section>

        <section class="opItem">
          <div class="section-titles">
            <h4 class="section-left">Instalação kit aquecedor</h4>
            <h4 v-if="tipologia" class="section-right">{{getCost('op4')|currency}}</h4>
          </div>
          <div class="opcoes-nav">
            <button :disabled="lockdown" class="tab" :class="[op4 ? '' : 'active', {locked:lockdown}]" @click="op4=false">Não</button>
            <button :disabled="lockdown" class="tab" :class="[op4  ? 'active' : '', {locked:lockdown}]" @click="op4=true">Sim</button>
          </div>
        </section>
      </div>
      <div v-if="tipologia" class="panel">
        <h4 class="section-left">Resumo</h4>
        
          <span class="opItemValor">VALOR TOTAL DO ORÇAMENTO: {{custoTotal|currency}}</span>
          <span v-if="numParcelas" class="opItemValor">CONDIÇÕES DE PAGAMENTO:
            <select>
              <option v-for="n in numParcelas" :value="n" :key="n">
                {{n}} x de {{valorParcela(n)|currency}}
              </option>
            </select>
          </span>
          <button @click="showDocModal = true" class="opItemValor">GERAR SOLICITAÇÃO</button>
      </div>
      <modal v-if="showDocModal" @close="showDocModal=false">
        <div slot="body" style="height:80vh;width:56vh;">
          <pdf/>
        </div>
        <div slot="footer">
          <input type="checkbox" name="agreement" id="agreement">
          <label for="agreement">Entendo as condições</label>
          <button>CONFIRMAR</button>
          <button @click="showDocModal = false">VOLTAR</button>
        </div>
      </modal>
      <modal v-if="false">

          <h3 slot="header">Prezado cliente seja bem-vindo!</h3>
          <p slot="body">Parabéns por se tornar um cliente Piemonte, agora você possui um setor técnico de
            personalização à sua disposição.
          </p>

        <div slot="footer">
          <button @click="showWelcomeModal = false">FECHAR</button>
          <button onclick="alert('baixa pdf do manual ou mostra na tela?')">DOWNLOAD MANUAL</button>
        </div>
      </modal>

    </div><!-- raiz opções -->
  </div><!-- raiz home -->
</template>

<script>
// @ is an alias to /src
import Krpano from "@/components/Krpano";
const pdf = () => import("@/components/PDF");
import { mapState } from "vuex";
import { db } from "../firebase";
import floor from "lodash.floor";
const Modal = () => import("@/components/Modal");
export default {
  name: "home",
  components: { Krpano, Modal, pdf },
  data() {
    return {
      lockdown: false,
      sectionExpanded: false,
      showDocModal: false,
      showWelcomeModal: false,
      pdf: "",
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
      },
      acabamentos: {
        padrao: {},
        classico: {},
        contemporaneo: {}
      }
    };
  },
  filters: {
    currency(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }
  },
  computed: {
    ...mapState(["incc", "userEmail"]),
    numMaxParcelasData() {
      let DisplayFrom = new Date();
      let DisplayTo = this.constants.PRAZO_MAX_QUITACAO;
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
    numMaxParcelasValor() {
      return floor(this.custoTotal / this.constants.VALOR_MINIMO_PARCELA);
    },
    numParcelas() {
      return Math.min(this.numMaxParcelasData, this.numMaxParcelasValor);
    },
    custoTotal() {
      let sum = 0;
      if (this.kit === "padrao") {
        this.op4 ? (sum += this.getCost("op4")) : (sum += 0);
      } else {
        sum += this.getCost("op1");
        this.op2 ? (sum += this.getCost("op2")) : (sum += 0);
        this.op4 ? (sum += this.getCost("op4")) : (sum += 0);
      }
      return floor(sum, 2);
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
    confirmOptions() {
      db.ref("empreendimentos/bosc/" + this.apto).update(
        {
          private: {
            kit: this.kit,
            op2: this.op2,
            op3: this.op3,
            op4: this.op4,
            valorTotal: this.custoTotal,
            numParcelas: this.numParcelas,
            valorParcela: this.valorParcela(this.numParcelas)
          }
        },
        () => console.log("dados registrados...")
      );
    },
    valorParcela(numParcelas) {
      return floor(this.custoTotal / numParcelas, 2);
    },
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
      if (!this.tipologia) return 0;
      if (this.kit === "padrao" && op === "op1") return 0;
      var cost = this[op] ? this.custos[this.tipologia][op] * this.incc : 0;
      return floor(cost, 2);
    },
    init() {
      console.log("initialized");
    },
    getUserInfo() {
      if (!this.userEmail) return;
      db
        .ref("empreendimentos/bosc")
        .orderByChild("adm/email")
        .equalTo(this.userEmail)
        .once("value")
        .then(snapshot => {
          let result = snapshot.val();
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
    userEmail: "getUserInfo",
    kit(val) {
      if (val === "padrao") {
        this.op2 = false;
        this.op3 = false;
      }
    },
    apto(val) {
      if (val) {
        this.showWelcomeModal = true;
        if (this.unidades[val].isLocked) {
          this.lockdown = true;
        } else {
          this.lockdown = false;
        }
      }
    }
  },
  created() {
    window.vm = this;
    this.$store.dispatch("getINCC");
    this.getUserInfo();
  }
};
</script>

<style>
.home {
  display: flex;
  margin: 15px 5px;
  flex-wrap: wrap;
}
.krpano {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 480px;
  min-height: 360px;
  margin-bottom: 20px;
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
.panel {
  border: 2px groove #555;
  align-self: stretch;
  color: #fff;
  padding: 0 10px 0;
  margin: 0 4px 15px;
  display: flex;
  flex-direction: column;
}
.section-left {
  background-color: #2d2d2b;
  padding: 0 4px;
}
.section-center {
  margin: -12px 0 15px;
  background-color: #2d2d2b;
  align-self: center;
  padding: 0 4px;
}
.section-right {
  margin-left: auto;
  background-color: #2d2d2b;
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
  border: 1px solid #9ac088;
  border-radius: 4px;
}
.locked {
  cursor: not-allowed;
}
.tab:not(.locked):hover {
  background-color: #b5e29f;
}
.active {
  background-color: #9ac088;
}
.opItem {
  display: flex;
  flex-direction: column;
  border: 2px groove #555;
  margin: 8px 0;
  padding: 4px;
}
.section-titles {
  display: flex;
  margin: -36px 0 -15px;
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
