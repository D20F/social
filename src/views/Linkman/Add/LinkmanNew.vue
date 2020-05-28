<template>
  <div>
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="()=>{this.$router.back(-1)}">
        <van-icon name="arrow-left" />
        <span style="margin-left:.5rem">新的联系人</span>   
      </div>
      <div class="right_text" @click="toAdd">
        <img class="img_tile" src="@/assets/images/icon_add.png" alt srcset />
      </div>
    </div>
    <search class="search_style" v-model="search_value" shape="round" placeholder="请输入搜索关键词" />
    <!-- 新的联系人 -->
    <div class="person_box">
      <p class="title">新的联系人</p>
      <div class="friend_list" v-for="(item,index) in new_person" :key="index">
        <div class="friend_image">
          <img class="img_tile" src="@/assets/images/header.png" alt srcset />
        </div>
        <div class="friend_info">
          <div class="friend_name">{{item.personName}}</div>
          <div class="friend_number">{{item.userNumber}}</div>
        </div>
        <van-button class="friend_btn" round type="primary" size="small" @click="toInfo">查看</van-button>
      </div>
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <!-- 已经添加过的联系人 -->
    <div class="person_box" style="padding-bottom:0" v-for="(item,index) in old_request" :key="index">
      <p class="title">{{item.group}}</p>
      <div class="friend_list" v-for="(child,childIndex) in item.list" :key="childIndex">
        <div class="friend_image">
          <img class="img_tile" src="@/assets/images/header.png" alt srcset />
        </div>
        <div class="friend_info">
          <div class="friend_name">{{child.personName}}</div>
          <div class="friend_number">{{child.userNumber}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Search } from "vant";
export default {
  components: { Search },
  name: "LinkmanNew",
  data() {
    return {
      search_value: "",
      new_person: [
        {
          personId: "1",
          personName: "Shophia",
          userNumber: "alk_0032"
        }
      ],
      old_request: [
        {
          group: "一天前添加",
          list: [
            {
              personId: "4",
              personName: "Tony",
              userNumber: "alk_0036"
            },
            {
              personId: "5",
              personName: "Michal",
              userNumber: "alk_0037"
            }
          ]
        },
        {
          group: "两天前添加",
          list:[
            {
              personId: "3",
              personName: "Scholar",
              userNumber:"alk_0034"
            }
          ]
        }
      ]
    };
  },
  methods:{
    toInfo(){
      this.$router.push({path:"/linkmanNewInfo"})
    },
    toAdd(){
      this.$router.push({path:"/linkmanAdd"})
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/common/css/page_title.scss";
.search_style {
  margin: 0.5rem 0 0.8rem;
}
.person_box {
  padding: 1.2rem;
  .title {
    color: #a3a3a5;
    font-size: 1.4rem;
  }
  .friend_list {
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
    .friend_btn {
      width: 6rem;
      height: 3rem;
      vertical-align: top;
      margin-top: 2rem;
      float: right;
    }
  }
}
</style>