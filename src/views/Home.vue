<template>
  <div class="home">
    <button @click="scene = 'padrao'">Padrão</button>
    <button @click="scene = 'classico'">Clássico</button>
    <button @click="scene = 'contemporaneo'">Contemporâneo</button>
    <krpano :xml="'tour.xml'"
      :lazy-load="true"
      style="width:100vmin;height:70vmin"
      @panoCreated="init"
      :scene="scene"
    />

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
      scene: 3
    };
  },
  methods: {
    init() {
      console.log("initialized");
    }
  }
};
</script>
