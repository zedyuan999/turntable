<template>
  <Turntable :list="data.list"></Turntable>
</template>

<script>
import { reactive } from "vue";
import Turntable from "@/components/Turntable.vue";
import img1 from "@/assets/images/1.jpg";
import img2 from "@/assets/images/2.jpg";
import img3 from "@/assets/images/3.jpg";
import img4 from "@/assets/images/4.jpg";
import img5 from "@/assets/images/5.jpg";
import img6 from "@/assets/images/6.jpg";
import img7 from "@/assets/images/7.jpg";
import img8 from "@/assets/images/8.jpg";
import img9 from "@/assets/images/9.jpg";

export default {
  name: "App",
  components: {
    Turntable,
  },
  setup () {
    const data = reactive({
      list: [
        { content: "Time Flies", img: img1 },
        { content: "H³M", img: img2 },
        { content: "The Key", img: img3 },
        {
          content: "Eason's Life 陈奕迅2013演唱会",
          img: img4,
        },
        { content: "L.O.V.E.", img: img5 },
        { content: "准备中", img: img6 },
        { content: "Duo 2010香港演唱会", img: img7 },
        { content: "认了吧", img: img8 },
        { content: "我的最好时代", img: img9 },
      ],
    });
    return {
      data,
    };
  },
};
</script>

<style>
</style>