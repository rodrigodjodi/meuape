<template>
<div>
  <label for="select-emp">Empreendimento:</label>
  <select id="select-emp" v-model="empreendimento">
      <option value="">Selecione...</option>
      <option value="bosc">BOSC Eco Residence</option>
  </select>
  <hr>
  <div v-if="unidades!==null">
    <h3>Cadastro contrato</h3>
    <select id="select-unidade" v-model="unidade">
      <option value="">Selecione...</option>
      <option v-for="(props, unidade) in unidades" :key="unidade">
        {{unidade}}
      </option>
    </select>
    <input v-model="contrato" type="text" name="input-contrato" placeholder="Nº contrato..." :disabled="unidade===''">
    <input v-model="email" type="email" name="input-email" placeholder="Email cliente..." :disabled="unidade===''">
    <button @click="cadastraContrato" :disabled="unidade===''">CADASTRAR CONTRATO</button>

  <hr>
    <h3>Quadro resumo</h3>
    <table>
      <tr>
        <th>Unidade</th>
        <th>Tipologia</th>
        <th>Contrato</th>
        <th>E-mail</th>
        <th>Kit</th>
        <th>Piso áreas secas</th>
        <th>Paredes cozinha</th>
        <th>Kit aquecedor</th>
      </tr>
      <tr v-for="(props, unidade) in unidades" :key="unidade">
        <td>{{unidade}}</td>
        <td>{{props.tipologia}}</td>
        <td>{{props.contrato}}</td>
        <td>{{props.email}}</td>
        <td>{{props.kit}}</td>
        <td>{{props.op2}}</td>
        <td>{{props.op3}}</td>
        <td>{{props.op4}}</td>
      </tr>
    </table>

  <hr>

    <h3>Reset unidade</h3>  
    <label for="">Número ap</label>
    <input type="text" v-model="unidade">
    <select v-model="tipologia">
      <option v-for="tipologia in tipologias"
        :key="tipologia" :value="tipologia">
        {{tipologia}}
      </option>
    </select>
    <button @click="novoApartamento">Cadastrar</button>
  </div>
</div>
</template>

<script>
import { db } from "../firebase";

export default {
  data() {
    return {
      unidade: "",
      tipologia: "",
      tipologias: ["2quartos", "3quartos", "duplex"],
      acabamentos: ["padrao", "classico", "contemporaneo"],
      empreendimento: "",
      unidades: null,
      contrato: null,
      email: null
    };
  },
  methods: {
    cadastraContrato() {
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento
        .child(this.unidade)
        .update({ contrato: this.contrato, email: this.email })
        .then(result => console.log(result))
        .catch(error => console.log(error));
      this.unidade = "";
      this.contrato = null;
      this.email = null;
    },
    novoApartamento() {
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento
        .child(this.unidade)
        .set({ tipologia: this.tipologia })
        .then(function() {
          return empreendimento.once("value");
        })
        .then(function(snapshot) {
          var data = snapshot.val();
          console.log(data);
        });
    }
  },
  watch: {
    empreendimento() {
      if (!this.empreendimento) return;
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento.on("value", snapshot => {
        this.unidades = snapshot.val();
      });
    }
  }
};
</script>
