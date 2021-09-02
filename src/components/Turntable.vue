<template>
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
          <transition name="fade">
            <div
              v-show="index === data.tableList[data.activeIndex]._baseIndex"
              class="table-main__content"
            >
              <img :src="item.img" :alt="item.content" />
            </div>
          </transition>
        </div>
      </div>
      <div
        class="table"
        :class="{ rotateTransition: !data.touched }"
        ref="table"
        @touchstart.stop="touchStart"
        :style="{ transform: `rotate(${data.tableRotateangle}deg)` }"
      >
        <!-- items -->
        <div
          class="table-item__wrap"
          v-for="(item, index) in data.tableList"
          :key="index"
          :style="{
            transform: `rotate(${index * data.perangle}deg)`,
          }"
          @click="touch(index)"
        >
          <div
            class="table-item__content"
            :style="{
              transform: `rotate(${
                index * -data.perangle - data.tableRotateangle
              }deg)`,
            }"
          >
            <img
              :src="item.img"
              :alt="item.content"
              :class="{
                active: isActiveItem(index),
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
interface tableItem {
  _baseIndex: number
  [propName: string]: any
}
interface DataType {
  baseangle: number
  tableRotateangle: number
  touched: boolean
  perangle: number
  tableList: tableItem[]
  activeIndex: number
  circleX: number | null
  circleY: number | null
}

