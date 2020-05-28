<template>
    <div class="maxBOX">
        <div class="stepOne" >
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont">导入钱包</p>
            <div class="typeTab" >
                <div class="black_so" >私钥</div>
            </div>
            <div class="BoxOne" :class="{gazy_normals:!privateKeyError,red_errors:privateKeyError,}" >
                <textarea type="text"  v-model="privateKey"  placeholder="请输入您的私钥" ></textarea >
            </div>
            <p class="red" v-if="privateKeyError">私钥输入错误</p>
            <div class="BoxTwo" >
                <input type="password" v-model="walletPassword" placeholder='钱包密码' >
            </div>
            <p class="red" v-if="passwordError">密码输入错误</p>
            <div class="BoxTwo" :class="{gazy_normal:!passwordError,red_error:passwordError}">
                <input type="password" v-model="onceWalletPassword" placeholder='确认钱包密码'>
            </div>
            <div class="next" @click="clickImport"  >下一步</div>
        </div>
        
        <div class="success" v-if="successState">
            <img src="../.././assets/img/team_icon_successful@3x.png" alt="">
            <p class="boldfont">导入成功</p>
            <p class="gary">恭喜您， 导入钱包成功</p>
            <div @click="jumpHome">完成</div>
        </div>

    </div>
</template>
<script>
import PasswordService from '../../util/PasswordService'
import CryptoAES from '../../util/CryptoAES'
import ecc from "eosjs-ecc/lib";
import {pog} from '../../servers/blockChain'
import { register } from "../../servers/register";
import dataBase from '@/common/js/dataBase.js'


