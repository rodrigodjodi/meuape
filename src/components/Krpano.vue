<template>
  <div class="krpano" id="viewer">

  </div>
</template>
<script>
import VueScript2 from "vue-script2";
export default {
  data() {
    return {
      flags: "MERGE"
    };
  },
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
                  loadscene(get(scene[0].name),null,${this.flags},BLEND(0.5)),
                  loadscene(${scene},null,${this.flags},BLEND(0.5)))`;
          this.krpanoInstance.call(str);
          this.$emit("sceneChanged", scene);
        } else {
          this.krpanoInstance.call(
            `loadscene(get(scene[0].name),null,${this.flags},BLEND(0.5))`
          );
        }
      }
    }
  },
  watch: {
    scene: function(newScene, oldScene) {
      console.log(oldScene, newScene);
      if (oldScene.split("-")[0] === newScene.split("-")[0]) {
        console.log("cenas iguais");
        this.flags = "MERGE|KEEPVIEW";
      } else {
        this.flags = "MERGE";
      }
      this.loadScene();
    },
    xml: function(xml) {
      if (this.krpanoInstance && xml) {
        if (xml === "tour.xml") {
          console.log("voltar para os paoramas");
          this.krpanoInstance.call(
            `loadpanoscene(${xml},${this.scene},null,IGNOREKEEP)`
          );
        } else {
          this.krpanoInstance.call(`loadpano(${xml},null,IGNOREKEEP)`);
        }
        this.$emit("xmlChanged", xml);
        console.log("xml changed: " + xml);
      }
    }
  }
};
</script>
