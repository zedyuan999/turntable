<template>
  <Turntable
    :list="[
      { content: 1 },
      { content: 2 },
      { content: 3 },
      { content: 4 },
      { content: 5 },
      { content: 6 },
      { content: 7 },
      { content: 8 },
      { content: 9 },
    ]"
  ></Turntable>
</template>

<script>
import { reactive } from "@vue/reactivity";
import Turntable from "./components/Turntable.vue";

export default {
  name: "App",
  components: {
    Turntable,
  },
};
</script>