import { computed, PropType, reactive, ref } from 'vue'
export default {
  props: {
    list: {
      type: Array as PropType<any[]>,
      default: [],
    },
  },
  setup(props: any) {
    const data = reactive<DataType>({
      baseangle: 0,
      tableRotateangle: 0,
      touched: false,
      perangle: 30, // 每个item的相隔的角度   360/12
      tableList: [], //转盘的列表
      activeIndex: 0, // 当前选中的index  tableList的index
      circleX: null,
      circleY: null,
    })
    const table = ref(null)
    const { sqrt, PI, acos, pow, ceil, floor, abs } = Math
    // 总共有12个item
    const itemNum = computed(() => {
      return 360 / data.perangle
    })

    // 判断是否为选中的item
    const isActiveItem = (index: number): boolean => {
      const angle = index * -data.perangle - data.tableRotateangle
      return angle === 0 || angle === -360
    }
    /**
     * 修改前一个
     * @param {number} index 传入activeIndex
     */
    const modifyPrev = (index: number) => {
      const prevDisance = ceil(props.list.length / 2)
      const tableListPrevIndex = (prevDisance + index) % itemNum.value
      const listNextIndex =
        (data.tableList[index]._baseIndex + prevDisance) % props.list.length
      data.tableList[tableListPrevIndex] = props.list[listNextIndex]
    }

    /**
     * 修改后一个
     * @param {number} index 传入activeIndex
     */
    const modifyNext = (index: number) => {
      const nextDisance = itemNum.value - ceil(props.list.length / 2)
      const tableListNextIndex = (index + nextDisance) % itemNum.value
      const listPrevIndex =
        (data.tableList[index]._baseIndex - (itemNum.value - nextDisance)) %
          props.list.length <
        0
          ? props.list.length +
            ((data.tableList[index]._baseIndex -
              (itemNum.value - nextDisance)) %
              props.list.length)
          : (data.tableList[index]._baseIndex - (itemNum.value - nextDisance)) %
            props.list.length
      data.tableList[tableListNextIndex] = props.list[listPrevIndex]
    }

    // 初始化转盘数组
    const tableInit = () => {
      const list = new Array(itemNum.value)
      for (let i = 0; i < list.length; i++) {
        const currIndex = i < list.length / 2 ? i : i - 3
        const index =
          currIndex < props.list.length
            ? currIndex
            : currIndex - props.list.length
        const item = props.list[index]
        item._baseIndex = index
        list[i] = item
      }
      data.tableList = list
    }
    tableInit()

    // 获取圆心坐标  避免多次计算
    const getCircleCenterCoordinate = () => {
      if (data.circleX !== null && data.circleY !== null) {
        return {
          x0: data.circleX,
          y0: data.circleY,
        }
      }
      const t = table.value as any
      const x0 =
        t.getBoundingClientRect().left + t.getBoundingClientRect().width / 2
      const y0 =
        t.getBoundingClientRect().top + t.getBoundingClientRect().height / 2
      data.circleX = x0
      data.circleY = y0
      return { x0, y0 }
    }

    /**
     * 调整角度
     * @param {boolean} adjust 调整  若为true 则需要调整角度；若为false,则返回需要调整的角度值
     */
    const adjustangle = (adjust: boolean = true) => {
      // 夹角为0  无需复位
      const disanceangle = data.tableRotateangle % data.perangle
      let changeangle = 0
      if (disanceangle === 0) return
      // 夹角是否大于item角度（30度）的一半
      const gtHalfPerangle = disanceangle > data.perangle / 2
      if (disanceangle > 0) {
        changeangle = gtHalfPerangle
          ? data.perangle - disanceangle
          : -disanceangle
      } else {
        changeangle = gtHalfPerangle
          ? -data.perangle - disanceangle
          : -disanceangle
      }
      if (!adjust) return changeangle
      data.tableRotateangle += changeangle
    }

    // 跳转
    const handleNavigateTo = (index: number) => {
      // 陈奕迅神经研究所官网
      location.href = 'http://www.easonfans.com/'
    }

    /**
     * 点击item
     * @param {number} index 传入index
     */
    const touch = (index: number) => {
      if (index === data.activeIndex) return
      // 是否下半区
      const isUnder =
        (index > data.activeIndex &&
          index <= data.activeIndex + floor(props.list.length / 2)) ||
        (index < data.activeIndex &&
          index <=
            data.activeIndex + floor(props.list.length / 2) - itemNum.value)

      if (isUnder) {
        // 点了下半区
        const dis =
          index - data.activeIndex < 0
            ? itemNum.value + index - data.activeIndex
            : index - data.activeIndex
        data.tableRotateangle -= (dis % itemNum.value) * data.perangle
      } else {
        // 点了上半区
        data.tableRotateangle +=
          ((itemNum.value - index + data.activeIndex) % itemNum.value) *
          data.perangle
      }

      const viaIndexList = []
      if (isUnder) {
        let maxNum =
          index - data.activeIndex < 0
            ? index - data.activeIndex + itemNum.value
            : index - data.activeIndex
        while (maxNum > 0) {
          viaIndexList.push((maxNum + data.activeIndex) % itemNum.value)
          maxNum--
        }
      } else {
        const aIndex = data.activeIndex === 0 ? itemNum.value : data.activeIndex
        let minNum =
          aIndex - index < 0 ? aIndex - index + itemNum.value : aIndex - index
        while (minNum > 0) {
          const res =
            data.activeIndex - minNum < 0
              ? data.activeIndex - minNum + itemNum.value
              : data.activeIndex - minNum
          viaIndexList.push(res)
          minNum--
        }
      }
      viaIndexList.forEach((item) => {
        if (isUnder) {
          modifyPrev(item)
        } else {
          modifyNext(item)
        }
      })
      data.activeIndex = index
    }

    // 开始滑动
    const touchStart = (e: TouchEvent) => {
      const { x0, y0 } = getCircleCenterCoordinate()
      const touch = e.touches[0]
      data.touched = true
      const hypotenuse = sqrt(
        pow(touch.pageX - x0, 2) + pow(touch.pageY - y0, 2)
      ) //斜边
      const angle = acos((touch.pageX - x0) / hypotenuse) / (PI / 180)
      data.baseangle =
        (touch.pageY - y0 < 0 ? angle : 360 - angle) + data.tableRotateangle
    }

    // 滑动中
    const touchMove = (e: TouchEvent) => {
      if (!data.touched) return
      const touch = e.touches[0]
      const { x0, y0 } = getCircleCenterCoordinate()
      const hypotenuse = sqrt(
        pow(touch.pageX - x0, 2) + pow(touch.pageY - y0, 2)
      )
      const angle = (acos((touch.pageX - x0) / hypotenuse) * 180) / PI
      const moveangle = touch.pageY - y0 < 0 ? angle : 360 - angle
      data.tableRotateangle = -(moveangle - data.baseangle) % 360

      // 每经过一个item就触发一次事件  获取需要调整的角度
      const res = adjustangle(false) as number

      // 计算调整完的角度
      const adjustedangle = data.tableRotateangle + res
      // 控制调整完的角度为正整数
      const endingangle =
        adjustedangle < 0 ? 360 + adjustedangle : adjustedangle
      // 求出若调整完成，此时的activeIndex的值为多少
      const index = abs(endingangle / data.perangle) % itemNum.value

      const activeIndex = index == 0 ? index : itemNum.value - index
      if (activeIndex !== data.activeIndex) {
        const clockwise =
          activeIndex - data.activeIndex === 1 ||
          activeIndex - data.activeIndex === 0 - (itemNum.value - 1)
        const counterClockwise =
          activeIndex - data.activeIndex === -1 ||
          activeIndex - data.activeIndex === itemNum.value - 1
        if (clockwise) {
          modifyPrev(index)
          console.log(1)
        } else if (counterClockwise) {
          modifyNext(index)
          console.log(2)
        } else {
          console.log(123)
        }
        data.activeIndex = activeIndex
      }
    }
    // 接触滑动
    const touchEnd = (e: TouchEvent) => {
      data.touched = false
      adjustangle()
    }

    return {
      data,
      touchStart,
      touchMove,
      touchEnd,
      table,
      getCircleCenterCoordinate,
      props,
      tableInit,
      handleNavigateTo,
      touch,
      isActiveItem,
    }
  },
}
</script>

<style lang="less" scoped>
.page {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: #eaf6ff;
  // item
  --item-width: 60px;
  --item-height: var(--item-width);
  --item-top: calc((var(--table-height) - var(--item-height)) / 2);
  --item-right: 0px;
  // table
  --table-base-width: 380px;
  --table-width: calc(var(--item-width) + var(--table-base-width));
  --table-height: var(--table-width);
  --table-left: calc((var(--table-width) * -0.2));
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
    content: '';
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
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transition: transfrom 0.3s;
        &.active {
          transform: scale(1.3);
        }
      }
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
.fade-enter-active {
  transition: all 0.5s ease-out;
}

.fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>