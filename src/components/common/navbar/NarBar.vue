<template>
  <div class="nar-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
export default {
  name: "NarBar"
}
</script>

<style scoped>
  .nar-bar{
    display: flex;/*弹性布局*/
    line-height: 44px;
    /*background-color: #FF8198;*/
    text-align: center;
    box-shadow: 0 1px 1px rgba(100,100,100,0.1);
  }
  .left, .right{
    flex-shrink: 0; /*吸收超出的空间*/
    width: 60px;
  }
  .center{
    flex: 1;  /*1=比例100%,剩余的全部空间*/
  }
</style>
