<template>
  <div class="page_box">
    <!-- 顶部信息 -->
    <div class="page_title">
      <div class="left_text" @click="back">
        <van-icon name="arrow-left" />
        <span class="title_text">{{remark || friend}}</span>
      </div>
      <div class="right_text" @click="toConfig">
        <van-icon name="wap-nav" size="2.5rem" />
      </div>
    </div>
    <!-- 聊天内容 -->
    <div class="chat_box" id="chat">
      <div v-for="(item,index) in history" :key="index" class="chat_list">
        <!-- 自己的消息 -->
        <div class="self_message" v-if="item.from === account">
          <!-- 头像 -->
          <div class="header_img">
            <img class="img_tile" src="@/assets/images/header.png" alt />
          </div>
          <!-- 表情图片 -->
          <div class="message" v-if="isImg(item.content)">
              <img :src="getImgUrl(item.content)" />
          </div>
          <!-- 发送的信息 -->
          <div class="message" v-else>{{item.content}}</div>
          <!-- 发送失败感叹号 -->
          <div class="sigh" v-if="item.state == 0"><img src="@/assets/img/sigh.png" /></div>
          <div class="send_time">{{item.create_time}}</div>
        </div>
        <!-- 别人的消息 -->
        <div class="outer_message" v-else>
          <!-- 头像 -->
          <div class="header_img">
            <img class="img_tile" src="@/assets/images/header.png" alt />
          </div>
          <!-- 表情图片 -->
          <div class="message" v-if="isImg(item.content)">
              <img :src="getImgUrl(item.content)" />
          </div>
          <!-- 发送的信息 -->
          <div class="message" v-else>{{item.content}}</div>
          <div class="send_time">{{item.create_time}}</div>
        </div>
      </div>
      <div :style="{ margin: spread + 'rem' }"></div>
    </div>
    <!-- 发送消息内容 -->
    <div class="send_box">
      <div class="left_btn">
        <img class="img_tile" src="@/assets/images/icon_voice.png" alt />
      </div>
      <div class="send_text">
        <input :style="{width:(sendText === '' ? '26rem':'23rem')}" type="text" v-model="sendText" @blur="spread_blur()" @focus="spread_focus()"/>
      </div>
      <div class="right_more">
        <van-icon
          v-if="sendText === '' && !showMenu"
          name="add-o"
          size="3rem"
          @click="showMenuFun(true)"
        />
        <van-icon
          v-else-if="sendText === '' && showMenu"
          name="add"
          color="#29E1AE"
          size="3rem"
          @click="showMenuFun(false)"
        />
        <van-button v-else type="primary" size="small" @click="sendMessage">发送</van-button>
      </div>
      <div v-if="showMenu" class="menu">
        <ul class="menu_ul">
          <li>
            <div class="menu_image">
              <img class="img_tile" src="@/assets/images/icon_image.png" alt />
            </div>
            <p>图片</p>
          </li>
          <li>
            <div class="menu_image">
              <img class="img_tile" src="@/assets/images/icon_video.png" alt />
            </div>
            <p>视频</p>
          </li>
          <li>
            <div class="menu_image">
              <img class="img_tile" src="@/assets/images/icon_file.png" alt />
            </div>
            <p>文件</p>
          </li>
          <li>
            <div class="menu_image">
              <img class="img_tile" src="@/assets/images/icon_music.png" alt />
            </div>
            <p>音乐</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Search } from "vant";
import { pog } from "@/servers/blockChain";
import groupJson from "@/common/js/group.js";
import CryptoAES from '@/util/CryptoAES';
import CryptoAESChat from '@/util/CryptoAES-chat';
import chat_logic from "@/mixins/chat_logic.js";



