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
    <h3>Atualizar INCC</h3>
    <input type="number" step="0.001" :placeholder="incc" v-model.number="newINCC">
    <button @click="updateINCC">ATUALIZA VALOR</button>
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
    <h3>Quadro valores kits</h3>
      <table>
        <thead>
          <tr>
            <th>Tipologia</th>
            <th>Padrão</th>
            <th>Clássico</th>
            <th>Contemporâneo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2quartos</td>
            <td>{{custoOpcao('padrao')|currency}}</td>
            <td>{{custoOpcao('2quartos')|currency}}</td>
            <td>{{custoOpcao('2quartos')|currency}}</td>
          </tr>
          <tr>
            <td>3quartos</td>
            <td>{{custoOpcao('padrao')|currency}}</td>
            <td>{{custoOpcao('3quartos')|currency}}</td>
            <td>{{custoOpcao('3quartos')|currency}}</td>
          </tr>
          <tr>
            <td>Duplex</td>
            <td>{{custoOpcao('padrao')|currency}}</td>
            <td>{{custoOpcao('duplex')|currency}}</td>
            <td>{{custoOpcao('duplex')|currency}}</td>
          </tr>
        </tbody>
      </table>

    <h3>Quadro resumo unidades</h3>
    <table>
      <thead>
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
          <th>Central aspiração</th>
          <th>Assento sanitário</th>
          <th>Total orçamento</th>
          <th>Num. parcelas</th>
          <th>Valor Parcela</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(props, unidade) in unidades" :key="unidade">
          <lock :isLocked="props.lock ? true : false" @toggleLock="onToggleLock(unidade, !props.lock )" />
          <td>{{unidade}}</td>
          <td>{{props.tipologia}}</td>
          <editable-cell :content="props.adm ? props.adm.contrato : null" @update="updateCell('contrato', unidade, $event)"/>
          <editable-cell :content="props.adm ? props.adm.email : null" @update="updateCell('email', unidade, $event)"/>
          <editable-cell :content="props.adm ? props.adm.nome : null" @update="updateCell('nome', unidade, $event)"/>
          <editable-cell :content="props.adm ? props.adm.sobrenome : null" @update="updateCell('sobrenome', unidade, $event)"/>
          <editable-cell :content="props.adm ? props.adm.cpf : null" @update="updateCell('cpf', unidade, $event)"/>
          <td>{{props.private ? props.private.kit : null}}</td>
          <td>{{props.private ? props.private.op2 : null}}</td>
          <td>{{props.private ? props.private.op3 : null}}</td>
          <td>{{props.private ? props.private.op4 : null}}</td>
          <td>{{props.private ? props.private.op5 : null}}</td>
          <td>{{props.private ? props.private.op6 : null}}</td>
          <td style="text-align: right;">{{props.private ? $options.filters.currency(props.private.valorTotal) : null}}</td>
          <td style="text-align: center;">{{props.private ? props.private.numParcelas : null}}</td>
          <td style="text-align: right;">{{(props.private ? $options.filters.currency(props.private.valorParcela)  : null)}}</td>
        </tr>
      </tbody>
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
import Lock from "@/components/Lock";
import EditableCell from "@/components/EditableCell";
import floor from "lodash.floor";
export default {
  components: { Lock, EditableCell },
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
      cpfCliente: null,
      newINCC: null,
      custosBosc: {
        "2quartos": {
          op1: 12.917,
          op2: 18.197,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        },
        "3quartos": {
          op1: 13.293,
          op2: 24.592,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        },
        duplex: {
          op1: 15.04,
          op2: 33.641,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        },
        padrao: {
          op1: 0,
          op2: 0,
          op3: 0,
          op4: 6.921,
          op5: 9.984,
          op6: 10.341
        }
      }
    };
  },
  computed: {
    incc() {
      return this.$store.state.incc;
    }
  },
  methods: {
    custoOpcao(opcao) {
      let sum = 0;
      sum += floor(this.custosBosc[opcao]["op1"] * this.incc, 2);
      sum += floor(this.custosBosc[opcao]["op2"] * this.incc, 2);
      sum += floor(this.custosBosc[opcao]["op3"] * this.incc, 2);
      sum += floor(this.custosBosc[opcao]["op4"] * this.incc, 2);
      sum += floor(this.custosBosc[opcao]["op5"] * this.incc, 2);
      sum += floor(this.custosBosc[opcao]["op6"] * this.incc, 2);
      return floor(sum, 2);
    },
    updateINCC() {
      db
        .ref()
        .update({ incc: this.newINCC })
        .then(() => {
          this.newINCC = null;
          this.$store.dispatch("getINCC");
        });
    },
    updateCell(cellname, unidade, event) {
      if (!event) return;
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento
        .child(unidade)
        .child("adm")
        .update({ [cellname]: event });
    },
    onToggleLock(unidade, newState) {
      const empreendimento = db.ref("empreendimentos/" + this.empreendimento);
      empreendimento.child(unidade).update({ lock: newState });
    },
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
  filters: {
    currency(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
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
table,
th,
td {
  border: 1px solid gray;
  border-collapse: collapse;
  padding: 0 4px;
}
</style>
