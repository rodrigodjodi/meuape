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
        <div class="tab" :class="[kit === 'padrao' ? 'active' : '']" @click="setKit('padrao')">Padrão</div>
        <div class="tab" :class="[kit === 'classico' ? 'active' : '']" @click="setKit('classico')">Clássico</div>
        <div class="tab" :class="[kit === 'contemporaneo' ? 'active' : '']" @click="setKit('contemporaneo')">Contemporâneo</div>
      </div>
      <div class="opcoes-text">
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button  
            :labels="{checked: 'Sim (kit)', unchecked: 'Não'}"
            :width="90"
            v-if="kit !== 'padrao'" :value="true" :disabled="true"
          />
         Acabamentos kit {{getCost('op1')}}<br/><br/>
        </div>
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button
            :value="op2"
            :sync="true"
            @change = "setOption2"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          /> Piso áreas secas <br/><br/>
        </div>
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button
            :value="op3"
            :sync="true"
            @change = "setOption3"
            :width="90"
            :labels="{checked: 'Pintura', unchecked: 'Porcelanato'}"
            :color="{checked: '#75C791', unchecked: '#75C791'}"
          /> Parede da Cozinha<br/><br/>
        </div>
        <div class="opItem">
          <toggle-button
            :value="op4"
            :sync="true"
            @change = "setOption4"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          /> Kit aquecedor
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Krpano from "@/components/Krpano";
import { mapState, mapGetters } from "vuex";
export default {
  name: "home",
  components: { Krpano },
  data() {
    return {
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
    ...mapState(["tipologia", "kit", "op1", "op2", "op3", "op4"]),
    ...mapGetters(["scene"])
  },
  methods: {
    setKit(kit) {
      this.$store.commit("TOGGLE_KIT", kit);
    },
    setOption2() {
      this.$store.commit("TOGGLE_OPTION", "op2");
    },
    setOption3() {
      this.$store.commit("TOGGLE_OPTION", "op3");
    },
    setOption4() {
      this.$store.commit("TOGGLE_OPTION", "op4");
    },
    getCost(op) {
      var cost = this[op] ? this.custos[this.tipologia][this.kit][op] : 0;
      return cost.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    },
    init() {
      console.log("initialized");
    }
  },
  created() {
    this.$store.dispatch("getINCC");
  },
  mounted() {
    window.vm = this;
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
