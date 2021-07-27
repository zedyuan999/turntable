s<template>
  <section class="page" @touchmove="touchMove" @touchend="touchEnd">
    <div class="table-wrap">
      <!-- 中间的内容 -->
      <div class="table-main">
        <div
          class="table-main__img"
          v-for="(item, index) in props.list"
          :key="index"
          @click="handleNavigateTo"
        >
          <transition>
            <div
              v-show="index === data.tableList[data.activeIndex]._baseIndex"
              class="table-main__content"
            >
              {{ item.content }}
            </div>
          </transition>
        </div>
      </div>
      <div
        class="table"
        :class="{ rotateTransition: !data.touched }"
        ref="table"
        @touchstart.stop="touchStart"
        :style="{ transform: `rotate(${data.tableRotateAngel}deg)` }"
      >
        <!-- items -->
        <div
          class="table-item__wrap"
          v-for="(item, index) in data.tableList"
          :key="index"
          :style="{
            transform: `rotate(${index * data.perAngel}deg)`,
          }"
          @click="touch(index)"
        >
          <div
            class="table-item__content"
            :class="{
              active: index * -data.perAngel - data.tableRotateAngel === 0,
            }"
            :style="{
              transform: `rotate(${
                index * -data.perAngel - data.tableRotateAngel
              }deg)`,
            }"
          >
            {{ item.content }}
          </div>
        </div>
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
      perAngel: 30, // 每个item的相隔的角度   360/12
      tableList: [], //转盘的列表
      activeIndex: 0, // 当前选中的index  tableList的index
    });
    const table = ref(null);

    // 计算index
    const comuptedItemIndex = (index: number): number => {
      return index * 2 < props.list.length
        ? index
        : 360 / data.perAngel - props.list.length + index;
    };
    // 生成新的数组
    const buildTableList = () => {
      const list = new Array(12);
      for (let i = 0; i < list.length; i++) {
        const currIndex = i < list.length / 2 ? i : i - 3;
        const index =
          currIndex < props.list.length
            ? currIndex
            : currIndex - props.list.length;
        const item = props.list[index];
        item._baseIndex = index;
        list[i] = item;
      }
      data.tableList = list;
    };
    buildTableList();
    // 修改数组不可见的项
    const modifyTableList = (baseIndex: number) => {
      const { ceil, floor } = Math;
      if (
        baseIndex - data.activeIndex === 1 ||
        baseIndex - data.activeIndex === -11
      ) {
        const prevDisance = ceil(props.list.length / 2);
        const tableListPrevIndex = (prevDisance + baseIndex) % 12;
        const listNextIndex =
          (data.tableList[baseIndex]._baseIndex + prevDisance) % 9;
        data.tableList[tableListPrevIndex] = props.list[listNextIndex];
      } else {
        const nextDisance = 12 - ceil(props.list.length / 2);
        const tableListNextIndex =
          (nextDisance - (12 - baseIndex)) % 12 < 0
            ? 12 + ((nextDisance - (12 - baseIndex)) % 12)
            : (nextDisance - (12 - baseIndex)) % 12;

        const listPrevIndex =
          (data.tableList[baseIndex]._baseIndex - (12 - nextDisance)) % 9 < 0
            ? 9 +
              ((data.tableList[baseIndex]._baseIndex - (12 - nextDisance)) % 9)
            : (data.tableList[baseIndex]._baseIndex - (12 - nextDisance)) % 9;
        data.tableList[tableListNextIndex] = props.list[listPrevIndex];
      }
    };

    // 获取圆心坐标
    const getCircleCenterCoordinate = () => {
      const t = table.value as HTMLDivElement;
      const x0 =
        t.getBoundingClientRect().left + t.getBoundingClientRect().width / 2;
      const y0 =
        t.getBoundingClientRect().top + t.getBoundingClientRect().height / 2;
      return { x0, y0 };
    };

    /**
     * 调整角度
     * @params adjust 调整  若为true 则调整角度；若为false,则返回需要调整的角度
     */

    const adjustAngel = (adjust: boolean = true) => {
      // 夹角为0  无需复位
      const disanceAngel = data.tableRotateAngel % data.perAngel;
      let changeAngel = 0;
      if (disanceAngel === 0) return;
      if (disanceAngel > 0) {
        if (disanceAngel > data.perAngel / 2) {
          changeAngel = data.perAngel - disanceAngel;
        } else {
          changeAngel = -disanceAngel;
        }
      } else {
        if (Math.abs(disanceAngel) > data.perAngel / 2) {
          changeAngel = -data.perAngel - disanceAngel;
        } else {
          changeAngel = -disanceAngel;
        }
      }
      if (!adjust) return changeAngel;
      data.tableRotateAngel += changeAngel;
    };

    // 跳转
    const handleNavigateTo = () => {
      console.log("jump");
    };
    // 点击
    const touch = (index: number) => {
      if (index === data.activeIndex) return;
      if (
        (index < data.activeIndex + 4 && index > data.activeIndex) ||
        index - data.activeIndex === -11
      ) {
        const dis =
          index - data.activeIndex < 0
            ? 12 + index - data.activeIndex
            : index - data.activeIndex;
        console.log(dis % 12);
        data.tableRotateAngel -= (dis % 12) * data.perAngel;
      } else {
        data.tableRotateAngel +=
          ((12 - index + data.activeIndex) % 12) * data.perAngel;
      }

      modifyTableList(index);
      data.activeIndex = index;
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
      data.tableRotateAngel = -(moveAngel - data.baseAngel) % 360;

      // 每经过一个item就触发一次事件
      const res = adjustAngel(false);

      // 调整完的角度
      const adjustedAngel = data.tableRotateAngel + res;
      // 控制调整完的角度为正整数
      const endingAngel =
        adjustedAngel < 0 ? 360 + adjustedAngel : adjustedAngel;
      // 暴露选中的index
      const index = Math.abs(endingAngel / data.perAngel) % 12;
      const activeIndex = index == 0 ? index : 12 - index;
      if (activeIndex !== data.activeIndex) {
        modifyTableList(activeIndex);
        console.log("modify");
        data.activeIndex = activeIndex;
      }
      console.log(`index:${data.activeIndex}`);
    };
    // 接触滑动
    const touchEnd = (e) => {
      data.touched = false;
      data.startX = 0;
      data.startY = 0;
      data.currentX = 0;
      data.currentY = 0;
      adjustAngel();
    };

    return {
      data,
      touchStart,
      touchMove,
      touchEnd,
      table,
      getCircleCenterCoordinate,
      props,
      comuptedItemIndex,
      buildTableList,
      modifyTableList,
      handleNavigateTo,
      touch,
    };
  },
};
</script>

