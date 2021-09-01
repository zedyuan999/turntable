<template>
  <section class="flex flex-col items-center py-3 min-h-full w-full">
    <h2 class="mb-5 mt-3 text-2xl font-bold">组件目录</h2>
    <ul class="flex flex-col justify-center items-center w-2/3 mx-auto">
      <li
        v-for="(item, index) in catelog"
        :key="index"
        class="
          mb-3
          rounded-full
          w-full
          overflow-hidden
          flex
          justify-center
          items-center
          bg-gray-300
          text-base text-gray-700
        "
      >
        <router-link :to="item.path" class="w-full h-full text-center py-2">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  setup() {
    const catelog = [
      {
        name: "turntable",
        path: "turntable",
      },
      {
        name: "turntableSelect",
        path: "turntableSelect",
      },
    ];
    return { catelog };
  },
};
</script>

<style lang="less" scoped>
</style>