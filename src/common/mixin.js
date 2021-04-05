import {debounce} from "common/utils";
import backTop from 'components/content/backTop/backTop'
import{TOP_DISTANCE} from 'common/const'

export const itemListenerMixin = {
  data(){
    return{
      ItemImgListener: null,
      refresh: null
    }
  },
  mounted(){
    //1.图片加载完成的事件监听
    this.refresh = debounce(this.$refs.scroll.refresh,50)

    //对监听的事件进行保存
    this.ItemImgListener = () => {
      this.refresh()   //DOM 结构发生改变的时候
    }
    this.$bus.$on('itemImageLoad',this.ItemImgListener)
  }
}

export const backTopMixin ={
  components: {
    backTop
  },
  data(){
    return{
      isShowBackTop: false,
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0,0,300)
    },
    listenShoBackTop(position){
      this.isShowBackTop = (-position.y) > TOP_DISTANCE
    }
  }
}
