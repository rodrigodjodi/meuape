<template>
  <object :data="pdf" type="application/pdf" width="100%" height="95%">
    <pdf-fallback v-if="!supportsPdfMimeType" @loaded="fallbackLoaded" 
    v-for="i in numPages" :key="i" :src="src" :page="i"
    style="display: block;width:100%;"></pdf-fallback>
  </object>
</template>

<script>
import jsPDF from "jspdf";
import pdfFallback from "vue-pdf";
//const pdfFallback = () => import("vue-pdf");
import * as Img from "@/assets/images";
import * as revest from "@/assets/revest";
import * as tlm from "@/assets/tlm";
import * as lavabo from "@/assets/lavabo";
import * as areasSecas from "@/assets/areasSecas";

export default {
  components: {
    pdfFallback
  },
  data() {
    return {
      supportsPdfMimeType:
        typeof navigator.mimeTypes["application/pdf"] !== "undefined",
      pdf: "",
      numPages: undefined
    };
  },
  computed: {
    src() {
      return pdfFallback.createLoadingTask(this.pdf);
    },
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
  methods: {
    fallbackLoaded() {
      console.log("fallback pdf loaded");
    },
    makePDF() {
      let meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];
      let offset = 0;
      let imgAreasSecas = Img.contrapiso;
      let txtRevestCozinha =
        "Porcelanato BRANCO ACETINADO 33x66cm CEUSA Cod. 38473.";
      let hoje = new Date();
      let dataExtenso = `Curitiba, ${hoje.getDate()} de ${
        meses[hoje.getMonth()]
      } de ${hoje.getFullYear()}`;
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
      doc.addImage(Img.bosclogo, "PNG", 20, 0, 35, 20.6);
      doc.setFont("helvetica", "bold");
      doc.text(
        "SOLICITAÇÃO DE PERSONALIZAÇÃO UNIDADE " + this.parent.apto,
        30,
        28
      );
      doc.setFontSize(12);
      doc.text("1. Acabamentos e revestimento kit " + this.kit, 10, 35);
      doc.addImage(revest[this.parent.kit], "JPG", 10, 40, 190, 120);
      doc.addImage(tlm[this.parent.kit], "JPG", 10, 160, 190, 125);
      doc.addPage();

      if (this.parent.tipologia === "duplex") {
        offset = 65;
        doc.addImage(lavabo[this.parent.kit], "JPG", 10, 20, 190, 55);
      }
      doc.text("2. Pisos áreas secas", 10, 16 + offset);
      if (this.parent.op2) {
        imgAreasSecas = areasSecas[this.parent.kit];
      }
      doc.addImage(imgAreasSecas, "JPG", 10, 17 + offset, 190, 40);
      doc.text("3. Revestimento da parede da cozinha", 10, 65 + offset);
      if (this.parent.op3) {
        txtRevestCozinha = "Substituição do porcelanato por pintura branca.";
      }
      doc.setFontStyle("normal");
      doc.text(txtRevestCozinha, 10, 70 + offset);
      doc.setFontStyle("bold");
      if (this.parent.op4) {
        doc.addImage(Img.aquecedor, "JPG", 10, 78 + offset, 190, 70);
      } else {
        doc.setFontStyle("");
        doc.text("Não incluído no pedido. ", 10, 87 + offset);
      }
      doc.text("4. Instalação de kit aquecedor", 10, 80 + offset);
      /* Início assinatura, não depende mais de offset */
      doc.text("RESUMO DO ORÇAMENTO:", 77.5, 215);
      doc.text("1-Kit Acabamento", 11, 220);
      doc.text("2-Piso áreas secas", 52, 220);
      doc.text("3-Parede Cozinha", 96, 220);
      doc.text("4-Kit aquecedor", 135, 220);
      doc.text("Total", 170, 220);
      doc.text(
        this.parent.getCost("op1").toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        11,
        225
      );
      doc.text(
        this.parent.getCost("op2").toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        52,
        225
      );
      doc.text(
        this.parent.getCost("op3").toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        96,
        225
      );
      doc.text(
        this.parent.getCost("op4").toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        135,
        225
      );
      doc.text(
        this.parent.custoTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        }),
        170,
        225
      );
      doc.text(
        "CONDIÇÕES DE PAGAMENTO: " +
          this.parent.opcaoParcelas +
          " x de " +
          this.parent
            .valorParcela(this.parent.opcaoParcelas)
            .toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            }),
        11,
        231
      );
      doc.setFontStyle("normal");
      doc.text(dataExtenso, 10, 240);
      let apto = this.parent.unidades[this.parent.apto];
      doc.text("_____________________________________________", 10, 255);

      doc.text(`${apto.adm.nome} ${apto.adm.sobrenome}`, 10, 260);

      let cpf = apto.adm.cpf ? apto.adm.cpf : "";
      let contrato = apto.adm.contrato ? apto.adm.contrato : "";
      doc.text(`CPF: ${cpf}`, 10, 265);
      doc.text(`Contrato: ${contrato}`, 80, 265);

      doc.setFontSize(9);
      doc.text("Campo para preenchimento do Setor de Personalização", 10, 270);
      doc.roundedRect(5, 271, 200, 10, 0, 0, "S");
      doc.text(
        "Recebido por:________________________________________________   Data: ___/___/_____   Assinatura:_____________________",
        12,
        278
      );
      /*doc.setDrawColor(120, 120, 120);
    doc.roundedRect(5, 5, 200, 275, 0, 0, "S");*/
      doc.addImage(Img.logopiemonte, "PNG", 138, 7, 55, 13.5);
      this.pdf = doc.output("datauristring");
    },
    makeDemoPDF() {
      var doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
      });
      doc.text(20, 20, "Hello world!");
      this.pdf = doc.output("datauristring");
    }
  },
  created() {
    this.makePDF();
  },
  mounted() {
    if (!this.supportsPdfMimeType) {
      this.src.then(pdf => {
        this.numPages = pdf.numPages;
      });
    }
  }
};
</script>
