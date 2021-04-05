import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mytations-types'
export default {
  //mutations:唯一的目的就是修改state中的状态
  //mutations中每一个方法完成事情尽可能比较单一一点
  [ADD_COUNTER](state,payload) {
    payload.count++
  },
  [ADD_TO_CART](state,payload){
    payload.checked = false
    state.cartList.push(payload)
  }
}
