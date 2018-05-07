<template>
<div class="admin">
  <div class="text_center">
    <label for="select-emp">Empreendimento:</label>
    <select id="select-emp" v-model="empreendimento">
        <option value="">Selecione...</option>
        <option value="bosc">BOSC Eco Residence</option>
    </select>
  </div>
  <div>
    <h3>Atualizar INCC (toDO)</h3>
    <input type="text" :placeholder="incc">
    <button>Ainda não faz nada</button>
  </div>
  <hr>

  <div v-if="unidades!==null">
    <h3>Cadastro contrato</h3>
    <form @submit="cadastraContrato">
      <select id="select-unidade" v-model="unidade">
        <option value="">Selecione...</option>
        <option v-for="(props, unidade) in unidades" :key="unidade">
          {{unidade}}
        </option>
      </select><br>
      <input v-model="contrato" type="text" name="input-contrato" placeholder="Nº contrato..." :disabled="unidade===''" required><br>
      <input v-model="email" type="email" name="input-email" placeholder="Email cliente..." :disabled="unidade===''" required><br>
      <input v-model="nomeCliente" type="text" name="input-nome" placeholder="Nome..." :disabled="unidade===''" required><br>
      <input v-model="sobrenomeCliente" type="text" name="input-sobrenome" placeholder="Sobrenome..." :disabled="unidade===''" required>
      <input v-model="cpfCliente" type="text" name="input-cpf" placeholder="CPF..." :disabled="unidade===''" required>
      <br>
      <button :disabled="unidade===''">CADASTRAR CONTRATO</button>
    </form>
  <hr>
    <h3>Quadro resumo</h3>
    <table>
      <tr>
        <th>BL</th>
        <th>Unidade</th>
        <th>Tipologia</th>
        <th>Contrato</th>
        <th>E-mail</th>
        <th>Nome</th>
        <th>Sobrenome</th>
        <th>CPF</th>
        <th>Kit</th>
        <th>Piso áreas secas</th>
        <th>Paredes cozinha</th>
        <th>Kit aquecedor</th>
        <th>Total orçamento</th>
        <th>Num. parcelas</th>
        <th>Valor Parcela</th>
      </tr>
      <tr v-for="(props, unidade) in unidades" :key="unidade">
        <td>{{props.lock}}</td>
        <td>{{unidade}}</td>
        <td>{{props.tipologia}}</td>
        <td>{{props.adm ? props.adm.contrato : null}}</td>
        <td>{{props.adm ? props.adm.email : null}}</td>
        <td>{{props.adm ? props.adm.nome : null}}</td>
        <td>{{props.adm ? props.adm.sobrenome : null}}</td>
        <td>{{props.adm ? props.adm.cpfCliente : null}}</td>
        <td>{{props.private ? props.private.kit : null}}</td>
        <td>{{props.private ? props.private.op2 : null}}</td>
        <td>{{props.private ? props.private.op3 : null}}</td>
        <td>{{props.private ? props.private.op4 : null}}</td>
        <td>{{props.private ? props.private.valorTotal : null}}</td>
        <td>{{props.private ? props.private.numParcelas : null}}</td>
        <td>{{props.private ? props.private.valorParcela : null}}</td>
      </tr>
    </table>

  <hr>

    <h3>Cadastro / Reset unidade</h3>  
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
      nomeCliente: null,
      sobrenomeCliente: null,
      unidade: "",
      tipologia: "",
      tipologias: ["2quartos", "3quartos", "duplex"],
      acabamentos: ["padrao", "classico", "contemporaneo"],
      empreendimento: "",
      unidades: null,
      contrato: null,
      email: null,
      cpfCliente: null
    };
  },
  computed: {
    incc() {
      return this.$store.state.incc;
    }
  },
  methods: {
    cadastraContrato(e) {
      e.preventDefault();
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento
        .child(this.unidade)
        .child("adm")
        .update({
          contrato: this.contrato,
          email: this.email,
          nome: this.nomeCliente,
          sobrenome: this.sobrenomeCliente,
          cpf: this.cpfCliente
        })
        .then(() => {
          this.unidade = "";
          this.contrato = null;
          this.email = null;
          this.nomeCliente = null;
          this.sobrenomeCliente = null;
          this.cpfCliente = null;
          console.log("Dados inseridos, confirmar na IU");
        })
        .catch(error => console.log("error" + error));
    },
    novoApartamento() {
      if (
        !confirm(
          "Isso apagará todos os dados da unidade caso ela já exista! Confirma?"
        )
      )
        return;
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
      if (!this.empreendimento) {
        this.unidades = null;
        return;
      }
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento.on("value", snapshot => {
        this.unidades = snapshot.val();
      });
    }
  },
  created() {
    this.$store.dispatch("getINCC");
  }
};
</script>

<style>
label {
  margin-bottom: 0.5em;
  font-size: 1rem;
  display: block;
  font-weight: 600;
}
.admin {
  background-color: #f5f5f5;
  padding: 20px;
}
.text_center {
  text-align: center;
}
</style>
