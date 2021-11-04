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
      :style="{
        ...turntableClass,
        transform: `rotate(${data.tableRotateAngle}deg)`,
      }"
      @touchstart.stop="touchStart"
      @click.stop
    >
      <div class="children">
        <div
          class="child"
          v-for="(item, index) in children"
          :key="index"
          :style="{
            transformOrigin: `center ${tableConfig.diameter / 2}px`,
            transform: `translateX(-50%) rotate(${
              tableConfig.itemAngle * index +
              tableConfig.activeAngle -
              active * tableConfig.itemAngle
            }deg)`,
          }"
        >
          <img :src="item.img" alt="" />
          <p>{{ item.content }}</p>
        </div>
      </div>
      <div
        ref="currentSelectWrap"
        class="current-select-wrap"
        :style="{
          transform: `translate(-50%,-50%) rotate(${-data.tableRotateAngle}deg)`,
        }"
      ></div>
    </div>
  </section>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, computed, PropType } from "vue";
interface Config {
  diameter: number; //直径
  itemAngle: number; //item的角度
  activeAngle: number; //选中的角度
}
interface DataType {
  ox: number; // 圆心x轴坐标
  oy: number; // 圆心y轴坐标
  startAngle: number; // touchstart时记录的角度
  tableRotateAngle: number; // 转盘转动的角度
  touched: boolean; // 是否允许移动
  startThreshold: number; // 开始阈值
  endthreshold: number; // 结束阈值
}

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
    },
    dom: {
      type: Object as PropType<HTMLDivElement>,
    },
    config: {
      type: Object,
      default: {},
    },
    children: {
      type: Array,
      defalut: [],
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    modelValue(val) {
      if (!val) return;
      // 重置角度
      this.data.startAngle = 0;
      this.data.tableRotateAngle = 0;
      // 克隆dom
      const {
        x,
        y,
        width: w,
        height: h,
      } = (this.dom as HTMLDivElement).getBoundingClientRect();
      this.data.ox = x + w / 2;
      this.data.oy = y + h / 2;
      const cloneDom = (this.dom as HTMLDivElement).cloneNode(true);
      var childs = (this.currentSelectWrap as HTMLDivElement).childNodes;
      for (var i = childs.length - 1; i >= 0; i--) {
        (this.currentSelectWrap as HTMLDivElement).removeChild(childs[i]);
      }
      (this.currentSelectWrap as HTMLDivElement).appendChild(cloneDom);
    },
  },
  setup(props, { emit }) {
    const { sqrt, acos, PI, abs, floor, ceil } = Math;
    const baseConfig: Config = {
      diameter: 240,
      itemAngle: 45,
      activeAngle: 0,
    };
    // 转盘参数
    const tableConfig = reactive<Config>(
      Object.assign(baseConfig, props.config)
    );

    const currentSelectWrap = ref<HTMLDivElement | null>(null);
    const data = reactive<DataType>({
      ox: 0,
      oy: 0,
      startAngle: 0,
      tableRotateAngle: 0,
      touched: false,
      startThreshold: 0,
      endthreshold: 0,
    });
    // 关闭选择器
    const closeSelector = () => {
      emit("update:modelValue", false);
    };
    // 转盘选择器的样式
    const turntableClass = computed(() => {
      let { ox, oy } = data;
      return {
        width: `${tableConfig.diameter}px`,
        height: `${tableConfig.diameter}px`,
        top: `${oy - tableConfig.diameter / 2}px`,
        left: `${ox - tableConfig.diameter / 2}px`,
      };
    });
    // 删除超出范围的child
    const delChild = props.children!.splice(
      360 % tableConfig.itemAngle === 0
        ? ceil(360 / tableConfig.itemAngle)
        : floor(360 / tableConfig.itemAngle)
    );
    if (delChild.length > 0) {
      console.error("chlid超出长度");
    }
    /**
     * 调整角度
     * @param {boolean} adjust 调整  若为true 则调整角度；若为false,则返回需要调整的角度值
     */
    const adjustangle = (adjust: boolean = true) => {
      // 夹角为0  无需复位
      const disanceangle = data.tableRotateAngle % tableConfig.itemAngle;
      let changeangle = 0;
      if (disanceangle === 0) return;
      // 夹角是否大于item角度（30度）的一半
      const gtHalfPerangle = abs(disanceangle) > tableConfig.itemAngle / 2;
      if (disanceangle > 0) {
        changeangle = gtHalfPerangle
          ? tableConfig.itemAngle - disanceangle
          : -disanceangle;
      } else {
        changeangle = gtHalfPerangle
          ? -tableConfig.itemAngle - disanceangle
          : -disanceangle;
      }
      if (!adjust) return changeangle;
      data.tableRotateAngle += changeangle;
    };
    // 开始滑动
    const touchStart = (e: TouchEvent) => {
      const { pageX, pageY } = e.touches[0];
      data.touched = true;
      const hypotenuse = sqrt((pageX - data.ox) ** 2 + (pageY - data.oy) ** 2); //斜边
      const angle = acos((pageX - data.ox) / hypotenuse) / (PI / 180);
      data.startAngle =
        (pageY - data.oy < 0 ? angle : 360 - angle) + data.tableRotateAngle;
    };
    // 滑动中
    const touchMove = (e: TouchEvent) => {
      if (!data.touched) return;
      const { pageX, pageY } = e.touches[0];
      const hypotenuse = sqrt((pageX - data.ox) ** 2 + (pageY - data.oy) ** 2);
      const angle = (acos((pageX - data.ox) / hypotenuse) * 180) / PI;
      const moveangle = pageY - data.oy < 0 ? angle : 360 - angle;
      data.tableRotateAngle = -(moveangle - data.startAngle) % 360;
      // 每经过一个item就触发一次事件  获取需要调整的角度
      const res = adjustangle(false) as number;
      // 计算调整完的角度
      const adjustedAngle = data.tableRotateAngle + res;
      // 选中的index
      const active =
        props.active -
        (data.tableRotateAngle - tableConfig.activeAngle) /
          tableConfig.itemAngle;
      console.log(active);
      if (active > props.children!.length - 1) {
      }
      // 控制阈值
    };
    // 结束滑动
    const touchEnd = () => {
      data.touched = false;
      adjustangle();
      const active =
        props.active -
        (data.tableRotateAngle - tableConfig.activeAngle) /
          tableConfig.itemAngle;
      console.log(active);
      // emit('update:active', active)
    };
    return {
      closeSelector,
      data,
      currentSelectWrap,
      tableConfig,
      turntableClass,
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
.child {
  position: absolute;
  left: 50%;
  top: 0px;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  p {
    font-size: 14px;
    color: rgb(51, 47, 47);
  }
}
</style>