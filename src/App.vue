<template>
  <Turntable :list="[1, 2, 3, 4, 5, 6, 7, 8]"></Turntable>
</template>

<script>
import Turntable from "./components/Turntable.vue";

export default {
  name: "App",
  components: {
    Turntable,
  },
};
</script>
