<template>
  <div class="krpano" id="viewer">

  </div>
</template>
<script>
import VueScript2 from "vue-script2";
export default {
  props: {
    xml: {
      type: String,
      required: true
    },
    scene: {
      type: String,
      required: true
    }
  },
  created() {},
  mounted() {
    VueScript2.load("tour.js").then(() => {
      this.createPano();
    });
  },
  methods: {
    test() {
      console.log("test");
    },
    createPano() {
      const { embedpano, removepano } = window;

      if (!(embedpano && removepano)) {
        throw new Error("Error loading krpano");
      }
      embedpano({
        xml: this.xml,
        target: "viewer",
        onready: this.krpanoReady,
        onerror: this.krpanoError
      });
    },
    krpanoReady(krpanoInstance) {
      console.log("embedpano fulfilled");
      this.krpanoInstance = krpanoInstance;
      this.loadScene();
    },
    krpanoError(error) {
      throw new Error("Error on embedpano:" + error);
    },
    removePano() {
      const { removepano } = window;

      if (this.krpanoInstance) {
        removepano(this.krpanoInstance);
        delete this.krpanoInstance;
      }
    },
    loadScene() {
      let scene = this.scene;
      if (this.krpanoInstance) {
        if (scene) {
          let str = `trace(${scene});
                  if(scene[${scene}]===null,
                  loadscene(get(scene[0].name),null,MERGE|KEEPVIEW,BLEND(0.5)),
                  loadscene(${scene},null,MERGE|KEEPVIEW,BLEND(0.5)))`;
          this.krpanoInstance.call(str);
          this.$emit("sceneChanged", scene);
        } else {
          this.krpanoInstance.call(
            "loadscene(get(scene[0].name),null,MERGE|KEEPVIEW,BLEND(0.5))"
          );
        }
      }
    }
  },
  watch: {
    scene: function() {
      this.loadScene();
    }
  }
};
</script>
