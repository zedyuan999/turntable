s<template>
  <section class="page" @touchmove="touchMove" @touchend="touchEnd">
    <div
      class="table"
      ref="table"
      @touchstart.stop="touchStart"
      :style="{ transform: `rotate(${data.tableRotateAngel}deg)` }"
    >
      <div class="table-item__wrap">1</div>
      <div class="table-item__wrap">2</div>
      <div class="table-item__wrap">3</div>
      <div class="table-item__wrap">4</div>
      <div class="table-item__wrap">5</div>
      <div class="table-item__wrap">6</div>
      <div class="table-item__wrap">7</div>
      <div class="table-item__wrap">8</div>
    </div>
  </section>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
export default {
  setup() {
    const data = reactive({
      startX: 0, //开始点击时的x值
      startY: 0, //开始点击时的y值
      currentX: 0, //触摸移动时的x值
      currentY: 0, //触摸移动时的y值
      quadrant: 1, //象限
      axis: {
        // y = (kx|ky)x+(bx|by)
        // 带x的为自建x轴的支线函数参数,y轴同理
        // 根据自建的x轴和y轴判断象限
        kx: 0,
        bx: 0,
        ky: 0,
        by: 0,
      },
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
    // 获取斜边长度
    const getHypotenuse = () => {
      const { x0, y0 } = getCircleCenterCoordinate();
      const { sqrt, pow } = Math;
      return sqrt(pow(data.startX - x0, 2) + pow(data.startY - y0, 2));
    };
    // 获取滑动角度
    const getAngel = (x: number, y: number) => {
      // 求出开始点到直线（圆心-移动点）的距离
      const { x0, y0 } = getCircleCenterCoordinate();
      const k = (y - y0) / (x - x0); //y = kx+b的k
      const b = y - k * x; //y = kx+b的b
      const { sqrt, abs, PI, acos, pow } = Math;
      const d = abs(k * data.startX - data.startY + b) / sqrt(k * k + 1); //直线距离  直角三角形中的对边
      const n = sqrt(pow(getHypotenuse(), 2) - d * d); //直角三角形中的邻边
      const baseAngel = acos(n / getHypotenuse()) / (PI / 180); // 常规cos的角度值
      const angel = data.quadrant % 2 === 0 ? 90 - baseAngel : baseAngel;
      return angel + (data.quadrant - 1) * 90; //对边除以斜边 求得夹角
    };
    // 建立坐标系
    const setAxis = (x: number, y: number) => {
      const { x0, y0 } = getCircleCenterCoordinate();
      const kx = (y - y0) / (x - x0);
      const bx = y - kx * x;
      const ky = -1 / kx;
      const by = y0 - (-1 / kx) * x0;
      data.axis.kx = kx;
      data.axis.bx = bx;
      data.axis.ky = ky;
      data.axis.by = by;
      console.log(data.axis);
    };
    // 设置象限
    const setQuadrant = (x: number, y: number) => {
      //TODO 象限判断有问题   不能根据正常的xy轴  要根据startX和startY建立坐标轴
      // const { x0, y0 } = getCircleCenterCoordinate();
      // const dx = x - x0;
      // const dy = y - y0;
      // if (dx > 0 && dy < 0) {
      //   data.quadrant = 1;
      // } else if (dx < 0 && dy < 0) {
      //   data.quadrant = 2;
      // } else if (dx < 0 && dy > 0) {
      //   data.quadrant = 3;
      // } else if (dx > 0 && dy > 0) {
      //   data.quadrant = 4;
      // }
      /**
       * 要根据startX和startY建立坐标轴
       * 判断顺逆时针 还得根据startX和startY判断 x轴的正方向和y轴的正方向
       * 根据startX和startY建的应该是Y轴
       */
      // distanceX distanceY
      const dx = y - data.axis.kx * x;
      const dy = y - data.axis.ky * x;
      const bx = data.axis.bx;
      const by = data.axis.by;

      if (dx > bx && dy > by) {
        data.quadrant = 3;
      } else if (dx < bx && dy > by) {
        data.quadrant = 2;
      } else if (dx < bx && dy < by) {
        data.quadrant = 1;
      } else if (dx > bx && dy < by) {
        data.quadrant = 4;
      }
    };
    const touchStart = (e) => {
      const touch = e.touches[0];
      data.touched = true;
      data.startX = touch.pageX;
      data.startY = touch.pageY;
      setAxis(touch.pageX, touch.pageY);
    };
    const touchMove = (e) => {
      if (!data.touched) return;
      const touch = e.touches[0];
      data.currentX = touch.pageX;
      data.currentY = touch.pageY;
      setQuadrant(touch.pageX, touch.pageY);
      data.tableRotateAngel = getAngel(touch.pageX, touch.pageY);
      console.log(data.quadrant);
      console.log(getAngel(touch.pageX, touch.pageY));
    };
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
      getHypotenuse,
      setQuadrant,
    };
  },
};
</script>

<style lang="less">
// 循环旋转样式
.loopRotate(@n, @i:1) when (@i <= @n) {
  &:nth-child(@{i}) {
    transform: rotate(45deg * (@i - 1));
  }
  .loopRotate(@n,(@i + 1));
}
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
    .loopRotate(8);
  }
}
</style>