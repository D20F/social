import { pog } from "@/servers/blockChain";
import CryptoAES from '@/util/CryptoAES';
import CryptoAESChat from '@/util/CryptoAES-chat';
import dataBase from '@/common/js/dataBase.js'
import time from '@/common/js/time.js'

// chat页面  聊天
var mixin = {
    methods: {
        // 发送消息 
        async sendMessage() {
            /**
             * 加密过程一
             * @param {string} this.fromPublicKey 接收方的公钥
             * @param {string} this.sendText 明文信息
             */
            let encrypt_one = CryptoAESChat.encryptMsg(this.fromPublicKey, this.sendText)
            // 加密过程二    再加密  
            let encrypt_two = this.encodeBase(encrypt_one);
            /**
             * 加密过程三
             * @param {string} this.friendAccount 接收方的名称
             * @param {string} this.$storage.get("current_wallet").key 发送信息需要的key
             */
            let encrypt_three = CryptoAESChat.encrypt(this.friendAccount + ':' + encrypt_two, this.$storage.get("current_wallet").key);
            let content = this.sendText;
            let createTime = new Date();
            //缓存的
            let info = {
                id: time.time_stamp(createTime),
                from: this.account,
                to: this.friendAccount,
                content: this.encodeBase(content),
                state: 1,
                create_time: time.time_stamp(createTime),
            };
            // 页面的
            let infos = {
                id: time.time_Data(createTime),
                from: this.account,
                to: this.friendAccount,
                content: this.sendText,
                state: 1,
                create_time: time.time_Data(createTime),
            };
            this.history.push(infos);   //添加到当前页面的聊天记录
            this.sendText = "";
            this.toScrollBottom();
            // 保存进表
            dataBase.add(this.$store.state.dataBase,this.friend,info);
            //发送状态保存感叹号    --  到时候再改为异步  
            try {
                this.$store.commit('pursecard_animateFun', true);
                this.$toast.loading({duration: 0, message: '加密发送中'})
                pog.send.sendMessage({
                    contract: "socialchat",
                    msg: encrypt_three,
                    from: this.account,
                    privateKeyList: [this.decryptPrivateKey]
                }).then((val)=>{
                    this.$toast.clear();
                    this.$toast.success({duration:1000,message:'发送成功'});
                    this.$store.commit('pursecard_animateFun', false);
                })
            } catch (error) {
                this.$toast.fail({duration:1000,message:'发送失败'});
                this.$store.commit('pursecard_animateFun', false);
                infos.state = 0;
                await dataBase.replace(this.$store.state.dataBase,this.friend,'create_time',info.create_time,['state'],[0]);
                console.log(error)
            }
        },
        async init(){
            let data = await dataBase.readAll(this.$store.state.dataBase,this.friend);
            this.history = JSON.parse(JSON.stringify(data)) ;
            // 解密
            for(let item of this.history){
                let content = this.decrypt_msg(item);
                item.content = content;
                item.create_time = time.time_Data(item.create_time);
            }
            this.toScrollBottom();  
        },
        async updata(){
            // 获取表中数据数量
            let req = await dataBase.get_count(this.$store.state.dataBase,this.friend);
            if(req > this.history.length){
                var data = [];
                var i = this.history.length+1;
                // 取出当前页面没有的条数的表数据
                for(i; i < req + 1; i++){
                    let get_data = await dataBase.get_main(this.$store.state.dataBase,this.friend,i);
                    data.push(get_data)
                }
                for(let item of data){
                    let content = this.decrypt_msg(item);
                    item.content = content;
                    item.create_time = time.time_Data(item.create_time);
                }
                this.history = this.history.concat(data);
                this.toScrollBottom();  
            }
        },
        // 退出重置保存未读条数并且更新聊天页面的缓存
        async back(){
            if(this.history.length == 0){
                return  this.$router.go(-1);
            }
            let chat = await dataBase.get_index(this.$store.state.dataBase,'chatCurrent','name',this.friend);
            let content = this.encodeBase(this.history[this.history.length-1].content);
            let that = this;
            // 没有此用户的当前缓存
            if(chat == undefined){
                let info = {
                    name: this.friend,
                    account: this.friend,
                    info: content ,
                    date: this.history[this.history.length-1].create_time,
                    onTop: false,
                    count: 0
                }
                let request = dataBase.add(this.$store.state.dataBase,'chatCurrent',info);
                request.onsuccess = function (event) {
                    that.$router.go(-1);
                };
            }else{
            // 有此用户的当前缓存
                let info = {
                    name: this.friend,
                    account: this.friend,
                    info: content ,
                    date: this.history[this.history.length-1].create_time,
                    onTop: false,
                    count: 0,
                    index: chat.index,
                    remark: chat.remark
                }
                let request = dataBase.update(this.$store.state.dataBase,'chatCurrent',info);
                request.onsuccess = function (event) {
                    that.$router.go(-1);
                };
            }
        },
        // 判断是否为表情
        isImg(content){
            // 点击[http://pinyin.cn/xxx]查看表情
            // [早上好],点击[ http://pinyin.cn/e136021 ]查看表情
            // let bStr = content.substring(0, 3);
            // let lStr = content.substring(content.length, content.length-5);
            // if (bStr == '点击[' && lStr == ']查看表情'){
            if (content.indexOf("点击[") != -1 && content.indexOf("]查看表情") != -1){
                return 1;
            }else{
                return 0;
            }
        },
        // 解码表情地址
        getImgUrl(content){
            let strRegex = "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";
            let regex = new RegExp(strRegex);
            let strs = regex.exec(content);
            // console.log(strs)
            if (!strs){
                return content;
            }
            return strs[0];
        },
        // 获取对方公钥
        async getFromPublicKey(){
            let val = await pog.read.getAccount(this.friendAccount)
            this.fromPublicKey = val.permissions[0].required_auth.keys[0].key;
        },
        // 获取自己解密后的私钥
        getDecryptPrivateKey(){
            this.decryptPrivateKey = CryptoAES.decrypt(this.$store.state.currentWallet.privateKey, this.$store.state.currentWallet.password);

        },
        // 聊天消息大于6条进来时滚动到底部
        toScrollBottom(){
            if(this.history.length > 6){
                this.$nextTick(() => {
                    let height = this.$el.querySelector('#chat').scrollHeight;
                    window.scrollTo({ top: height });
                })
            }
        },
        // 加密方法
        encodeBase(val){
            return btoa(unescape(encodeURIComponent(val)));
        },
        // 解密方法
        escapeBase(val){
            // return decodeURIComponent(escape(atob(val)))
            try{
                let content = decodeURIComponent(escape(atob(data.content)));
                return content;
            }catch(err){
                return data.content;
            }
        },
        // 去聊天设置页
        toConfig() {
            this.$router.push({ name: "ChatConfig", query:{data:{name:this.friend,remark:this.remark}}});
        },
        //解密
        decrypt_msg(data){
            try{
                let content = decodeURIComponent(escape(atob(data.content)));
                return content;
            }catch(err){
                return data.content;
            }
        },
        // 获取所有存在的聊天记录姓名
        getAllchatName() {
            let allFrom = [];
            let chatRecord = this.$storage.get('chatRecord');
            let account = this.$storage.get("current_wallet").name;
            if (chatRecord[account] == undefined) {
                return allFrom
            } else {
                for (let item in chatRecord[account]) {
                    allFrom.push(chatRecord[account][item].name);
                }
                return allFrom;
            }
        },
        // 控制显示工具栏
        showMenuFun(mode){
            if(mode){
                this.showMenu = true;
                this.spread = 8;
                this.toScrollBottom();
            }else{
                this.spread = 0;
                this.showMenu = false;
                this.toScrollBottom();
            }
        },
        // 焦点事件控制长度   
        spread_focus(){
            this.spread = 21;
            this.toScrollBottom();
        },
        // 焦点事件控制长度        
        spread_blur(){
            this.spread = 0;
            this.toScrollBottom();
        }
    },
    watch: {
        '$store.state.update_status': function (newQuestion, oldQuestion) {
            console.log('chat触发咯');
            this.updata();
        }
    },
    computed:{

    }
}
export default mixin;



