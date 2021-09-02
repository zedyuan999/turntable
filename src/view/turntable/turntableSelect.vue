<template>
  <section class="turntableSelect">
    <div class="dom" @click="toggleTurntable" ref="dom">
      <img :src="children[active].img" alt="" />
    </div>
    <TurntableSelect
      v-model="showturnTable"
      v-model:active="active"
      :dom="dom"
      :children="children"
      :config="{ activeAngle: 0 }"
    ></TurntableSelect>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TurntableSelect from '@/components/TurntableSelect.vue'
import img1 from '@/assets/images/1.jpg'
import img2 from '@/assets/images/2.jpg'
export default defineComponent({
  components: { TurntableSelect },
  watch: {
    active(val) {
      console.log(val)
    },
  },
  setup() {
    const dom = ref<HTMLDivElement | null>(null)
    const active = ref(1)
    let showturnTable = ref(false)
    const toggleTurntable = () => {
      showturnTable.value = !showturnTable.value
    }
    const children = ref<any[]>([
      { content: 'Time Flies', img: img1 },
      { content: 'H³M', img: img2 },
      { content: 'Time Flies', img: img1 },
    ])
    return {
      showturnTable,
      toggleTurntable,
      dom,
      children,
      active,
    }
  },
})
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
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>