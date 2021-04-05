<template>
  <div class="cart-bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectALl"
        class="check-button"
        @click.native="checkAll"/> <!--监听组件的点击事件加.native-->
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import checkButton from 'components/content/checkButton/CheckButton'

  import {mapGetters} from 'vuex';

  export default {
    name: "CartBottomBar",
    components: {
      checkButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return  preValue+ item.price * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item => item.checked).length
      },
      isSelectALl(){
        if (this.cartList.length===0) return false

        //1.使用filter
        // return  !(this.cartList.filter(item => !item.checked).length)

        //2.使用find
        // return !this.cartList.find(item => !item.checked)

        //3.普通的遍历
        for (let item of this.cartList) {
          if (!item.checked){
            return false;
          }
        }
        return true
      }
    },
    methods: {
      checkAll(){
        if (this.isSelectALl) { //全部选中
          this.cartList.forEach(item => item.checked = false)
        }else { //有部分或全未选中
          this.cartList.forEach(item => item.checked = true)
        }
        // this.cartList.forEach(item => item.checked = !this.isSelectALl) //这里不能简化,isSelectAll可能会变化,每次都会影响checkAll的判断
      },
      calcClick(){
        if (!this.isSelectALl){ //全部没有选中的情况下
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }
</script>

<style scoped>
  .cart-bottom-bar {
    position: relative;
    display: flex;

    background-color: #eee;
    font-size: 14px;

    height: 40px;
    line-height: 40px;
  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .check-button {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    line-height: 20px;
  }
  .price {
    margin-left: 20px;
    flex: 1;
  }
  .calculate {
    width: 100px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