export default {
  name: "chat",
  components: { Search },
  mixins:[chat_logic], //复杂逻辑全部都在chat_logic
  data() {
    return {
      sendText: "",
      friend: this.$route.query.name,
      remark: this.$route.query.remark,
      friendAccount: this.$route.query.account,
      showMenu: false,
      privateKey: this.$storage.get("current_wallet").privateKey,
      account: this.$storage.get("current_wallet").name,
      history: [],      //页面用history   
      interval: "",
      fromPublicKey: "",
      decryptPrivateKey: "",
      spread: 0,
    };
  },
  methods: {

  },
  async created(){
    //获取接收方的公钥
    await this.getFromPublicKey();      
    // 获取自己解密后的私钥
    this.getDecryptPrivateKey();  
    // 初始化
    this.init();
    this.toScrollBottom();
    // console.log(this.history)
  },
  watch: {
    sendText(newVal, oldVal) {
      // 如果是表情图片直接发送
      if(this.isImg(newVal)){
        this.sendMessage();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page_box{
  overflow-x: hidden;
}
.page_title {
  height: 5.5rem;
  padding: 1.8rem 1.2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 90;
  .left_text {
    line-height: 3rem;
    font-size: 1.5rem;
    display: inline-block;
    width: 50%;
  }
  .right_text {
    float: right;
    width: 2.5rem;
    height: 2.5rem;
  }
}
.title_text {
  margin-left: 0.5rem;
  display: inline-block;
  vertical-align: top;
}
.chat_box {
  min-height: 100vh;
  margin-top: 5.5rem;
  margin-bottom: 6rem;
  background: #f9f8ff;
  padding: 3rem 1.2rem;
  .chat_list {
    .self_message {
      margin-bottom: 1rem;
      .header_img {
        width: 4rem;
        height: 4rem;
        float: right;
        img {
          border-radius: 50%;
        }
      }
      .message {
        background: #29e1ae;
        color: white;
        vertical-align: top;
        margin-right: 1.4rem;
        padding: 1.2rem;
        border-radius: 5px;
        max-width: 26rem;
        position: relative;
        float: right;
        font-size: 1.4rem;
      }
      .message::after {
        content: "";
        width: 0.8rem;
        height: 0.8rem;
        background: #29e1ae;
        position: absolute;
        right: -0.3rem;
        top: 0.4rem;
        transform: rotate(47deg);
      }
      .send_time {
        margin-right: 5.5rem;
        color: #ccc;
        clear: both;
        text-align: right;
        padding-top: 0.4rem;
      }
    }
    .outer_message {
      margin-bottom: 1rem;
      .header_img {
        width: 4rem;
        height: 4rem;
        display: inline-block;
        img {
          border-radius: 50%;
        }
      }
      .message {
        display: inline-block;
        background: #fff;
        vertical-align: top;
        margin-left: 1.4rem;
        padding: 1.2rem;
        border-radius: 5px;
        max-width: 26rem;
        position: relative;
        font-size: 1.4rem;
      }
      .message::after {
        content: "";
        width: 0.8rem;
        height: 0.8rem;
        background: white;
        position: absolute;
        left: -0.4rem;
        top: 0.4rem;
        transform: rotate(47deg);
      }
      .send_time {
        margin-left: 5.5rem;
        color: #ccc;
        margin-top: 0.4rem;
      }
    }
  }
}
.send_box {
  padding: 1.2rem;
  // height: 6rem;
  background: white;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  .left_btn {
    width: 3rem;
    height: 3rem;
    display: inline-block;
  }
  .send_text {
    display: inline-block;
    vertical-align: top;
    input {
      width: 23rem;
      height: 3rem;
      border: none;
      background: #f9f8fd;
      border-radius: 50px;
      margin: 0 1.2rem;
      font-size: 1.4rem;
      padding: 0 1rem;
    }
  }
  .right_more {
    float: right;
  }
  .menu {
    height: 10rem;
    .menu_ul {
      li {
        width: 24.8%;
        display: inline-block;
        padding: 2rem;
        text-align: center;
        .menu_image {
          width: 3rem;
          height: 3rem;
          margin: 0 auto 0.5rem;
        }
      }
    }
  }
}
.sigh{
  width: 4rem;
  height: 4rem;
  float: right;
}
.sigh img{
  width: 80%;
  margin-top: 10%;
}

</style>