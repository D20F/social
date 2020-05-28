<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
          <van-icon name="arrow-left" />
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="user">
        <div class="user_image">
            <img class="img_tile" src="@/assets/images/header.png" alt="">
        </div>
        <div class="user_info">
            <p>{{userInfo.name}}</p>
            <p>账号：{{userInfo.number}}</p>
        </div>
    </div>
    <!-- 验证信息 -->
    <div class="verify">
            <div>验证信息</div>
            <div>{{userInfo.verify}}</div>
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <!-- 操作菜单 -->
    <div class="menu">
        <cell title="设置备注" is-link :value="userInfo.remark" />
        <cell title="设置标签" is-link :value="userInfo.tab" />
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <div class="bottom_btn">
        <van-button round 
                    style="margin-bottom:2rem" 
                    type="primary" 
                    @click="pass"
                    block>
            添加到联系人
        </van-button>
        <van-button round 
                    type="default" 
                    @click="refuse" 
                    block>
            拒绝
        </van-button>
    </div>
  </div>
</template>
<script>
import { Cell } from 'vant';
export default {
    components:{Cell},
    data(){
        return{
            userInfo:{
                name:"Shophia",
                number:"alk_0032",
                verify:"我是某某某，王阿姨介绍的，请添 加我为好友",
                remark:"Shophia",
                id:"1",
                tab:"",
            }
        }
    },
    methods:{
        refuse(){
            this.$dialog.confirm({
                title: '提示',
                message: '是否拒绝对方的添加申请。'
            }).then(() => {
            // on confirm
            }).catch(() => {
            // on cancel
            });
        },
        pass(){
            this.$router.push({path:"/addSuccess"})
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.user{
    padding: 1.8rem 1.2rem;
    .user_image{
        width: 6rem;
        height: 6rem;
        display: inline-block;
        img{
            border-radius: 50%;
        }
    }
    .user_info{
        width: 16rem;
        height: 6rem;
        display: inline-block;
        vertical-align: top;
        margin: .5rem 2rem;
        p:nth-child(1){
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.4rem;
        }
        p:nth-child(2){
            font-size: 1.3rem;
            color: #ccc;
        }
    }
}
.verify{
    padding:0 1.2rem;
    margin-bottom: 2rem;
    div{
        display: inline-block;
        font-size: 1.5rem;
    }
    div:nth-child(1){
        font-weight: bold;
        margin-right: 2rem;
    }
    div:nth-child(2){
        vertical-align: top;
        width: 25rem;
        color: #ccc;
    }
}
.menu{
    padding: 1.5rem 0;
}
.bottom_btn{
    padding: 5.8rem 1.2rem;
}
</style>
