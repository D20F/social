import { pog } from "@/servers/blockChain";
import groupJson from "@/common/js/group.js";
import CryptoAESChat from '@/util/CryptoAES-chat';
import CryptoAES from '@/util/CryptoAES';
import { it } from "ethers/wordlists";
import { format, parse } from "date-fns";
import getversion from '@/common/js/getVersion.js'
import dataBase from '@/common/js/dataBase.js'
import { ping } from '@/servers/pushServer';
import time from '@/common/js/time.js'

var mixin = {
    data() {
        return {
            AppSetting: "resume",  //app所处前台还是后台   resume前台 pause后台  默认前台
        }
    },
    methods: {
        // 请求聊天信息
        async getMessage() {
            if (localStorage.getItem('current_wallet') == null) {
                return  // console.log("现在还没有钱包导入，不能请求");
            }

            if (this.beRouter) {
                return  // console.log("在登陆导入创建页面不请求");
            }
            // ping
            ping({ account_name: this.$storage.get("current_wallet").name });
            const res = await pog.read.getTableRows({
                json: true, code: "socialchat",
                scope: this.$storage.get("current_wallet").name,
                table: 'chatqueue',
                limit: 3000
            })
            if(res.rows.length > 0){
                const privateKey = CryptoAES.decrypt(this.$storage.get("current_wallet").privateKey, this.$storage.get("current_wallet").password);
                // res解密出from和内容
                res.rows.forEach( item => {
                    const temp = CryptoAESChat.decrypt(item.content, this.$storage.get("current_wallet").key);
                    const decrypt_two= decodeURIComponent(escape(atob(temp.split(':')[1])));
                    const content = CryptoAESChat.decryptMsg(privateKey, decrypt_two);
                    item.from = temp.split(':')[0];
                    item.content = btoa(unescape(encodeURIComponent(content)));
                });
                let group = groupJson(res.rows);
                let account = this.$storage.get("current_wallet").name;
                let that = this;
                group.forEach(async (item) => {
                    // 聊天页面的缓存
                    await this.updateNoMsgCount(item);
                    // 没有该联系人聊天记录表， 关闭数据库，提升数据库版本，创建聊天记录表
                    if(!(dataBase.check_list(this.$store.state.dataBase,item.from))){
                        await dataBase.close(this.$store.state.dataBase);
                        let request = dataBase.open_dataBase(account,this.$store.state.dataBase.version+1);
                        request.onupgradeneeded = function (event) {
                            let db = event.target.result;
                            // 数据库对象存入vuex
                            that.$store.commit('dataBaseFun', db);
                            // 新建对好友的聊天记录表 用index当做主键,create_time做索引
                            dataBase.created(db,item.from,'index','create_time');
                        }
                        request.onsuccess = async function (event) {
                            let db = event.target.result;
                            let account_data = await that.getFromPublicKey(item.from);
                            let saveData = {
                                name:item.from,
                                account:item.from,
                                publicKey:account_data,
                            }
                            dataBase.add(db,'contactPerson',saveData);
                            for(let i of item.data){
                                let tep = JSON.parse(JSON.stringify(i));
                                tep.create_time = time.time_stamp((tep.create_time + 'Z'));
                                // 添加聊天记录进表
                                dataBase.add(db,item.from,tep)
                            }
                            that.$store.commit('update_statusFun', !(that.$store.state.update_status));
                        }
                    }else{
                        for(let i of item.data){
                            let tep = JSON.parse(JSON.stringify(i));
                            tep.create_time = time.time_stamp((tep.create_time + 'Z'));
                            // 添加进表
                            dataBase.add(this.$store.state.dataBase,item.from,tep);
                        }
                        that.$store.commit('update_statusFun', !(this.$store.state.update_status));
                    }
                });
                // 完成内容获取后，向链提交已阅
                pog.send.read({
                    contract: "socialchat",
                    account_name: account,
                    read_time: res.rows[res.rows.length - 1].create_time,
                    privateKeyList: [privateKey]
                }).then(res => {
                    // console.log(res);
                })
                // 消息提醒
                this.remind(res.rows.length);
            }
        },
        // 更新聊天页面的缓存
        async updateNoMsgCount(data){
            let chat = await dataBase.get_index(this.$store.state.dataBase,'chatCurrent','name',data.from);
            let content = data.data[data.data.length-1].content;
            // 没有此用户的当前缓存
            if(chat == undefined){
                let info = {
                    name: data.from,
                    account: data.from,
                    info: content ,
                    date: data.data[data.data.length-1].create_time + 'Z',
                    onTop: false,
                    count: data.data.length
                }
                dataBase.add(this.$store.state.dataBase,'chatCurrent',info);
            }else{
            // 有此用户的当前缓存
                let info = {
                    name: data.from,
                    account: data.from,
                    info: content ,
                    date: data.data[data.data.length-1].create_time + 'Z',
                    onTop: false,
                    count: chat.count + data.data.length,
                    index: chat.index,
                    remark: chat.remark
                }
                dataBase.update(this.$store.state.dataBase,'chatCurrent',info);
            }
        },
        // 初始化用户数据
        init(){
            if(localStorage.getItem('isecsp_wallet') == null){
                this.$router.push({ name: 'create'});
            }else{
                this.$store.commit('walletsFun', JSON.parse(localStorage.getItem('isecsp_wallet')));
                this.$store.commit('currentWalletFun', JSON.parse(localStorage.getItem('current_wallet')));
                this.dataBase_init();
                this.$router.push({ name: 'Home'});
            }
            this.checkVersion();
        },
        //数据库初始化
        dataBase_init(){
            //如果已经打开了数据库，先关闭这个数据库
            if(JSON.stringify(this.$store.state.dataBase) !== '{}'){
                dataBase.close(that.$store.state.dataBase);
            }
            // 打开当前账号数据库
            let request = dataBase.open_dataBase(this.$store.state.currentWallet.name);
            let that = this;
            request.onsuccess = async function (event) {
                // console.log('拿到数据库对象存入vuex',request.result);
                that.$store.commit('dataBaseFun', request.result);
            };
        },
        //请求版本号 判断是否是最新版本
        async checkVersion() {
            this.versionData =await getversion();
            const u = navigator.userAgent;
            const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            let versionName,downloadUrl;
            if (isAndroid) {
                versionName = this.versionData.android.versionName;
                downloadUrl = this.versionData.android.downloadUrl;
            }else if (isiOS) {
                versionName = this.versionData.ios.versionName;
                downloadUrl = this.versionData.ios.downloadUrl;
            }
            if (downloadUrl) {
                cordova.getAppVersion.getVersionNumber().then(version => {
                    this.$store.commit('versionFun', version);
                    if (versionName && version !== versionName) {
                        this.$store.commit('setUpdateDialog', true );
                    }
                })
            }
        },
        //消息提醒
        remind(length) {
            // 前台 后台提醒
            if (this.AppSetting == 'resume') {
                //前台震动
                if (window.navigator.vibrate) {
                    window.navigator.vibrate(200);
                } else if (window.navigator.webkitVibrate) {
                    window.navigator.webkitVibrate(200);
                }
            } else {
                //后台震动响铃顶部提醒
                if (window.navigator.vibrate) {
                    window.navigator.vibrate(200);
                } else if (window.navigator.webkitVibrate) {
                    window.navigator.webkitVibrate(200);
                }
                // 响铃
                navigator.notification.beep(1);
                //  id相同的消息替换推送
                cordova.plugins.notification.local.schedule([{
                    id: 1,
                    title: this.$storage.get("current_wallet").name,
                    text: length + '条新通知',
                    at: new Date()
                }]);
            }
        },
        // 获取对方公钥
        async getFromPublicKey(name){
            let val = await pog.read.getAccount(name)
            return val.permissions[0].required_auth.keys[0].key;
        },
        // 链时间到本地时间转换
        convertUTCDateToLocalDate(date) {
            let newDate = date
            let offset = date.getTimezoneOffset() / 60;
            let hours = date.getHours();
            newDate.setHours(hours - offset);
            return newDate;
        },
        /**
         * 合并并且去重
         * @param {arr} send 发送的缓存数据
         * @param {arr} get 接收的请求数据
         */
        mergeAndRepetition(send, get) {
            var c = send.concat(get), temp = {}, result = [];
            //遍历c数组，将每个item.id在temp中是否存在值做判断， 
            c.map((item, index) => {
                if (item.create_time.indexOf('T') !== -1) {
                    let tempTime = this.convertUTCDateToLocalDate(parse(item.create_time));
                    let time = format(tempTime, "YYYY-MM-DD HH:mm:ss");
                    item.create_time = time;
                    // console.log(time);
                }
                if (!temp[item.create_time]) {
                    result.push(item);
                    temp[item.create_time] = true
                }
            });
            return result;
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
        // 消息提醒 
        warn() {
            // 前台
            document.addEventListener("resume", () => {
                this.AppSetting = 'resume';
                // this.$toast("欢迎回来");
                this.timer();
            }, false);
            // 后台
            document.addEventListener("pause", () => {
                this.AppSetting = 'pause';
            }, false);
        },
        async timer() {
            clearInterval(this.interval);

            let that = this;
            async function func(){
                // 轮询获取聊天记录
                await that.getMessage();
                that.interval = setTimeout(func, 1600);
            }

            this.interval = setTimeout(func, 1600);
        }
    },
    created() {
        
    },
    computed: {
        beRouter() {
            var data = ['logIn', 'create', 'importWalletPog', 'importWalletEth', 'importWalletEos', 'createWalletPog', 'createWalletEth', 'createWalletEos']
            return (data.indexOf(this.$store.state.beRouter) !== -1) ? true : false;
        },
    }
}
export default mixin;

// 消息发送 多次多条
// cordova.plugins.notification.local.schedule([{
//     id: 1,
//     title: '应用提醒1',
//     text: '应用提醒内容1',
//     at: new Date()
// }, {
//     id: 2,
//     title: '应用提醒2',
//     text: '应用提醒内容2',
//     //当前时间推迟2秒
//     at: new Date(new Date().getTime() + 1000 * 3)
// }]);