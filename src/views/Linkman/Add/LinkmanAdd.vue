<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
        <van-icon name="arrow-left" />
        <span style="margin-left:.5rem">添加联系人</span>   
      </div>
      <div class="right_text">
        <van-icon name="scan" size="2.4rem" />
      </div>
    </div>
    <!-- 搜索 -->
    <search class="search_style" 
            v-model="search_value" 
            shape="round" 
            @search="searchFriend"
            placeholder="搜索钱包账号" />
    <!-- 筛选出来的人 -->
    <div>
        <div v-if="friend.account !== ''" class="friend" @click="toInfo">
            <div class="friend_image">
                <img class="img_tile" src="@/assets/images/header.png" alt srcset />
            </div>
            <div class="friend_info">
            <div class="friend_name">{{friend.name}}</div>
            <div class="friend_number">{{friend.account}}</div>
            </div>
        </div>
    </div>
 </div>
</template>
<script>
import { Search } from "vant";
import { pog } from '@/servers/blockChain';
import dataBase from '@/common/js/dataBase.js'

export default {
  components: { Search },
    data(){
        return {
          search_value:"",
          friend:{
            name:"",
            account:"",
            publicKey:"",
          }
        }
    },
    methods:{
        async toInfo(){
          let groupName = await dataBase.readAll(this.$store.state.dataBase,'contactPerson');
          var query = {
            name:this.friend.name,
            account:this.friend.account,
            publicKey:this.friend.publicKey,
          }
          if(this.currentWallet.name == this.friend.name){
              this.$toast("不可以添加自己为好友"); 
          }else if(groupName.indexOf(this.friend.name) === 1){
              this.$toast("不可以重复添加好友"); 
          }else{
            this.$router.push({path:"/linkmanAddInfo",query:query})
          }
        },
        // 查询联系人
        async searchFriend(){
          if(!this.search_value){
            this.$toast("请输入钱包号");return 
          }
          try{
            let user = await pog.read.getAccount(this.search_value);
            let info = {
              name:user.account_name,
              account:user.account_name,
              publicKey:user.permissions[0].required_auth.keys[0].key,
            }
            this.friend = info;
          }catch(e){
            let info = {name:"",account:"",publicKey:"",};
            this.friend = info;
            this.$toast("无对应用户信息");return 
          }
          
        },
    },
    computed:{
        currentWallet() {
          return this.$store.state.currentWallet 
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.search_style {
  margin: 0.5rem 0 0.8rem;
}
  .friend {
    padding: 1.2rem;
    .friend_image {
      display: inline-block;
      width: 5rem;
      height: 5rem;
      img {
        border-radius: 8%;
      }
    }
    .friend_info {
      width: 16rem;
      display: inline-block;
      vertical-align: top;
      margin: 0 1.4rem;
      .friend_name {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 0.2rem;
        margin-bottom: 1rem;
      }
      .friend_number {
        font-size: 1.5rem;
        color: #b2b2b2;
      }
    }
  }
</style>
