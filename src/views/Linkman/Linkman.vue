<template>
  <div class="pageBox">
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text">联系人</div>
      <div class="right_text" @click="toAdd">
        <img class="img_tile" src="@/assets/images/icon_add.png" alt srcset />
      </div>
    </div>
    <!-- 筛选框 -->
    <search class="search_style" 
            v-model="search_value" 
            shape="round" 
            placeholder="请输入搜索关键词" />
    <!-- 功能菜单 -->
    <div class="menu">
      <div class="menu_list" @click="toLinkmanNew">
        <div class="menu_icon">
          <img class="img_tile" src="@/assets/images/icon_new.png" alt srcset />
        </div>
        <div class="menu_text">新的联系人</div>
        <div class="menu_count" v-if="newPerson>0 ">{{newPerson}}</div>
      </div>
      <div class="menu_list" @click="toTab">
        <div class="menu_icon">
          <img class="img_tile" src="@/assets/images/icon_tab.png" alt srcset />
        </div>
        <div class="menu_text">标签</div>
      </div>
    </div>
    <!-- 划分线 -->
    <div class="line"></div>
    <index-bar v-if="Object.keys(friendList).length > 0" style="margin-bottom:5rem">
      <template v-for="(item,index) in friendList">
        <index-anchor :index="index" :key="index"/>
        <div class="friend_list"  
             v-for="(child,childIndex) in item"
             :key="index+'-'+childIndex"
             @click="toInfo(child)">
            <div class="friend_image">
                <img class="img_tile" 
                     src="@/assets/images/header.png" 
                     alt="" 
                     srcset="">
            </div>
            <div class="friend_info">
                <div class="friend_name">{{child.remark || child.name}}</div>
                <div class="friend_number">{{child.account}}</div>
            </div>
        </div>
      </template>
    </index-bar>
    <div class="nothing" v-else>
        <div>
            <img class="img_tile" src="@/assets/images/nothing.png" alt="">
        </div>
        暂无联系人信息
    </div>
  </div>
</template>
<script>
import { Search, SwipeCell, IndexBar, IndexAnchor } from "vant";
import dataLetterSort from "@/common/js/letter.js";
import dataBase from '@/common/js/dataBase.js'

export default {
  components: { Search, SwipeCell, IndexBar, IndexAnchor },
  data() {
    return {
      newPerson: 1,
      search_value: "",
      friendList: []
    };
  },
  methods:{
      async init(){
        let linkman = await dataBase.readAll(this.$store.state.dataBase,'contactPerson');
        if(JSON.stringify(linkman) !== '[]'){
          this.friendList = dataLetterSort(linkman,"name");
        }else{
          this.friendList=[]
        }
      },
      toLinkmanNew(){
        this.$router.push({path:"/linkmanNew"}) 
      },
      toInfo(item){
        this.$router.push({path:"/linkmanInfo",query:item})
      },
      toAdd(){
        this.$router.push({path:"/linkmanAdd"})
      },
      toTab(){
        this.$router.push({path:"/tagCenter"})
      }
  },
  created(){
    this.init();
  }
};
</script>
<style scoped lang="scss">
@import "@/common/css/page_title.scss";
.search_style {
  margin: 0.5rem 0 0.8rem;
}
.pageBox{
  height: 100%;
  overflow: scroll;
}
.menu {
  padding: 1.2rem;
  .menu_list {
    margin-bottom: 0.5rem;
    .menu_icon {
      width: 5rem;
      height: 5rem; 
      display: inline-block;
    }
    .menu_text {
      display: inline-block;
      vertical-align: top;
      line-height: 4rem;
      margin: 0 2rem;
      font-size: 1.4rem;
      width: 20rem;
    }
    .menu_count {
      background: #df4b4a;
      width: 2rem;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      color: wheat;
      border-radius: 50%;
      float: right;
      margin-top: 1.5rem;
      margin-right: 1rem;
    }
  }
}
.friend_list{
    padding: 1.2rem;
      .friend_image{
          display: inline-block;
          width: 5rem;
          height: 5rem;
          img{
              border-radius:50%;
          }
      }
      .friend_info{
          width: 16rem;
          display: inline-block;
          vertical-align: top;
          margin: 0 1.4rem;
          .friend_name{
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: .5rem;
            margin-bottom: 1rem;
          }
          .friend_number{
            font-size: 1.5rem;
            color: #B2B2B2;
          }
      }
  }
.nothing{
  text-align: center;
  padding: 6rem 0;
  color: #ccc;
  font-size: 1.4rem;
  div{
    width: 9rem;
    height: 6rem;
    margin: 1rem auto;
  }
}
</style>