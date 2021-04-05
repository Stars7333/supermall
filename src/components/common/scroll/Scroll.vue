<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll";
  export default {
    name: "Scroll",
    props: {
      probeType:{
        type: Number,
        default:0
      },
      pullUpLoad:{
        type:Boolean,
        default: false
      }
    },
    data(){
      return{
        scroll:null
      }
    },
    mounted() {
      //1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true ,/*对botton无用,但是其他元素标签想要有点击事件需添加*/
        probeType: this.probeType,
        pullUpLoad:this.pullUpLoad,
      })
      //2.监听滚动的区域
      if (this.probeType === 2 || this.probeType === 3){
        this.scroll.on('scroll',(position) => {
          this.$emit('scrollXY',position)
        })
      }
      //监听scroll滚动到底部
      if (this.pullUpLoad){
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time) {
        this.scroll && this.scroll.scrollTo(x,y,time)
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      getScrollY() { //记录离开的位置
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
