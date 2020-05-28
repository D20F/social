<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.push({name:'Linkman'})}">
          <van-icon name="arrow-left" />
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="user">
        <div class="user_image">
            <img class="img_tile" src="@/assets/images/header.png" alt="">
        </div>
        <div class="user_info">
            <p>{{ userInfo.remark === undefined ? "无备注" : userInfo.remark}}</p>
            <p>账号：{{userInfo.account}}</p>
            <p>标签：{{userInfo.tab === '' ? "无标签" : userInfo.tab}}</p>
        </div>
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <!-- 操作菜单 -->
    <div class="menu">
        <cell title="设置备注" is-link :value="userInfo.remark" @click="jumpRouter('RemarkSet',$route.query);"/>
        <cell title="加入黑名单">
            <van-switch v-model="userInfo.blacklist" 
                        slot="right-icon" 
                        size="2.2rem"
                        active-color="#2BE0B0"  />
        </cell>
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
            发消息
        </van-button>
        <van-button round 
                    type="default" 
                    @click="del" 
                    block>
            删除
        </van-button>
    </div>
 </div>
</template>
<script>
import { Cell } from 'vant';
import dataBase from '@/common/js/dataBase.js'

export default {
    components:{Cell},
    data(){
        return {
            userInfo:{
                name:"",
                account:"",
                remark:"",
                id:"1",
                blacklist:false,
                tab:'',
            }
        }
    },
    methods:{
        async init(){
            this.userInfo.name = this.$route.query.name;
            this.userInfo.account = this.$route.query.account;
            this.userInfo.remark = this.$route.query.remark;
            // 查找标签分组，只分配第一个找到的标签
            let list = await dataBase.readAll(this.$store.state.dataBase,'tagList');
            for (let item of list) {
                for (let i of item.data) {
                    if(i.name == this.userInfo.name){
                        return this.userInfo.tab = item.name;
                    }
                }
            }
        },
        // 删除好友
        del(){
            this.$dialog.confirm({
                title: '提示',
                message: '是否删除好友'
            }).then(() => {
            // on confirm
            }).catch(() => {
            // on cancel
            });
        },
        // 去发送消息
        toSend(){
            let query = {
                name:this.userInfo.name,
                account:this.userInfo.account
            }
            this.$router.push({path:"/chat",query:this.$route.query});
        },
        jumpRouter(name,data){
            this.$router.push({ name: name, query: { data: data }});
        },
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