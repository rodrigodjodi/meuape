<template>
  <div class="home">
    <krpano
      :xml="xml"
      :lazy-load="true"
      @panoCreated="init"
      :scene="scene"
      v-intro="'Suas escolhas serão atualizadas nessa janela. Use os botões SALA e BANHEIROS para mudar de ambiente.'"
    />
    <div class="opcoes">
      <div class="panel">
        <h4
          class="section-center"
          v-intro="'Verifique se o número da unidade e a tipologia estão corretos. Se for proprietário de mais de uma unidade será possível escolhê-la aqui'"
          v-intro-step="1"
        >
          Personalizando unidade &nbsp;
          <select v-if="tipologia" @change="changeApto">
            <option v-for="apto in nomesUnidades" :key="apto" :value="apto">{{apto}}</option>
          </select>
          :
          {{tipologia|tipologia}}
        </h4>
        <section class="opItem">
          <div class="section-titles">
            <h4
              @click="sectionExpanded = !sectionExpanded"
              style="cursor:pointer;"
              class="section-left"
            >Kit Acabamentos</h4>
            <h4 v-if="tipologia" class="section-right">{{getCost('op1')|currency}}</h4>
          </div>
          <div
            v-intro="'Escolha o acabamento. As opções Clássico e Contemporâneo adicionam revestimentos e mais opções de personalização.'"
            v-intro-step="3"
            class="opcoes-nav"
          >
            <button
              :disabled="lockdown"
              class="tab"
              :class="[kit === 'padrao' ? 'active' : '', {locked:lockdown}]"
              @click="kit='padrao'"
            >Padrão</button>
            <button
              :disabled="lockdown"
              class="tab"
              :class="[kit === 'classico' ? 'active' : '', {locked:lockdown}]"
              @click="kit='classico'"
            >Clássico</button>
            <button
              :disabled="lockdown"
              class="tab"
              :class="[kit === 'contemporaneo' ? 'active' : '', {locked:lockdown}]"
              @click="kit='contemporaneo'"
            >Contemporâneo</button>
          </div>
          <div class="opcoes-nav">
            <a
              @click="toggleKitDetails"
              class="detalhes"
              v-intro="'Clicando aqui você pode ver todos os detalhes de cada kit'"
              v-intro-step="4"
            >{{kitDetailsMsg}}</a>
          </div>
        </section>

        <section class="opItem">
          <div class="section-titles">
            <h4 class="section-left">Piso áreas secas</h4>
            <h4 v-if="tipologia" class="section-right">{{getCost('op2')|currency}}</h4>
          </div>
          <div
            class="opcoes-nav"
            v-intro="'Nos kits Clássico e Contemporâneo você pode decidir se já quer receber as áreas secas com piso.'"
            v-intro-step="5"
          >
            <button
              :disabled="lockdown"
              class="tab"
              :class="[op2 ? '' : 'active', {locked:lockdown}]"
              @click="op2=false"
              :title="kit === 'padrao' ? 'Para mais opções escolha kit Clássico ou Contemporâneo' :''"
            >Contrapiso</button>
            <button
              :disabled="lockdown"
              class="tab"
              :class="[op2  ? 'active' : '', {locked:lockdown}]"
              @click="op2=true"
              v-if="kit !== 'padrao'"
            >Opção do kit</button>
          </div>
        </section>

        <section class="opItem">
          <div class="section-titles">
            <h4 class="section-left">Paredes cozinha / lavanderia</h4>
            <h4 v-if="tipologia" class="section-right">sem alteração</h4>
          </div>
          <div
            class="opcoes-nav"
            v-intro="'Nos kits Clássico e Contemporâneo você pode substituir o porcelanato por pintura nas paredes da cozinha e lavanderia.'"
            v-intro-step="6"
          >
            <button
              :disabled="lockdown"
              class="tab"
              :class="[op3 ? '' : 'active', {locked:lockdown}]"
              @click="op3=false"
              :title="kit === 'padrao' ? 'Para mais opções escolha kit Clássico ou Contemporâneo' :''"
            >Porcelanato</button>
            <button
              :disabled="lockdown"
              class="tab"
              :class="[op3  ? 'active' : '', {locked:lockdown}]"
              @click="op3=true"
              v-if="kit !== 'padrao'"
            >Pintura</button>
          </div>
        </section>
        <div
          v-intro="'Esses itens estão disponíveis inclusive para o kit Padrão.'"
          v-intro-step="7"
          style="display: flex;flex-direction: column;"
        >
          <section class="opItem">
            <div class="section-titles">
              <h4 class="section-left">Instalação kit aquecedor</h4>
              <h4 v-if="tipologia" class="section-right">{{getCost('op4')|currency}}</h4>
            </div>
            <div class="opcoes-nav">
              <button
                :disabled="lockdown"
                class="tab"
                :class="[op4 ? '' : 'active', {locked:lockdown}]"
                @click="op4=false"
              >Não</button>
              <button
                :disabled="lockdown"
                class="tab"
                :class="[op4  ? 'active' : '', {locked:lockdown}]"
                @click="op4=true"
              >Sim</button>
            </div>
          </section>

          <section class="opItem">
            <div class="section-titles">
              <h4 class="section-left">Central de aspiração</h4>
              <h4 v-if="tipologia" class="section-right">{{getCost('op5')|currency}}</h4>
            </div>
            <div class="opcoes-nav">
              <button
                :disabled="lockdown"
                class="tab"
                :class="[op5 ? '' : 'active', {locked:lockdown}]"
                @click="op5=false"
              >Não</button>
              <button
                :disabled="lockdown"
                class="tab"
                :class="[op5  ? 'active' : '', {locked:lockdown}]"
                @click="op5=true"
              >Sim</button>
            </div>
          </section>

          <section class="opItem">
            <div class="section-titles">
              <h4 class="section-left">Assento eletrônico (banheiro suíte)</h4>
              <h4 v-if="tipologia" class="section-right">{{getCost('op6')|currency}}</h4>
            </div>
            <div class="opcoes-nav">
              <button
                :disabled="lockdown"
                class="tab"
                :class="[op6 ? '' : 'active', {locked:lockdown}]"
                @click="op6=false"
              >Não</button>
              <button
                :disabled="lockdown"
                class="tab"
                :class="[op6  ? 'active' : '', {locked:lockdown}]"
                @click="op6=true"
              >Sim</button>
            </div>
          </section>
        </div>
      </div>

      <div v-if="tipologia" class="panel">
        <h4 class="section-center">Resumo</h4>

        <h4 class="opItemValor">Valor total do orçamento: {{custoTotal|currency}}</h4>
        <h4 v-if="numMaxParcelas" class="opItemValor">
          Condições de pagamento:
          <select
            :disabled="lockdown"
            v-model="opcaoParcelas"
            v-intro="'Número de parcelas'"
            v-intro-step="8"
          >
            <option
              v-for="n in numMaxParcelas"
              :value="n"
              :key="n"
            >{{n}} x de {{valorParcela(n)|currency}}</option>
          </select>
        </h4>
        <button
          @click="showDocModal = true"
          class="btn-solicitacao"
          v-intro="'Confira todas suas escolhas'"
          v-intro-step="9"
        >
          {{lockdown ? "VER SOLICITAÇÃO GERADA"
          : "GERAR SOLICITAÇÃO"
          }}
        </button>
      </div>
      <a
        class="link-manual"
        href="manual-de-preenchimento-solicitacao-de-personalizacao-site.pdf"
        download="Manual-de-Preenchimento-Solicitação-de-Personalização-site.pdf"
        v-intro="'Ainda tem dúvidas? No manual tem instruções detalhadas! Não hesite em entrar em contato com nossa equipe.'"
        v-intro-step="10"
      >Manual de Preenchimento</a>
      <modal v-if="showDocModal" @close="showDocModal=false">
        <div slot="body" style="height:80vh;width:90vw;">
          <bosc-report ref="print"/>
        </div>
        <template slot="footer">
          <div v-if="!lockdown" style="margin-right:auto;flex:1 1 320px;">
            <input v-model="flagSolicitacao" type="checkbox" name="agreement" id="agreement">
            <label
              for="agreement"
            >Li e aceito as condições do termo de solicitação. Entendo que ao confirmar não poderei alterar as opções.</label>
          </div>
          <button class="modal-button" @click="showDocModal = false">fechar</button>
          
          <button class="modal-button primary" @click="print">imprimir</button>
          <button
            class="modal-button primary"
            v-if="!lockdown"
            @click="confirmOptions"
            :disabled="!flagSolicitacao"
          >CONFIRMAR</button>
        </template>
      </modal>
      <modal v-if="showWelcomeModal" @close="showWelcomeModal=false">
        <div slot="header">
          <img
            src="@/assets/bosc/bosc.png"
            alt="Logo Bosc"
            style="display: block;
              margin: 0 auto 10px;"
          >
          <h3>Prezado cliente seja bem-vindo!</h3>
        </div>
        <p slot="body" style="width:300px;">
          Parabéns por se tornar um cliente Piemonte, agora você possui um setor técnico de
          personalização à sua disposição.
        </p>
        <p
          slot="body"
          style="width:300px;"
        >Faça um tour para entender como fazer melhor proveito desta ferramenta.</p>

        <template slot="footer">
          <button class="modal-button primary" @click="tourStart">INICIAR TOUR</button>
        </template>
      </modal>
    </div>
    <!-- raiz opções -->
  </div>
  <!-- raiz home -->
