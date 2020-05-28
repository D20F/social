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
            <p>账号：{{userInfo.account}}</p>
        </div>
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <!-- 操作菜单 -->
    <div class="menu">
        <cell title="设置备注" is-link :value="userInfo.name" />
        <cell title="设置标签" is-link :value="tab" />
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <div class="bottom_btn">
        <van-button round 
                    icon="comment"
                    style="margin-bottom:2rem" 
                    type="primary" 
                    @click="toSend"
                    block>
            添加到联系人
        </van-button>
    </div>
 </div>
</template>
<script>
import { Cell } from 'vant';
export default {
    components:{Cell},
    data(){
        return {
            userInfo:{},
            tab:"",
        }
    },
    methods:{
        init(){
            this.userInfo = this.$route.query;
        },
        // 去发送消息
        toSend(){
            this.$router.push({path:"/addVerify",query:this.userInfo});
        }
    },
    created(){
        this.init()
    }
}
</script>
<style scoped lang="scss">
@import "@/common/css/page_title.scss";
.user{
    padding: 1.8rem 1.2rem 3rem;
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
        }
        p:nth-child(n+2){
            font-size: 1.3rem;
            margin-top: .5rem;
            color: #ccc;
        }
    }
}
.menu{
    padding: 1.5rem 0;
}
.bottom_btn{
    padding: 5.8rem 1.2rem;
}
</style>