<template>
    <div class="maxBOX">
        <div class="stepOne" v-show="stepState == 1">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">创建钱包</p>
            <div class="BoxTwo gazy_normal" :class="{gazy_normal:!walletError,red_error:walletError}">
                <input type="text" v-model="walletName" placeholder='钱包名称' @blur="accountBlurValidate" maxlength='12' > 
            </div>
            <p class="red" v-if="walletError">钱包名称不可用</p>
            <div class="BoxTwo gazy_normal" >
                <input type="text" v-model="walletPassword" placeholder='钱包密码' maxlength='8' >
            </div>
            <p class="red" v-if="passwordError">密码输入错误</p>
            <div class="BoxTwo" :class="{gazy_normal:!passwordError,red_error:passwordError}">
                <input type="text" v-model="onceWalletPassword" placeholder='确认钱包密码' maxlength='8' >
            </div>
            <div class="next" @click="clickImport">下一步</div>
        </div>

        <div class="stepTwo" v-show="stepState == 2">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">备份助记词</p>
            <p class="gary marBottom">助记词非常重要！一旦丢失，钱包将无法恢复，请备份好妥善保管，助记词丢失可能会造成资产损失</p>
            <div class="mnemonicBox" v-for="item in mnemonicshow" :key="item.key">
                <p >{{item}}</p>
            </div>
            <div class="next" @click="stepState = 3">下一步</div>
        </div>

        <div class="stepThree" v-show="stepState == 3">
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont marBottom">确认备份</p>
            <p class="gary marBottom">按抄写的助记词填入输入框，确认你备份的助记词正确</p>
            <div class="private_key">
                <span class="mnemonic" v-for="(item, key) in mnemonic" @click="clickMnemonic(item)" :key="key">{{item}}</span>
            </div>
            <div class="shuffle">
                <span class="mnemonic" v-for="(item, key) in shuffle" @click="clickShuffle(item)" :key="key">{{item}}</span>
            </div>
            <div class="next" @click="clickBtn">下一步</div>
        </div>


        <div class="success" v-if="successState">
            <img src="../.././assets/img/team_icon_successful@3x.png" alt="">
            <p class="boldfont">创建成功</p>
            <p class="gary">恭喜您， 创建钱包成功</p>
            <div @click="jumpHome">完成</div>
        </div>

    </div>
</template>
<script>
import PasswordService from '../../util/PasswordService'
import CryptoAES from '../../util/CryptoAES'
import {ethers} from 'ethers';





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
          mnemonicshow:[1,2,3,4,],
          mnemonic:[],
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
                this.walletError = false;
            }
        },
        async clickImport(){
                if(this.walletPassword !== this.onceWalletPassword){
                    return this.passwordError = true;
                }else{
                    this.passwordError = false;
                }
                const mnemonic = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
                const path = "m/44'/60'/0'/0"
                const wallet = ethers.Wallet.fromMnemonic(mnemonic, path)
                console.log(wallet)
                // 密码加密
                const seed = await PasswordService.encrypt(this.walletPassword)
                // 私钥加密
                const encryptedPrivateKey = CryptoAES.encrypt(wallet.privateKey,seed)
                this.mnemonicshow = mnemonic.split(' ');
                this.pageData = {name: this.walletName, mnemonic: mnemonic,encryptedPrivateKey: encryptedPrivateKey,wallet: wallet,seed:seed}
                console.log(this.pageData)
                const arr = this.mnemonicshow.slice()
                for (let i = 1; i < arr.length; i++) {
                    const random = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[random]] = [arr[random], arr[i]];
                }
                this.shuffle = arr;
                this.stepState = 2;
        },
        async clickBtn() {
            if (this.mnemonic.join(' ') === this.pageData.mnemonic) {
                var localFile = this.$store.state.wallets;
                var wallets = localFile.Eth;
                const path = "m/44'/60'/0'/0"
                const wallet = ethers.Wallet.fromMnemonic(this.mnemonic.join(' '), path)
                for (let item of wallets) {
                    if (item.isDefault) {
                        item.isDefault = false
                    }
                }
                wallets.unshift({
                    chain: 'Eth',
                    privateKey: this.pageData.encryptedPrivateKey,
                    address: wallet.address,
                    name: this.pageData.name,
                    tokenList: [],
                    isDefault: true
                })
                let currdata = {
                    chain: 'Eth',
                    privateKey: this.pageData.encryptedPrivateKey,
                    address: wallet.address,
                    name: this.pageData.name,
                    tokenList: [],
                    isDefault: true,
                    password:this.pageData.seed
                }
                localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
                localStorage.setItem('current_wallet',JSON.stringify(currdata))
                this.$store.commit('walletsFun', localFile)
                this.$store.commit('currentWalletFun',currdata)
                 console.log(this.$store.state.wallets);
                 console.log(this.$store.state.currentWallet);
                this.successState = true;
            } else {
                console.log('助记词顺序错误')
            }
        },
        clickMnemonic(item) {
            this.mnemonic.splice(this.mnemonic.indexOf(item), 1)
            this.shuffle.push(item)
        },
        clickShuffle(item) {
            this.shuffle.splice(this.shuffle.indexOf(item), 1)
            this.mnemonic.push(item)
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
    width: 20%;
    height: 3rem;
    display: inline-block;
    margin: 0 5% 5% 0;
    background-color: #f1f1f1;
    text-align: center;
}
.mnemonicBox p {
    line-height: 3rem;
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