<style lang="less" scoped>
.page {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  // item
  --item-width: 50px;
  --item-height: var(--item-width);
  --item-top: calc((var(--table-height) - var(--item-height)) / 2);
  --item-right: 0px;
  // table
  --table-base-width: 380px;
  --table-width: calc(var(--item-width) + var(--table-base-width));
  --table-height: var(--table-width);
  --table-left: calc(var(--table-width) * -0.2);
  --table-bottom: calc(var(--item-height) + 20px);
  // table-main
  --table-main-width: 250px;
  --table-main-height: var(--table-main-width);
}
.table-wrap {
  width: calc(100vw - var(--table-left));
  height: var(--table-height);
  left: var(--table-left);
  bottom: var(--table-bottom);
  position: absolute;
  overflow: hidden;
}
.table {
  width: var(--table-width);
  height: var(--table-height);
  border-radius: 50%;
  position: absolute;
  box-sizing: border-box;
  &::after {
    content: "";
    border: 1px solid #999;
    width: var(--table-base-width);
    height: var(--table-base-width);
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
  &.rotateTransition {
    transition: transform 0.2s;
  }
  .table-item__wrap {
    width: var(--item-width);
    height: var(--item-height);
    border-radius: 50%;
    background-color: steelblue;
    color: #fff;
    position: absolute;
    top: var(--item-top);
    right: var(--item-right);
    transform-origin: calc(var(--table-width) / -2 + var(--item-width)) center;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    .table-item__content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.table-main {
  position: absolute;
  width: var(--table-main-width);
  height: var(--table-main-height);
  left: calc(var(--table-width) + var(--table-left) - var(--table-main-width));
  top: calc((var(--table-height) - var(--table-main-height)) / 2);
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  padding: 10px;
  background-color: thistle;
  z-index: 10;
  transform-origin: 0 0;
  .table-main__content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: 50%;
    }
  }
}
</style>