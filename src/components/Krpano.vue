<template>
  <div class="krpano">

  </div>
</template>
<script>
import VueScript2 from "vue-script2";
export default {
  created() {},
  mounted() {
    VueScript2.load("tour.js").then(() => {
      this.createPano();
    });
  },
  methods: {
    createPano() {
      const { embedpano, removepano } = window;

      if (!(embedpano && removepano)) {
        throw new Error("krpano player is required");
      }
      console.log("pano created");
    }
  }
};
</script>
