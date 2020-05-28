<template>
    <div class="maxBOX">
        <div class="stepOne" v-show="stepState == 1">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">创建钱包</p>
            <div class="BoxTwo gazy_normal" :class="{gazy_normal:!walletError,red_error:walletError}">
                <input type="text" v-model="walletName" placeholder='钱包名称' @blur="accountBlurValidate" maxlength='12'> 
            </div>
            <p class="red" v-if="walletError">钱包名称不可用</p>
            <div class="BoxTwo gazy_normal" >
                <input type="text" v-model="walletPassword" placeholder='钱包密码' maxlength='8' >
            </div>
            <p class="red" v-if="passwordError">密码输入错误</p>
            <div class="BoxTwo" :class="{gazy_normal:!passwordError,red_error:passwordError}">
                <input type="text" v-model="onceWalletPassword" placeholder='确认钱包密码' maxlength='8' >
            </div>
            <div class="next" @click="clickImport"  >下一步</div>
        </div> 

        <div class="stepTwo" v-show="stepState == 2">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">备份私钥</p>
            <p class="gary marBottom">抄写私钥，并保存在安全的地方。千万不要保存在网络上。然后尝试转入转出小额资产开始使用。</p>
            <div class="mnemonicBox" >
                <p >{{pageData.privateKey}}</p>
            </div>
            <div class="next" @click="stepState = 3">下一步</div>
        </div>

        <div class="stepThree" v-show="stepState == 3">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">确认你的钱包私钥</p>
            <p class="gary marBottom">请按抄写的私钥填入输入框，确认你备份的私钥正确</p>
            <div class="mnemonicBox">
                <textarea v-model="privateKey" ></textarea>
            </div>
            <div class="next" @click="clickBtn" >下一步</div>
        </div>

        <div class="stepThree" v-if="stepState == 4">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">我的激活码：{{this.pageData.activationCode.active_code}}</p>
            <p class="gary marBottom">账号名称：{{this.walletName}}</p>
            <p class="gary marBottom">微信客服账号：{{this.pageData.activationCode.wx_account}}</p>
            <div class="cardbox">
                <div class="card border">
                    <div><p>拥有者权限</p></div>
                    <div ><p>{{this.pageData.publicKey}}</p></div>
                </div>
                <div class="card">
                    <div><p>管理者权限</p></div>
                    <div ><p>{{this.pageData.publicKey}}</p></div>
                </div>
            </div>
            <div class="next" @click="$router.go(-1)">完成</div>
          
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

import { eos } from '../../servers/blockChain'
import { activeApply } from '../../servers'
import ecc from 'eosjs-ecc/lib'
const { PrivateKey } = ecc


export default {
    data(){
        return {
          stepState:1,
          successState:false,
          passwordError:false,
          walletError:false,
          privateKey:'',
          walletName:'',
          walletPassword:'',
          onceWalletPassword:'',
          pageData:{},
          shuffle:[1,2,3,4],
        }
    },
    created(){
       
    },
    methods:{
        async accountBlurValidate() {
            const wallets = this.$store.state.wallets.Eth;
            const bhed = wallets.find( item => item.name === this.walletName);
            if (bhed) {
                this.walletError = true;
            }else{
                
            }
        },
        async clickImport(){
                if(this.walletPassword !== this.onceWalletPassword){
                    return this.passwordError = true;
                }else{
                    this.passwordError = false;
                }
                if(this.walletPassword < 8 ){
                    return this.passwordError = true;
                }
                if (this.walletName.length === 12) {
                    try {
                        const res = await eos.read.getAccount(this.walletName)
                        console.log(res)
                        if (res) {
                            console.log('已有此账户')
                        }
                    } catch (error) {
                        console.log(error)
                        const buff = (await PrivateKey.randomKey()).toBuffer()
                        const privateKey = ecc.PrivateKey.fromBuffer(new Buffer(buff)).toString()
                        const publicKey = ecc.PrivateKey(privateKey).toPublic().toString('POG')
                        console.log(privateKey, publicKey)
                        this.pageData = { route: 'activation' ,type: 'friendCreation' ,account: this.walletName ,privateKey: privateKey ,publicKey: publicKey };
                        this.stepState = 2;
                    }
                } else {
                    console.log('失败')
                }


        },
        async clickBtn() {
            if (this.privateKey === this.pageData.privateKey) {
                    try {
                        // 获取激活码
                        const res = await activeApply({account_name: this.pageData.account, owner_public_key: this.pageData.publicKey, active_public_key: this.pageData.publicKey})
                        if (res.code === 1) {
                            this.pageData.activationCode = res.data;
                            this.stepState = 4;
                        }
                    } catch (error) {
                        console.log(error)
                    }
                } 
        },
        checkAccount(newVal, oldVal) {
            const lastChar = newVal[newVal.length-1]
            const reg = new RegExp("^[a-z1-5]+$")
            if (!reg.test(lastChar)) {
                this.walletName = oldVal
            }
        },
        jumpHome(){
            this.$router.push({name:"Home"});
        }
    },
    computed:{
        
    },
    watch: {
        walletName(newVal, oldVal) {
            this.checkAccount(newVal, oldVal)
        }
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
    top: 26%;
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

.stepTwo{
    width: 90%;
    height: 100%;
    margin: 0 auto;   
}
.mnemonicBox{
    width: 90%;
    height: 10rem;
    margin: 0 5%;
    padding: 5% 5%;
    background-color: #f1f1f1;
    text-align: left;
    word-break: break-word;
}
.mnemonicBox p {
    line-height: 3rem;
}
.mnemonicBox textarea{
    width: 100%;
    height: 100%;
}

.stepThree{
    width: 90%;
    height: 100%;
    margin: 0 auto;   
}
.private_key {
    height: 18%;
    width: 100%;
    margin: 0 auto;
    padding: 1rem;
    background-color: #f1f1f1;
    word-break: break-all;
    text-align: left;
    font-size: 2rem;
    border: none;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
}
.shuffle {
  display: flex;
  flex-wrap: wrap;
  font-size: 2rem;
  line-height: 1.5;
}
.mnemonic {
  margin-right: 30px;
}
.cardbox {
  width: 90%;
  height: 28%;
  font-size: 2rem;
  padding: 0 5%;
  box-shadow: 0px 0px 15px rgb(219, 219, 219);
  background: transparent;
  font-size: 1.5rem;
}
.card {
  width: 100%;
  height: 50%;
  line-height: 2rem;
  padding-top: 7%;
  word-break: break-word;
}
.card p:nth-child(1){
    margin-bottom: 2%;
}
.border {
  border-bottom: 1PX solid #e4e4e4;
}














.marBottom{
    margin-bottom: 4rem;
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