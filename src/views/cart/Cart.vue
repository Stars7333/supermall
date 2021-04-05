<template>
  <div class="Cart">
    <nav-bar class="nav-bar">
      <!--   导航   -->
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!-- 商品的列表-->
    <cart-list/>
    <!--底部的汇总-->
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NarBar'
  import CartList from './childComps/CartList'
  import cartBottomBar from './childComps/CartBottomBar'

  //辅助函数: 仅仅将store中的getter映射到局部计算属性
  import { mapGetters } from 'vuex'

  export default {
    name: "cart",
    components: {
      NavBar,
      CartList,
      cartBottomBar
    },
    computed: {
      //两种语法
      // ...mapGetters(['cartLength', 'cartList']);
      ...mapGetters({
        length: 'cartLength'
      })
    }
  }
</script>
<style scoped>
  .Cart {
    overflow: hidden;
    height: 100vh;

  }
  .nav-bar{
    background-color: var(--color-tint);
    color: #FFF;
    /*font-weight: 700;!*定义文本的粗细*!*/
  }
</style>