</template>

<script>
import introJs from "intro.js";
// @ is an alias to /src
import Krpano from "@/components/Krpano";
const BoscReport = () => import("@/components/BoscReport");
import { mapState } from "vuex";
import { db } from "../firebase";
import floor from "lodash.floor";
const Modal = () => import("@/components/Modal");

export default {
  name: "home",
  components: { Krpano, Modal, BoscReport },
  data() {
    return {
      flagSolicitacao: false,
      xml: "tour.xml",
      opcaoParcelas: 1,
      lockdown: false,
      sectionExpanded: false,
      showDocModal: false,
      showWelcomeModal: false,
      constants: {
        PRAZO_MAX_QUITACAO: new Date(2019, 8, 31),
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
      op5: false,
      op6: false,
      unidades: null,
      nomesUnidades: [],
      custos: {
        "2quartos": {
          op1: 12.917,
          op2: 18.197,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        },
        "3quartos": {
          op1: 13.293,
          op2: 24.592,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        },
        duplex: {
          op1: 15.04,
          op2: 33.641,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        }
      }
    };
  },
  filters: {
    tipologia(tipo) {
      let tipologia = "";
      switch (tipo) {
        case "2quartos":
          tipologia = "2 Quartos";
          break;
        case "3quartos":
          tipologia = "3 Quartos";
          break;
        case "duplex":
          tipologia = "Duplex";
          break;
      }
      return tipologia;
    }
  },
  computed: {
    kitDetailsMsg() {
      return this.xml === "tour.xml"
        ? "Ver detalhes do kit"
        : "Sair da visualização do kit";
    },
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
    numMaxParcelas() {
      return Math.min(this.numMaxParcelasData, this.numMaxParcelasValor);
    },
    custoTotal() {
      let sum = 0;
      if (this.kit === "padrao") {
        this.op4 ? (sum += this.getCost("op4")) : (sum += 0);
        this.op5 ? (sum += this.getCost("op5")) : (sum += 0);
        this.op6 ? (sum += this.getCost("op6")) : (sum += 0);
      } else {
        sum += this.getCost("op1");
        this.op2 ? (sum += this.getCost("op2")) : (sum += 0);
        this.op4 ? (sum += this.getCost("op4")) : (sum += 0);
        this.op5 ? (sum += this.getCost("op5")) : (sum += 0);
        this.op6 ? (sum += this.getCost("op6")) : (sum += 0);
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
    print() {
      const relatorio = this.$refs.print.$el;
      const cloned = relatorio.cloneNode(true);
      let section = document.getElementById("print");

      if (!section) {
        section = document.createElement("div");
        section.id = "print";
        document.body.appendChild(section);
      }

      section.innerHTML = "";
      section.appendChild(cloned);
      window.print();
    },
    tourStart() {
      this.showWelcomeModal = false;
      this.$intro()
        .setOptions({
          skipLabel: "Sair",
          tooltipPosition: "right",
          nextLabel: "Próximo",
          prevLabel: "Anterior",
          doneLabel: "Pronto"
        })
        .start();
    },
    toggleKitDetails() {
      if (this.xml === "tour.xml") {
        this.xml = this.kit + ".xml";
      } else {
        this.xml = "tour.xml";
      }
    },
    confirmOptions() {
      db.ref("empreendimentos/bosc/" + this.apto)
        .update(
          {
            lock: true,
            private: {
              kit: this.kit,
              op2: this.op2,
              op3: this.op3,
              op4: this.op4,
              op5: this.op5,
              op6: this.op6,
              valorTotal: this.custoTotal,
              numParcelas: this.opcaoParcelas,
              valorParcela: this.valorParcela(this.opcaoParcelas)
            }
          },
          () => {
            alert(
              'Dados registrados! Você pode imprimir a solicitação clicando em "VER SOLICITAÇÃO GERADA".'
            );
            this.showDocModal = false;
            this.getUserInfo();
          }
        )
        .catch(error => {
          console.error(error);
        });
    },
    valorParcela(numMaxParcelas) {
      return floor(this.custoTotal / numMaxParcelas, 2);
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
      db.ref("empreendimentos/bosc")
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
          this.updateUnidade(this.apto);
        })
        .catch(error => console.log(error));
    },
    updateUnidade(ap) {
      if (ap) {
        if (this.unidades[ap].private) {
          this.kit = this.unidades[ap].private.kit;
          this.op2 = this.unidades[ap].private.op2 || false;
          this.op3 = this.unidades[ap].private.op3 || false;
          this.op4 = this.unidades[ap].private.op4 || false;
          this.op5 = this.unidades[ap].private.op5 || false;
          this.op6 = this.unidades[ap].private.op6 || false;
          this.opcaoParcelas = this.unidades[ap].private.numParcelas;
        } else {
          this.kit = "padrao";
          this.op2 = false;
          this.op3 = false;
          this.op4 = false;
          this.op5 = false;
          this.op6 = false;
        }
        if (this.unidades[ap].lock) {
          this.lockdown = true;
        } else {
          this.lockdown = false;
          this.showWelcomeModal = true;
        }
      }
    }
  },
  watch: {
    userEmail: "getUserInfo",
    kit(val) {
      if (val === "padrao") {
        this.op2 = false;
        this.op3 = false;
      }
      if (this.xml !== "tour.xml") {
        this.xml = val + ".xml";
      }
    },
    apto(ap) {
      this.updateUnidade(ap);
    },
    custoTotal() {
      if (!this.lockdown) {
        this.opcaoParcelas = this.numMaxParcelas;
      }
    }
  },
  created() {
    window.vm = this;
    this.$store.dispatch("getINCC");
    this.getUserInfo();
  },
  mounted() {
    window.introJs = introJs;
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
.btn-solicitacao {
  height: 40px;
  flex: 1;
  margin: 10px 0 8px;

  cursor: pointer;
  text-align: center;
  background-color: #9ac088;
  color: white;
  border: 1px solid #9ac088;
  border-radius: 4px;
}
.btn-solicitacao:hover {
  background-color: #b5e29f;
}
.modal-button {
  flex: 0 1 100;
  background-color: #455258;
  height: 36px;
  margin: 8px 8px 8px 0;
  cursor: pointer;
  text-align: center;
  border: 1px solid #9ac088;
  border-radius: 4px;
  text-transform: uppercase;
  padding: 0 8px;
  font-family: Lato, sans-serif;
  color: white;
}
.modal-button.primary {
  color: white;
  background-color: #9ac088;
}
.modal-button:hover {
  color: #adadad;
}
.modal-button.primary:hover {
  color: white;
  background-color: #b5e29f;
}
.modal-button.primary:disabled {
  opacity: 0.6;
}

a.detalhes {
  flex: 1;
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;
  color: #9ac088;
}
a.detalhes:hover {
  color: #b5e29f;
}
a.link-manual {
  flex: 0;
  align-self: center;
  cursor: pointer;
  text-decoration: underline;
  color: #9ac088;
}
a.link-manual:hover {
  color: #b5e29f;
}

.locked {
  cursor: not-allowed;
  opacity: 0.5;
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
  margin: 4px 0 4px auto;
}

@media (max-width: 479px) {
  .home {
    margin: 0;
    border: none;
  }
}
@media screen {
  #print {
    display: none;
  }
}
@media print {
  body * {
    visibility: hidden;
  }
  #print,
  #print * {
    visibility: visible;
  }
  #print {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
