s<template>
  <section class="page" @touchmove="touchMove" @touchend="touchEnd">
    <div
      class="table"
      ref="table"
      @touchstart.stop="touchStart"
      :style="{ transform: `rotate(${data.tableRotateAngel}deg)` }"
    >
      <div
        class="table-item__wrap"
        v-for="(item, index) in props.list"
        :key="index"
        :style="{ transform: `rotate(${index * 45}deg)` }"
      >
        {{ index }}
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { PropType, reactive, ref } from "vue";
export default {
  props: {
    list: {
      type: Array as PropType<any[]>,
    },
  },
  setup(props) {
    const data = reactive({
      startX: 0, //开始点击时的x值
      startY: 0, //开始点击时的y值
      currentX: 0, //触摸移动时的x值
      currentY: 0, //触摸移动时的y值
      baseAngel: 0,
      tableRotateAngel: 0,
      touched: false,
    });
    const table = ref(null);
    // 获取圆心坐标
    const getCircleCenterCoordinate = () => {
      const t = table.value as HTMLDivElement;
      const x0 =
        t.getBoundingClientRect().left + t.getBoundingClientRect().width / 2;
      const y0 =
        t.getBoundingClientRect().top + t.getBoundingClientRect().height / 2;
      return { x0, y0 };
    };
    // 开始滑动
    const touchStart = (e) => {
      const { x0, y0 } = getCircleCenterCoordinate();
      const { sqrt, PI, acos, pow } = Math;
      const touch = e.touches[0];
      data.touched = true;
      data.startX = touch.pageX;
      data.startY = touch.pageY;
      const hypotenuse = sqrt(
        pow(touch.pageX - x0, 2) + pow(touch.pageY - y0, 2)
      ); //斜边
      const angel = acos((touch.pageX - x0) / hypotenuse) / (PI / 180);
      data.baseAngel =
        (touch.pageY - y0 < 0 ? angel : 360 - angel) + data.tableRotateAngel;
    };
    // 滑动中
    const touchMove = (e) => {
      if (!data.touched) return;
      const touch = e.touches[0];
      const { x0, y0 } = getCircleCenterCoordinate();
      const { sqrt, PI, acos, pow } = Math;
      const hypotenuse = sqrt(
        pow(touch.pageX - x0, 2) + pow(touch.pageY - y0, 2)
      );
      const angel = acos((touch.pageX - x0) / hypotenuse) / (PI / 180);
      const moveAngel = touch.pageY - y0 < 0 ? angel : 360 - angel;
      data.currentX = touch.pageX;
      data.currentY = touch.pageY;
      data.tableRotateAngel = -(moveAngel - data.baseAngel);
    };
    // 接触滑动
    const touchEnd = (e) => {
      data.touched = false;
      data.startX = 0;
      data.startY = 0;
      data.currentX = 0;
      data.currentY = 0;
    };

    return {
      data,
      touchStart,
      touchMove,
      touchEnd,
      table,
      getCircleCenterCoordinate,
      props,
    };
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  --table-width: 300px;
  --table-height: var(--table-width);
  --item-width: 45px;
  --item-height: var(--item-width);
  --item-top: 20px;
  --item-left: calc((var(--table-width) - var(--item-width)) / 2);
  --item-transfrom-y: ;
}
.table {
  width: var(--table-width);
  height: var(--table-height);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  position: relative;
  .table-item__wrap {
    width: var(--item-width);
    height: var(--item-height);
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    top: var(--item-top);
    left: var(--item-left);
    transform-origin: center calc(var(--table-width) / 2 - var(--item-top));
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>