<template>
  <td @click="$emit('toggleLock')"><font-awesome-icon :icon="icon" :class="{locked:isLocked}" /></td>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import faLock from "@fortawesome/fontawesome-free-solid/faLock";
import faLockOpen from "@fortawesome/fontawesome-free-solid/faLockOpen";
export default {
  components: { FontAwesomeIcon },
  props: {
    isLocked: {
      required: true,
      type: [Boolean]
    }
  },
  computed: {
    icon() {
      return this.isLocked ? faLock : faLockOpen;
    }
  }
};
</script>

<style>
td svg {
  cursor: pointer;
  color: grey;
}
td svg.locked {
  color: teal;
}
</style>
