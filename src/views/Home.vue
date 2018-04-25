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
          /> Piso áreas secas {{getCost('op2')}}<br/><br/>
        </div>
        <div class="opItem"  v-if="kit !== 'padrao'">
          <toggle-button
            :value="op3"
            :sync="true"
            @change = "setOption3"
            :width="90"
            :labels="{checked: 'Pintura', unchecked: 'Porcelanato'}"
            :color="{checked: '#75C791', unchecked: '#75C791'}"
          /> Parede da Cozinha {{getCost('op3')}}<br/><br/>
        </div>
        <div class="opItem">
          <toggle-button
            :value="op4"
            :sync="true"
            @change = "setOption4"
            :width="90"
            :labels="{checked: 'Sim', unchecked: 'Não'}"
          /> Kit aquecedor{{getCost('op4')}}
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
  computed: {
    ...mapState([
      "tipologia",
      "kit",
      "op1",
      "op2",
      "op3",
      "op4",
      "incc",
      "visitante"
    ]),
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
      if (this.visitante) return 0;
      var cost = this[op] ? this.custos[this.tipologia][op] * this.incc : 0;
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
    this.$store.dispatch("getUnidades");
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
