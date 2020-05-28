<template>
  <div class="home">
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text">信息</div>
      <div class="right_text">
        您还能试用4天
        <span class="topup_btn" @click="toTopUp">充值</span>
      </div>
    </div>
    <!-- 筛选框 -->
    <search class="search_style" 
            v-model="search_value" 
            shape="round" 
            placeholder="请输入搜索关键词" />
    <!-- 聊天列表 -->
    <div class="person_box" v-if="persionList.length > 0">
      <swipe-cell v-for="(item,index) in persionList" 
                  :key="index"
                  class="person_list">
        <div class="person_card" @click="toChat(item)">
          <div class="person_image">
              <img class="img_tile" src="../assets/images/header.png" alt="">
          </div>
          <div class="person_info">
            <div class="person_name">{{item.remark || item.name}}</div>
            <div class="person_send">{{item.info}}</div>
          </div>
          <div class="person_outer">
            <div class="send_date">
              {{item.date}}
            </div>
            <div class="count" v-if="item.count > 0">
              {{item.count}}
            </div>
          </div>
        </div>
        <template slot="right">
          <van-button
            v-if="item.onTop"
            square
            text="取消置顶"
            type="primary"
            class="delete-button"
            @click="cancelChat(item,index)"
          />
          <van-button
            v-else
            square
            text="置顶"
            type="warning"
            class="delete-button"
            @click="topChat(item,index)"
          />
          <van-button
            square
            text="删除"
            type="danger"
            @click="delChat(item,index)"
            class="delete-button"
          />
        </template>
      </swipe-cell>
    </div>
    <div class="no_person" v-else>
      <div class="no_image">
        <img class="img_tile" src="@/assets/images/linkman.png" alt="">
      </div>
      <div class="no_text">暂无聊天信息,去添加联系人吧。</div>
      <van-button size="small"
                  type="primary" 
                  @click="toAdd">
            添加联系人
      </van-button>
    </div>
  </div>
</template>

<script>
// 筛选框 滑动单元格
import { Search ,SwipeCell } from 'vant';
import { pog } from '@/servers/blockChain';
import CryptoAESChat from '@/util/CryptoAES-chat';
import home_logic from "@/mixins/home_logic.js";

export default {
  components:{Search,SwipeCell},
  name: 'Home',
  mixins:[home_logic], //复杂逻辑全部都在home_logic
  data(){
    return {
      search_value:"",
      account:this.$storage.get("current_wallet").name,
      interval:"",
      persionList:[],
    }
  },
  // 过滤器
  filters:{
  
  },
  methods:{
    
  },
  created() {
    // 初始化
    this.init();
  },
  beforeDestroy(){
    
  }
}
</script>
<style scoped lang="scss">
.home{
  width: 100%;
  height: 100%;
}
  .page_title{
    height: 5.2rem;
    padding: 1.8rem 1.2rem;
    position: relative;
    z-index: 3;
    background: #fff;
    .left_text{
      line-height: 3rem;
      font-size: 1.5rem;
      display: inline-block;
      width: 50%;
    }
    .right_text{
      display: inline-block;
      width: 50%;
      text-align: right; 
      background: #F8F9FF;
      border-radius: 50px;
      height: 2.5rem;
      line-height: 2.6rem;
      color:#9E9FA3;
      font-size: 1.2rem;
      .topup_btn{
        background: #FFB401;
        color: white;
        height: 2.5rem;
        display: inline-block;
        border-radius: 50px;
        padding: 0 1.8rem;
        margin-left: .4rem;
      }
    }
  }
  .search_style{
    position: relative;
    background: #fff;
    z-index: 5;
  }
  .person_box{
    overflow-y: scroll;
    height: 78%;
    .person_list{
      margin-bottom: .5rem;
      .person_card{
        height: 8rem;
        padding: .8rem 1rem;
      }
      .person_image{
        display: inline-block;
        width: 5.8rem;
        height: 5.8rem;
        img{
          border-radius: 5px;
        }
      }
      .person_info{
        display: inline-block;
        vertical-align: top;
        width: 21.2rem;
        margin: 0 .8rem;
        .person_name{
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: .5rem;
          margin-bottom: 1.3rem;
        }
        .person_send{
          font-size: 1.4rem;
          color: #B2B2B2;
          overflow:hidden; //超出的文本隐藏
          text-overflow:ellipsis; //溢出用省略号显示
          white-space:nowrap; //溢出不换行
        }
      }
      .person_outer{
        display: inline-block;
        vertical-align: top;
        width: 6.2rem;
        .send_date{
          color:#747474;
          font-size: .9rem;
          text-align: right;
        }
        .count{
          background: #DF4B4A;
          width: 2rem;
          text-align: center;
          height: 2rem;
          line-height: 2rem;
          color: wheat;
          border-radius: 50%;
          float: right;
          margin-top: 2rem;
        }
      }
      .delete-button{
        height: 8rem;
      }
    }
    
  }
  .no_person{
    text-align: center;
    color:#ccc;
    font-size: 1.4rem;
    padding:5rem;
    .no_image{
      width: 8rem;
      height: 8rem;
      margin:8rem auto 0;
    }
    .no_text{
      margin: 2rem 0;
    }
  }
</style>