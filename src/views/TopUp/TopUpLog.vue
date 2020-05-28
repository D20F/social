<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
        <van-icon name="arrow-left" />
        <span style="margin-left:.5rem">充值记录</span>   
      </div>
    </div>
    <!-- 充值列表 -->
    <div class="list_box">
        <cell v-for="(item,index) in list" 
          :key="index" 
          :label="item.date">
          <template #title>
            <span class="custom-title">{{item.title}}</span>
          </template>
          <template #icon>
              <van-icon name="gold-coin" style="margin-top:.4rem;margin-right:1rem" color="#2BE0B0" size="3.4rem" />
          </template>
          <template #right-icon>
              <span class="custom-amount">- {{item.amount}}</span>
          </template>
        </cell>
    </div>
 </div>
</template>
<script>
import { Cell } from 'vant';
export default {
    components:{Cell},
    data(){
        return{
            list:[
                {title:"充值1个月套餐",amount:"20UE",date:"2020-01-05 14:57"},
                {title:"充值6个月套餐",amount:"50UE",date:"2020-02-05 08:30"},
                {title:"充值1个月套餐",amount:"20UE",date:"2020-01-05 14:57"},
                {title:"充值6个月套餐",amount:"50UE",date:"2020-02-05 08:30"},
                {title:"充值1个月套餐",amount:"20UE",date:"2020-01-05 14:57"},
                {title:"充值6个月套餐",amount:"50UE",date:"2020-02-05 08:30"},
                {title:"充值1个月套餐",amount:"20UE",date:"2020-01-05 14:57"},
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.list_box{
    margin-top: 1rem;
}
.custom-title{
    font-size: 1.5rem;
}
.custom-amount{
    font-size: 1.5rem;
    font-weight: bold;
}
</style>