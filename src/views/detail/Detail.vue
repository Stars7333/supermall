<template>
  <div id="detail">
    <detail-nar-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3" @scrollXY="contentScroll">
<!--      属性:topImages 传入值:top-images-->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="Shop"/>
      <detail-image-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-List ref="recommend" :goods="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/><!--想要监听组件,加上native(原生):监听组件根元素的原生事件-->
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNarBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailImageInfo from './childComps/DetailImageInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll';
  import GoodsList from 'components/content/goods/goodsList'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {itemListenerMixin,backTopMixin} from "common/mixin";
  import {debounce} from "@/common/utils";

  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    components:{
      DetailNarBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailImageInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    mixins: [itemListenerMixin,backTopMixin],
    data(){
      return{
        iid: null,
        topImages:[],
        goods: {},
        Shop: {},
        detailInfo:{},
        paramInfo: {},
        commentInfo:{},
        recommend:[],
        themeTopYs:[],
        getThemeTopY: null,
        currentIndex: 0,
        // message:'',
        // show:false
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid
      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的图片(轮播图数据)
        // console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

        //3.获取店铺信息
        // this.Shop = new Shop(data.shopInfo)
        this.Shop = data.shopInfo

        //4.保存商品的详情数据
        this.detailInfo =data.detailInfo

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);

        //6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        //第一次获取,值不对
        // 值不对的原因: this.$refs.params.$el压根没有渲染
        // this.themeTopYs = []
        //
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);

        this.$nextTick(() => {
          //2.第二次获取,值不对,
          //值不对的原因:没有将图片计算在内
          //根据最新的数据,对应的DOM是已经被渲染出来了,
          //但是图片依然是没有加载完(目前获取到的offsetTop是不包含图片的).
          //一般情况offsetTop值不对的时候,都是因为图片的问题
          // this.themeTopYs = []
          //
          // this.themeTopYs.push(0)
          // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          // console.log(this.themeTopYs);
        })
      })
      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommend = res.data.list
      })
      //4.给getThemeTopY赋值(对给this.getThemeTopY赋值的操作进行防抖)
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs);
      },100)
    },
    methods:{
      ...mapActions(['addCart']),//映射
      imageLoad(){
        // this.$refs.scroll.refresh() //图片全部加载完毕刷新scroll,加上mixin防抖
        this.refresh()  //第二种方法:防抖

        //第三次:
        this.getThemeTopY()
      },
      titleClick(index){
        console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position){
        //1.获取y值
        const positionY = -position.y

        //2.positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for (let i=0; i<length-1; i++){
          // if (positionY > this.themeTopYs[parseInt(i)] && positionY < this.themeTopYs[parseInt(i+1)]){
          //
          // }

          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex
          }

          // if (this.currentIndex !== i && ((i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
          //   || (i===length -1 && positionY >= this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }

        //3.是否回到顶部
        this.listenShoBackTop(position)
      },
      addToCart(){
        //1.获取商品的信息购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2.将商品添加到购物车里面(1.Promise 2.mapActions)
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart',product)
        this.addCart(product).then(res => {
          // this.show = true;
          // this.message = res

          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)

          this.$toast.show(res)
          console.log(this.$toast);
        })

        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })

        //3.添加到购物车成功

      }
    },
    mounted() {

    },
    destroyed() { //取消
      this.$bus.$off('itemImageLoad',this.ItemImgListener)
    }
  }
</script>

<style scoped>
 #detail{
   position: relative;
   z-index: 1;
   background-color: #fff;
   height: 100vh;
 }
 .detail-nav{
   position: relative;
   z-index: 9;
   background-color: #fff;
 }
 .content{
   height: calc(100% - 44px - 65px);
 }
</style>
