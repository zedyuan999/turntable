<template>
  <section class="turntableSelect">
    <div class="dom" @click="toggleTurntable" ref="dom"></div>
    <TurntableSelect v-model="showturnTable" :dom="dom"></TurntableSelect>
  </section>
</template>

<script>
import { ref } from "vue";
import TurntableSelect from "@/components/TurntableSelect.vue";
export default {
  components: { TurntableSelect },
  setup() {
    const dom = ref(null);
    let showturnTable = ref(false);
    const toggleTurntable = () => {
      showturnTable.value = !showturnTable.value;
    };
    return {
      showturnTable,
      toggleTurntable,
      dom,
    };
  },
};
</script>

<style lang="less" scoped>
.turntableSelect {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .dom {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: steelblue;
    overflow: hidden;
  }
}
</style>