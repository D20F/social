import { pog } from '@/servers/blockChain';
import groupJson from "@/common/js/group.js";
import { format, parse } from "date-fns";
import dataBase from '@/common/js/dataBase.js'
import time from '@/common/js/time.js'

// home页面
var mixin = {
    methods: {
      async init(){
        // 获取聊天缓存然后解密格式
        let data = await dataBase.readAll(this.$store.state.dataBase,'chatCurrent');
        let top = []; let base = [];
        for (let item of data) {
          let content = decodeURIComponent(escape(atob(item.info)));
          item.date = format(parse(time.time_Data(item.date)),'HH:mm');
          item.info = this.isImg(content) ? '[图片]' : content;
          if(item.onTop){
            top.push(item)
          }else{
            base.push(item)
          }
        }
        base.sort((a, b)=>{
          return Number(b.count) - Number(a.count);
        })
        this.persionList = top.concat(base);
      },
      isImg(content){
        if (content.indexOf("点击[") != -1 && content.indexOf("]查看表情") != -1){
          return true;
        }else{
          return false;
        }
      },
      async updata(){  //暂时未优化，采用init

      },
      //获取 该name的公钥
      async getPublicKey(name){
        try{
          let user = await pog.read.getAccount(name);
          let publicKey = user.permissions[0].required_auth.keys[0].key;
          return publicKey
        }catch(e){
          this.$toast("无对应用户信息");return 
        }
      },
      // 删除聊天
      async delChat(item){
        await dataBase.remove(this.$store.state.dataBase,'chatCurrent','name',item.name,true);
        this.init();
      },
      // 置顶聊天 
      async topChat(item){
        await dataBase.replace(this.$store.state.dataBase,'chatCurrent','name',item.name,['onTop'],[true]);
        this.init();
      },
      // 取消置顶聊天 
      async cancelChat(item){
        await dataBase.replace(this.$store.state.dataBase,'chatCurrent','name',item.name,['onTop'],[false]);
        this.init();
      },
      // 去充值页
      toTopUp(){
        this.$router.push({path:"/topUp"});
      },
      // 去聊天页
      toChat(item){
        let query = {
          name:item.name,
          account:item.account,
          remark:item.remark
        }
        this.$router.push({path:"/chat",query:query});
      },
      // 去添加联系人页
      toAdd(){
        this.$router.push({path:"/linkmanAdd"});
      },
    },
    watch: {
      '$store.state.update_status': function (newQuestion, oldQuestion) {
        console.log('home触发咯')
        this.init();
      }
    },
    computed:{

    }
}
export default mixin;