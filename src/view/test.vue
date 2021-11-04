<template>
  <section>
    <div class="div1"><span class="span1"> </span></div>
    <span class="span2">
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Molestiae,
        odit? Harum repellendus, nesciunt eaque voluptates, tempora, libero
        exercitationem dicta ullam saepe illum facilis facere. Doloremque odio
        nihil mollitia molestias fuga.
      </p>
    </span>
  </section>
</template>

<script>
export default {};
</script>

<style lang="less">
section {
  line-height: 40px;
  display: inline-block;
  &::after {
    content: "";
    clear: both;
    display: block;
  }
  .div1 {
    display: inline-block;
    .span1 {
      display: inline-block;
      border: 1px solid #000;
      width: 20px;
      height: 20px;
      vertical-align: text-top;
    }
  }
  .span2 {
    width: 95%;
    display: inline-block;
    vertical-align: top;
  }
}
</style>