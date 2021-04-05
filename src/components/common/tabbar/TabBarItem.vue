<template>
  <div class="tab-bar-item" @click="ItemClick">
    <div v-if="!isActive"><slot name="item-icon"></slot></div>
    <div v-else><slot name="item-icon-active"></slot></div>
    <div :style="activeStyle"><slot name="item-text"></slot></div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props :{
    path: String,
    activeColor: {
      type:String,
      default: 'block'
    }
  },
  data() {
    return {
       // isActive : false
   }
  },
  computed:{
    isActive(){
      // /home -> item1(/home) =  true
      // /home -> item1(/category) =  false
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle(){
      return this.isActive ? {color:this.activeColor} :  {}
    }
  },
  methods:{
    ItemClick(){
      this.$router.replace(this.path)
     // this.$router.replace(this.path).catch(()=>({}))
    }
  }
}
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 14px;
  }
  .tab-bar-item img {
    height: 24px;
    width: 24px;
    margin-top: 3px;
    vertical-align: middle;/*去除图片和文字的距离*/
    margin-bottom: 2px;
  }
  /*.active{*/
  /*  color: red;*/
  /*}*/
</style>
