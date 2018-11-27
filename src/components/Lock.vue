<template>
  <td @click="$emit('toggleLock')">
    <font-awesome-icon :icon="icon" :class="{locked:isLocked}"/>
  </td>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add([faLock, faLockOpen]);
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
