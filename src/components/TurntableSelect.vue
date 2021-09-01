<template>
  <section
    class="turntable-select-wrap"
    v-show="modelValue"
    @click.stop="closeSelector"
    @touchmove="touchMove"
    @touchend="touchEnd"
  >
    <div
      class="turntable-select"
      :style="{ ...selectClass, transform: `rotate(${data.baseangle}deg)` }"
      @touchstart.stop="touchStart"
    >
      <div ref="currentSelectWrap" class="current-select-wrap"></div>
    </div>
  </section>
</template>

<script>
import { reactive, ref, defineComponent, computed } from "vue";
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
    },
    dom: {
      type: Object,
    },
    config: {
      type: Object,
      default: {},
    },
  },
  watch: {
    modelValue(val) {
      if (!val) return;
      const { x, y, width: w, height: h } = this.dom.getBoundingClientRect();
      this.data.ox = x + w / 2;
      this.data.oy = y + h / 2;
      this.data.ow = w;
      this.data.oh = h;
      const cloneDom = this.dom.cloneNode(true);
      var childs = this.currentSelectWrap.childNodes;
      for (var i = childs.length - 1; i >= 0; i--) {
        this.currentSelectWrap.removeChild(childs[i]);
      }
      this.currentSelectWrap.appendChild(cloneDom);
    },
  },
  setup(props, { emit }) {
    const baseConfig = {
      baseangle: 0,
      diameter: 200, //直径
      turntableAngle: 0, //基础角度
      itemAngle: 45, //item的角度
      touched: false,
    };
    const { sqrt, acos, PI } = Math;
    const tableConfig = Object.assign(baseConfig, props.config);
    const currentSelectWrap = ref(null);
    const data = reactive({
      ox: 0, // 圆心x
      oy: 0, // 圆心y
      ow: 0,
      oh: 0,
    });
    // 关闭选择器
    const closeSelector = () => {
      emit("update:modelValue", false);
    };
    const selectClass = computed(() => {
      let { ox, oy, ow, oh } = data;
      return {
        width: `${tableConfig.diameter}px`,
        height: `${tableConfig.diameter}px`,
        top: `${oy - tableConfig.diameter / 2}px`,
        left: `${ox - tableConfig.diameter / 2}px`,
      };
    });
    const touchStart = (e) => {
      const touch = e.touches[0];
      data.touched = true;
      const hypotenuse = sqrt(
        (touch.pageX - data.ox) ** 2 + (touch.pageY - data.oy) ** 2
      ); //斜边
      const angle = acos((touch.pageX - data.ox) / hypotenuse) / (PI / 180);
      data.baseangle =
        (touch.pageY - data.oy < 0 ? angle : 360 - angle) +
        data.tableRotateangle;
    };
    const touchMove = (e) => {
      if (!data.touched) return;
      const touch = e.touches[0];
      const hypotenuse = sqrt(
        (touch.pageX - data.ox) ** 2 + (touch.pageY - data.oy) ** 2
      );
      const angle = (acos((touch.pageX - data.ox) / hypotenuse) * 180) / PI;
      // console.log(angle);

      const moveangle = touch.pageY - data.oy < 0 ? angle : 360 - angle;
      console.log(moveangle);
    };
    const touchEnd = () => {
      data.touched = false;
    };
    return {
      closeSelector,
      data,
      currentSelectWrap,
      tableConfig,
      selectClass,
      touchStart,
      touchMove,
      touchEnd,
    };
  },
});
</script>

<style lang="less" scoped>
.turntable-select-wrap {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  // background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  overflow: hidden;
  .turntable-select {
    border-radius: 50%;
    overflow: hidden;
    // background-color: rgba(0, 0, 0, 0.2);

    background-image: conic-gradient(pink, yellow);
    position: absolute;
  }
  .current-select-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>