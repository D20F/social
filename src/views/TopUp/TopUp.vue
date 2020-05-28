<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
        <van-icon name="arrow-left" />
        <span style="margin-left:.5rem">充值</span>   
      </div>
      <div class="right_text" @click="toLog">
        <van-icon name="balance-list-o" size="2.4rem" />
      </div>
    </div>
    <!-- 余额展示 -->
    <div class="outer_box">
        <div class="balance">
            <div class="balance_title">
                <p>账户余额</p>
                <p>免费试用至：2020-01-07</p>
            </div>
            <div class="balance_amount">
                1200.00 UE
            </div>
        </div>
        <div class="sub_title">
            请选择充值套餐
        </div>
        <!-- 套餐列表 -->
        <div class="meal">
            <div v-for="(item,index) in mealList" 
                 :key="index" 
                 class="meal_list"
                 :class="{meal_list_active : active === index}"
                 @click="clickMeal(item,index)">
                <p class="meal_title">{{item.name}}</p>
                <p class="meal_sub_title">
                    使用<span>{{item.date}}</span>个月
                </p>
            </div>
        </div>
        <!-- 用户协议 -->
        <div class="agreement">
            购买套餐即表示已同意<span>《用户充值服务协议》</span>
        </div>
        <van-button type="primary" 
                        @click="showTopUp"
                        block>
                确认充值
        </van-button>
    </div>
    <van-dialog v-model="passwordModal" title="请输入支付密码" :showConfirmButton="false">
        <div class="modal_outer">
            <p>{{mealList[active].date}}个月套餐</p>
            <p>{{mealList[active].name}}</p>
            <input v-model="password" type="password" placeholder="输入密码">
            <van-button type="primary" 
                        @click="sendTopUp"
                        block>
                确认
            </van-button>
        </div>
        <div class="close" @click="()=>{passwordModal=false}">
            <van-icon name="close" size="24" />
        </div>
    </van-dialog>
  </div>
</template>
<script>
export default {
    data(){
        return {
            active:0,
            passwordModal:false,
            password:"",
            mealList:[
                {id:"1",name:"10UE",date:"1"},
                {id:"2",name:"50UE",date:"6"},
                {id:"3",name:"60UE",date:"12"},
            ]
        }
    },
    methods:{
        toLog(){
            this.$router.push({path:"/topUpLog"})
        },
        clickMeal(item,index){
            this.active = index;
        },
        showTopUp(){
            this.passwordModal = true;
        },
        sendTopUp(){
            if(this.password === ""){
                return 
            }
            this.$router.push({path:"/topUpSuccess"})
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.outer_box{
    padding: 1.2rem;
    .balance{
        background: #2BE0B0;
        width: 100%;
        height: 12rem;
        margin: 2rem 0;
        border-radius: 5px;
        padding: 2.8rem 2rem;
        color: #fff;
        .balance_title{
            p{
                display: inline-block;
                vertical-align: top;
                font-size: 1.4rem;
            }
            p:nth-child(1){
                width: 40%;
            }
            p:nth-child(2){
                width: 60%;
                text-align: right;
            }
        }
        .balance_amount{
            font-size: 2.4rem;
            margin-top: 1.8rem;
            font-weight: bold;
        }
    }
    .sub_title{
        margin: 1.4rem 0;
        font-size: 1.4rem;
    }
    .meal_list{
        width: 32%;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        border:1px solid #E6E6E6;
        padding: 3rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        .meal_title{
            font-size: 1.6rem;
            font-weight: bold;
            margin-bottom: .5rem;
        }
        .meal_sub_title{
            color:#ccc;
            font-size: 1.3rem;
            span{
                color:#FFB104;
            }
        }
    }
    .meal_list:nth-child(n+2){
        margin-left: 2%;
    }
    .meal_list_active{
        border-color: #FFB104;
        .meal_title{
            color:#FFB104;
        }
        .meal_sub_title{
            color:#FFB104;
        }
    }
    .agreement{
        text-align: center;
        margin: 4rem 0 9rem;
        color:#ccc;
        span{
            color:#2BE0B0;
        }
    }
}
.modal_outer{
    padding: 2rem 4rem;
    text-align: center;
    p:nth-child(1){
        color:#ccc;
        margin-bottom: 1rem;
    }
    p:nth-child(2){
        font-size: 2.6rem;
        font-weight: bold;
    }
    input{
        width: 100%;
        border: none;
        background: #F9F8FD;
        padding: 1.2rem 2rem;
        border-radius: 5px;
        font-size: 1.8rem;
        text-align: center;
        margin: 2.6rem 0;
    }
}
.close{
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
}
</style>