export default {
    data(){
        return {
          successState:false,
          privateKeyError:false,
          passwordError:false,
          privateKey:'',
          walletName:'',
          walletPassword:'',
          onceWalletPassword:'',
        }
    },
    created(){
        console.log(this.$router.currentRoute.query.data);
    },
    methods:{
        async clickImport(){
                if(!this.privateKey){
                    this.$toast("没有私钥");
                    this.privateKeyError = true;
                    return 
                }else{
                    this.privateKeyError = false;
                }
                if(this.walletPassword !== this.onceWalletPassword){
                    this.passwordError = true;
                    this.$toast("再次输入密码错误");
                    return 
                }else{
                    this.passwordError = false;
                }
                if(this.walletPassword.length < 8){
                    console.log('密码不能少于8位');
                    this.$toast("密码不能少于8位");
                    return 
                }
                try {
                    if ( this.privateKey.length === 51 && ecc.isValidPrivate(this.privateKey)) {
                        this.$store.commit('pursecard_animateFun', true);
                        this.$store.commit('login_animateFun', true);
                        // 用私钥获取对应公钥
                        const publicKey = ecc.PrivateKey(this.privateKey).toPublic().toString('POG');
                        // 用公钥获取账号
                        const account = await this.$nodeApi.read.getKeyAccounts(publicKey)
                        console.log('account',account)
                        if (!account.account_names.length) {
                            console.log('当前私钥没有账号');
                            this.$toast("当前私钥没有账号");
                        }
                        // 密码加密
                        const seed = await PasswordService.encrypt(this.walletPassword);
                        // 私钥加密
                        const encryptedPrivateKey = CryptoAES.encrypt(this.privateKey,seed)
                        var localFile = this.$store.state.wallets;
                        var wallets = localFile.Pog;
                        const elem = wallets.find(ele => ele.publicKey === publicKey)
                        if (elem) {
                            console.log('钱包已经存在');
                            this.$toast("钱包已经存在");
                        } else {
                            for (let item of wallets) {
                                if (item.isDefault) {
                                    item.isDefault = false
                                }
                            }
                            // 注册聊天权限
                            let res = await register(account.account_names[0],this.privateKey, this.$store.state.regID);
                            wallets.unshift({
                                chain: 'Pog',
                                privateKey: encryptedPrivateKey,
                                publicKey: publicKey,
                                name: account.account_names[0],
                                tokenList: [],
                                isDefault: true,
                            })
                            let currdata = {
                                chain: 'Pog',
                                privateKey: encryptedPrivateKey,
                                publicKey: publicKey,
                                name: account.account_names[0],
                                tokenList: [],
                                isDefault: true,
                                password:seed,
                                key:res
                            }
                            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile));
                            localStorage.setItem('current_wallet',JSON.stringify(currdata));
                            this.$store.commit('walletsFun', localFile);
                            this.$store.commit('currentWalletFun', currdata);
                            // 数据库初始化
                            this.dataBase_init(account.account_names[0]);
                            this.successState = true;

                        }
                    } else {
                        console.log('无效的私钥地址');
                        this.$toast("无效的私钥地址");
                    }
                } catch (error) {
                    console.log(error);
                    this.$toast("导入异常");
                } finally{
                    this.$store.commit('pursecard_animateFun', false);
                    this.$store.commit('login_animateFun', false);
                }
        },
        //数据库初始化
        dataBase_init(name){
            //如果已经打开了数据库，先关闭这个数据库
            if(JSON.stringify(this.$store.state.dataBase) !== '{}'){
                dataBase.close(that.$store.state.dataBase);
            }
            var request = dataBase.open_dataBase(name,1);
            let that = this;
            request.onupgradeneeded = function (event) {
                // 数据库对象存入vuex
                that.$store.commit('dataBaseFun', request.result);
                // 新建 联系人表 标签表 聊天当前缓存表
                dataBase.created(request.result,'contactPerson','index','name');
                dataBase.created(request.result,'tagList','index','name');
                dataBase.created(request.result,'chatCurrent','index','name');
            }
        },
        jumpHome(){
            this.$router.push({name:"Home"});
        }
    },
    computed:{
        
    }
}
</script>
<style scoped>
div{
    /* position: relative; */
    vertical-align: top;
}
p{margin: 0;}
.maxBOX{
    font-size: 1.5rem;
    width: 100%;
    height: 100%;
}
.stepOne{
    width: 90%;
    height: 100%;
    margin: 0 auto;   
}
.tab{
    width: 100%;
    margin: 3rem auto;   
    height: 3rem;
}
.tab img{
    width: 3rem;
}
.typeTab{
    width: 100%;
    margin: 3rem auto 3rem auto;
}
.typeTab div{
    display: inline-block;
    width: 50%;
    height: 3rem;
    text-align: center;
    font-size: 1.5rem;
}
.black_so{
    border-bottom: .3rem solid RGB(36,36,36);
    color: RGB(36,36,36);
}
.gazy_so{
    border-bottom: .3rem solid RGB(179,179,179);
    color: RGB(179,179,179);
}
.red_errors{
    border: 1px solid RGB(242,133,134);    
}
.red_error{
    border-bottom: 1px solid RGB(242,133,134);    
}
.gazy_normals{
    border: 1px solid RGB(179,179,179);
}
.gazy_normal{
    border-bottom: 0.1rem solid RGB(179,179,179);
}
.red{
    color: RGB(242,133,134);;
}
.BoxOne{
    border-radius: 1rem;
    width: 100%;
    height: 15%;
    margin:  1.5rem 0 1rem 0;
}
.BoxOne textarea{
    width: 90%;
    margin: 1rem 5%;
    height: 75%;
}
.BoxTwo{
    width: 100%;
    height: 5%;
    margin-bottom: 3rem;
}
.BoxTwo input{
    width: 100%;
    height: 100%;
}
.next{
    width: 90%;
    height: 5rem;
    background: RGB(66,222,181);
    border-radius: 1rem;
    color: #ffffff;
    top: 20%;
    position: relative;
    left: 5%;
    text-align: center;
    line-height: 5rem;
}
.success{
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: absolute;
    top: 0;
    text-align: center;
}
.success img:nth-child(1){
    width: 8rem;
    margin: 30% 0 10% 0;
}
.success p:nth-child(2){
    margin: 5% 0;
}
.success p:nth-child(3){
    margin: 5% 0;
}
.success div:nth-child(4){
    width: 50%;
    height: 4rem;
    background: RGB(66,222,181);
    border-radius: 1rem;
    color: #ffffff;
    margin: 58% auto 2% auto;
    text-align: center;
    line-height: 4rem;
}





.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}
input{
    background:none;  
    outline:none;  
    border:none;
    color: RGB(179,179,179);
}
input::-webkit-input-placeholder{
    color: RGB(179,179,179);
}
textarea{
    color: RGB(179,179,179);
    background:none;  
    outline:none;  
    border:none;
}
textarea::-webkit-input-placeholder{
    color: RGB(179,179,179);
}

</style>