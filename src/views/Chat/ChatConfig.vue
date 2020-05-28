<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
        <van-icon name="arrow-left" />
        <span style="margin-left:.5rem">聊天设置</span>   
      </div>
    </div>
    <div class="menu">
        <cell style="margin-top:2rem;margin-bottom:1rem" 
              :center="true" 
              :border="false"
              :title="userInfo.remark || userInfo.personName" 
              is-link >
            <div class="person_image" slot="icon">
                <img class="img_tile" src="@/assets/images/header.png" alt="">
            </div>
        </cell>
        <div class="line"></div>
        <div class="menu_box" >
            <cell title="查看聊天记录" is-link @click="jumpRouter('ChatRecord',userInfo.personName)"></cell>
        </div>
        <div class="line"></div>
        <div class="menu_box">   
            <cell title="消息免打扰">
                <van-switch v-model="userInfo.disturb" 
                            slot="right-icon" 
                            size="2.2rem"
                            active-color="#2BE0B0"  />
            </cell>
            <cell title="置顶聊天">
                <van-switch v-model="userInfo.haveFirst" 
                            slot="right-icon" 
                            size="2.2rem"
                            active-color="#2BE0B0"  />
            </cell>
            <cell title="提醒">
                <van-switch v-model="userInfo.remind" 
                            slot="right-icon" 
                            size="2.2rem"
                            active-color="#2BE0B0"  />
            </cell>
        </div>
        <div class="line"></div>
        <div class="menu_box">
            <cell title="清空聊天记录" @click="showClear" is-link></cell>
        </div>
    </div>
    <action-sheet
        v-model="showAction"
        :actions="actions"
        cancel-text="取消"
        @cancel="onCancel"
        @select="onSelect"/>
  </div>
</template>
<script>
import { Cell,ActionSheet  } from 'vant';
import dataBase from '@/common/js/dataBase.js'

export default {
    components:{Cell,ActionSheet},
    data(){
        return{
            showAction:false,
            actions:[{name:"清空聊天记录",color:"red"}],
            userInfo:{
                personId: "1",
                personName: "Shophia",
                userNumber: "alk_0032",
                haveFirst:false,
                remind:true,
                disturb:false,
                remark:'',
            }
        }
    },
    created(){
        this.userInfo.personName = this.$router.currentRoute.query.data.name;
        this.userInfo.remark = this.$router.currentRoute.query.data.remark;
    },
    methods:{
        showClear(){
            this.showAction = true;
        },
        onCancel(){
            this.showAction = false;
        },
        onSelect(e){
            this.showAction = false;
            dataBase.clear(this.$store.state.dataBase, this.userInfo.personName);
            this.$toast("聊天记录已清空")
        },
        jumpRouter(name,data){
            this.$router.push({ name: name, query: { data: data }});
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.person_image{
    width: 4rem;
    height: 4rem;
    margin-right: 2rem;
    img{
        border-radius: 50%;
    }
}
.menu_box{
    padding: 1rem 0;
}
</style>