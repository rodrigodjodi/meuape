<template>
  <div ref="page">
    <img src="@/assets/bosc/bosc.png" alt="logo bosc" style="width:100px;">
    <img src="@/assets/piemonte-negativo.png" alt="logo piemonte" style="width:200px;float:right">
    <h1>SOLICITAÇÃO DE PERSONALIZAÇÃO UNIDADE {{this.parent.apto}}</h1>
    <h2>1. Acabamentos e revestimentos kit {{kit}}</h2>
    <img class="responsive" :src="require(`@/assets/bosc/${this.parent.kit}_revest.jpg`)" alt>
    <img class="responsive" :src="require(`@/assets/bosc/${this.parent.kit}_tlm.jpg`)" alt>
    <img class="responsive" :src="require(`@/assets/bosc/${this.parent.kit}_lavabo.jpg`)" alt>
    <h2>2. Pisos áreas secas</h2>
    <img
      v-if="this.parent.op2"
      class="responsive"
      :src="require(`@/assets/bosc/${this.parent.kit}_areas-secas.jpg`)"
      alt
    >
    <img v-else class="responsive" :src="require(`@/assets/bosc/padrao_areas-secas.jpg`)" alt>
    <h2>3. Revestimento da parede da cozinha</h2>
    <p v-if="this.parent.op3">Substituição do porcelanato por pintura branca.</p>
    <p v-else>Porcelanato NUVOLA MATE BOLD 35x65cm CEUSA Cod. 332719.</p>
    <h2>4. Instalação de kit aquecedor</h2>
    <img v-if="this.parent.op4" class="responsive" :src="caminhoImagemAquecedor" alt>
    <p v-else>Não incluído no pedido.</p>
    <h2>5. Central de aspiração</h2>
    <img v-if="this.parent.op5" class="responsive" src="@/assets/bosc/comum_aspiracao.jpg" alt>
    <p v-else>Não incluída no pedido.</p>
    <h2>6. Assento eletrônico (banheiro suíte)</h2>
    <img v-if="this.parent.op6" class="responsive" src="@/assets/bosc/comum_assento.jpg" alt>
    <p v-else>Não incluído no pedido.</p>
    <div style="page-break-inside: avoid;">
      <h1>RESUMO DO ORÇAMENTO</h1>
      <table>
        <tr>
          <th>Item</th>
          <th>Valor</th>
        </tr>
        <tr>
          <td>1. Kit {{kit}}</td>
          <td class="tab-right">{{this.parent.getCost("op1") | currency}}</td>
        </tr>
        <tr>
          <td>2. Pisos áreas secas</td>
          <td class="tab-right">{{this.parent.getCost("op2") | currency}}</td>
        </tr>
        <tr>
          <td>3. Revestimento da parede da cozinha</td>
          <td class="tab-right">{{0 | currency}}</td>
        </tr>
        <tr>
          <td>4. Instalação de kit aquecedor</td>
          <td class="tab-right">{{this.parent.getCost("op4") | currency}}</td>
        </tr>
        <tr>
          <td>5. Central de aspiração</td>
          <td class="tab-right">{{this.parent.getCost("op5") | currency}}</td>
        </tr>
        <tr>
          <td>6. Assento eletrônico (banheiro suíte)</td>
          <td class="tab-right">{{this.parent.getCost("op6") | currency}}</td>
        </tr>
        <tr>
          <th>TOTAL</th>
          <th class="tab-right">{{parent.custoTotal | currency}}</th>
        </tr>
        <tr>
          <th>Número de Parcelas</th>
          <th>{{parent.opcaoParcelas}}</th>
        </tr>
        <tr>
          <th>Valor das Parcelas</th>
          <th class="tab-right">{{parent.valorParcela(parent.opcaoParcelas) | currency}}</th>
        </tr>
      </table>
    </div>
    <p>{{dataExtenso}}</p>
    <p>_______________________________</p>
    <p>{{unidade.adm.nome}} {{unidade.adm.sobrenome}}</p>
    <p>CPF: {{unidade.adm.cpf}}</p>
    <p>Contrato: {{unidade.adm.contrato}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    caminhoImagemAquecedor(){
      let url
      if (this.parent.tipologia==='duplex') {
        url =  require("@/assets/bosc/comum_aquecedor-duplex.jpg")
      } else {
        url =  require("@/assets/bosc/comum_aquecedor.jpg")
      }
      return url;
    },
    dataExtenso() {
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
      let hoje = new Date();
      return `Curitiba, ${hoje.getDate()} de
      ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    },
    parent() {
      return this.$parent.$parent;
    },
    unidade() {
      return this.parent.unidades[this.parent.apto];
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
  mounted() {}
};
</script>

<style>
.responsive {
  max-width: 100%;
  display: block;
  page-break-inside: avoid;
}
h1 {
  text-align: center;
  font-size: 1.5em;
  margin: 0;
}
h2 {
  font-size: 1em;
  margin: 0 0 0.25em;
  font-weight: 700;
}
table {
  margin: 0 auto;
  page-break-inside: avoid;
}
.tab-right {
  text-align: right;
}
</style>
