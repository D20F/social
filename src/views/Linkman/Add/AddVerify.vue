<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
        <van-icon name="arrow-left" />
        <span style="margin-left:.5rem">验证信息</span>   
      </div>
    </div>
    <div class="center">
        <p class="center_title">对方账户需要验证</p>
        <textarea rows="8" cols="30" placeholder="请输入验证信息..."></textarea>
    </div>
    <div class="bottom_btn">
        <van-button style="margin-bottom:2rem" 
                    type="primary" 
                    @click="sendVerify"
                    block>
            发送验证
        </van-button>
    </div>
  </div>
</template>
<script>
import dataBase from '@/common/js/dataBase.js'

export default {
    data(){
        return {

        }
    },
    methods:{
        async sendVerify(){
            this.$toast('已发送添加申请');
            let account = this.$storage.get("current_wallet").name;
            let version = this.$store.state.dataBase.version + 1;
            let that = this;
            //查询是否已经同步了聊天记录表 
            if(!(dataBase.check_list(this.$store.state.dataBase,this.$route.query.name))){
                //没有此用户的聊天记录表 关闭数据库
                await dataBase.close(this.$store.state.dataBase);
                //升级数据库，写入聊天记录表
                let request = dataBase.open_dataBase(account, version);
                request.onupgradeneeded = function (event) {
                    let db = event.target.result;
                    console.log(db)
                    // 数据库对象存入vuex
                    that.$store.commit('dataBaseFun', db);
                    console.log(that.$route.query.name)
                    // 新建对好友的聊天记录表 用index当做主键,create_time做索引
                    dataBase.created(db,that.$route.query.name,'index','create_time');
                }
                request.onsuccess = function (event) {
                // 将此用户写入联系人表
                    let saveData = {
                        name:that.$route.query.name,
                        account:that.$route.query.account,
                        publicKey:that.$route.query.publicKey,
                    }
                    dataBase.add(that.$store.state.dataBase,'contactPerson',saveData);
                    that.$router.push({path:"/linkman"});
                }
            }else{
                // 已经同步了聊天记录表，直接添加此用户到联系人表
                let saveData = {
                    name:this.$route.query.name,
                    account:this.$route.query.account,
                    publicKey:this.$route.query.publicKey,
                 }
                dataBase.add(this.$store.state.dataBase,'contactPerson',saveData)
                this.$router.push({path:"/linkman"})
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.center{
    padding: 2rem;
    .center_title{
        margin-top: 2rem;
        font-size: 1.4rem;
    }
    textarea{
        border: 0;
        background: #F9F8FF;
        width: 100%;
        border-radius: 5px;
        padding: 2rem;
        box-sizing: border-box;
        font-size: 1.4rem;
        margin-top: 1rem;
    }
}
.bottom_btn{
    padding: 5.8rem 2rem;
}
</style>