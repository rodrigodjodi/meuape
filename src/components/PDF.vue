<template>
  <object class="preview-pane" type="application/pdf"
    width="100%" height="100%" frameborder="0" style="position:relative;z-index:999"
    :data="pdf">
  </object>
</template>

<script>
import jsPDF from "jspdf";
import * as Img from "@/assets/images";
import * as revest from "@/assets/revest";
import * as tlm from "@/assets/tlm";
import * as lavabo from "@/assets/lavabo";
import * as areasSecas from "@/assets/areasSecas";
export default {
  data() {
    return {
      pdf: ""
    };
  },
  computed: {
    parent() {
      return this.$parent.$parent;
    },
    kit() {
      let kitName = "";
      switch (this.parent.kit) {
        case "padrao":
          kitName = "Padrão";
          break;
        case "classico":
          kitName = "Clássico";
          break;
        case "contemporaneo":
          kitName = "Contemporâneo";
          break;
        default:
          break;
      }
      return kitName;
    }
  },
  created() {
    let offset = 0;
    let imgAreasSecas = Img.contrapiso;
    let txtRevestCozinha =
      "Porcelanato BRANCO ACETINADO 33x66cm CEUSA Cod. 38473";
    var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4"
    });
    window.doc = doc;
    doc.setProperties({
      title: "PERSONALIZAÇÃO",
      subject: "Acordo entre Piemonte e Proprietário",
      author: "Piemonte"
    });
    doc.addImage(Img.logopiemonte, "PNG", 138, 5, 55, 13.5);
    doc.setFont("helvetica", "bold");
    doc.text("SOLICITAÇÃO DE PERSONALIZAÇÃO APTO. " + this.parent.apto, 35, 28);
    doc.setFontSize(12);
    doc.text("1. Acabamentos e revestimento kit " + this.kit, 10, 35);
    doc.addImage(revest[this.parent.kit], "JPG", 10, 40, 190, 120);
    doc.addImage(tlm[this.parent.kit], "JPG", 10, 160, 190, 125);
    doc.addPage();
    doc.addImage(Img.logopiemonte, "PNG", 138, 5, 55, 13.5);
    if (this.parent.tipologia === "duplex") {
      offset = 55;
      doc.addImage(lavabo[this.parent.kit], "JPG", 10, 28, 190, 55);
    }
    doc.text("2. Pisos áreas secas", 10, 24 + offset);
    if (this.parent.op2) {
      imgAreasSecas = areasSecas[this.parent.kit];
    }
    doc.addImage(imgAreasSecas, "JPG", 10, 25 + offset, 190, 40);
    doc.text("3. Revestimento da parede da cozinha", 10, 73 + offset);
    if (this.parent.op3) {
      txtRevestCozinha = "Substituição do porcelanato por pintura branca.";
    }
    doc.setFontStyle("");
    doc.text(txtRevestCozinha, 10, 80 + offset);
    doc.setFontStyle("bold");
    doc.text("4. Instalação de kit aquecedor", 10, 93 + offset);
    if (this.parent.op4) {
      doc.addImage(Img.aquecedor, "JPG", 10, 95 + offset, 190, 70);
    } else {
      doc.setFontStyle("");
      doc.text("Não incluído no pedido. ", 10, 100 + offset);
    }

    this.pdf = doc.output("datauristring");
  }
};
</script>

<style>

</style>
