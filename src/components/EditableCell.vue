<template>
    <td ref="editable" contenteditable="true"
      @blur="cancel" @keyup.esc="cancel"
      @keypress.enter.prevent="update"
      :class="{confirm: confirmEdit}"
    >
      {{content}}
    </td>
</template>

<script>
export default {
  props: ["content"],
  data() {
    return {
      caretPos: 0,
      confirmEdit: false
    };
  },
  updated() {
    let sel = window.getSelection();
    sel.collapse(sel.anchorNode, this.caretPos);
    this.$refs.editable.blur();
  },
  methods: {
    update(event) {
      let sel = window.getSelection();
      this.caretPos = sel.anchorOffset;
      this.$emit("update", event.target.innerText);
      this.confirmEdit = true;
      setTimeout(() => {
        this.confirmEdit = false;
      }, 1000);
    },
    cancel() {
      this.$refs.editable.innerHTML = this.content;
    }
  }
};
</script>

<style>
[contenteditable="true"].confirm {
  background-color: forestgreen;
}
[contenteditable="true"] {
  transition: all 750ms ease;
}
[contenteditable="true"]:hover {
  cursor: cell;
}
[contenteditable="true"]:active,
[contenteditable="true"]:focus {
  cursor: text;
}
</style>
