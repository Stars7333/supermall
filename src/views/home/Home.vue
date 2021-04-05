<template>
  <div id="home">
    <nar-bar class="home-nav"><div slot="center">购物街</div></nar-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1" class="Show-tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scrollXY="conentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
        <tab-control :titles="['流行','新款','精选']"
                     @tabClick="tabClick"
                     ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/> <!--想要监听组件,加上native(原生):监听组件根元素的原生事件-->
  </div>

</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper';
  import RecommendView from './childComps/RecommendView';
  import FeatureView from './childComps/FeatureView';

  import NarBar from 'components/common/navbar/NarBar';
  import TabControl from 'components/content/tabControl/TabControl'
  import goodsList from 'components/content/goods/goodsList'
  import Scroll from 'components/common/scroll/Scroll'

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {itemListenerMixin,backTopMixin} from "common/mixin";
  import{TOP_DISTANCE} from 'common/const'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NarBar,
      TabControl,
      goodsList,
      Scroll,
    },
    mixins: [itemListenerMixin,backTopMixin],
    data(){
      return{
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []},
        },
        currentType:'pop',
        tabOffsetTop: 0,    //存储首页吸顶效果的距离
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed:{
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('销毁');
    },
    activated() { //进来
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() { //离开
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      //2.取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.ItemImgListener)
    },
    created() { //首页加载完成请求数据
      //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
    },
    methods: {
      /**
       *事件监听相关的方法
       */
      tabClick(index){  //index是TabControl通过.$emit(index)接受的默认值0
        switch (index){
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
        console.log(index);
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0,300)
      },
      conentScroll(position){
        //1.判断BackTop是否显示
        this.listenShoBackTop(position)

        //2.决定tabControl是否吸顶(psoition: fixed)
        this.isTabFixed= (-position.y) > this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad(){
        //2.获取tabControl的offsetTop
        //所有组件都有一个属性$el,用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
      * 网络请求相关的方法
      * */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page =this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /*在使用浏览器原生滚动时,为了让我们的导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
    left: 0;
  }
  .Show-tab-control {
    position: relative;
    z-index: 9;
  }
  /*.content{*/
  /*  margin-top: 44px;*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*}*/

</style>
