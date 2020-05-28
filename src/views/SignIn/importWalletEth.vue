<template>
    <div class="maxBOX">
        <div class="stepOne" >
            <div class="tab">
                <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            </div>
            <p class="boldfont">导入钱包</p>
            <div class="typeTab" >
                <div :class="{black_so : tabindex==1 , gazy_so : !(tabindex==1)}" @click="tabindex = 1">助记词</div>
                <div :class="{black_so : tabindex==2 , gazy_so : !(tabindex==2)}" @click="tabindex = 2">私钥</div>
            </div>
            <div class="BoxOne" :class="{gazy_normals:!mnemonicError,red_errors:mnemonicError,}" v-show="tabindex == 1">
                <textarea type="text"  v-model="mnemonic"  placeholder="请输入您备份的助记词"    ></textarea >
            </div>
            <div class="BoxOne" :class="{gazy_normals:!privateKeyError,red_errors:privateKeyError,}" v-show="tabindex == 2">
                <textarea type="text"  v-model="privateKey"  placeholder="请输入您的私钥"    ></textarea >
            </div>
            <p class="red" v-if="mnemonicError">助记词输入错误</p>
            <p class="red" v-if="privateKeyError">私钥输入错误</p>
            <div class="BoxTwo" >
                <input type="text" v-model="walletName" placeholder='钱包名称' maxlength='12'    >
            </div>
            <div class="BoxTwo" >
                <input type="text" v-model="walletPassword" placeholder='钱包密码' maxlength='8'    >
            </div>
            <p class="red" v-if="passwordError">密码输入错误</p>
            <div class="BoxTwo" :class="{gazy_normal:!passwordError,red_error:passwordError}">
                <input type="text" v-model="onceWalletPassword" placeholder='确认钱包密码' maxlength='8'    >
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
import {ethers} from 'ethers'



export default {
    data(){
        return {
          tabindex:1,
          successState:false,
          mnemonicError:false,
          privateKeyError:false,
          passwordError:false,
          mnemonic:'',
          privateKey:'',
          walletName:'',
          walletPassword:'',
          onceWalletPassword:'',
        }
    },
    created(){
        console.log(this.$router.currentRoute.query.data)
    },
    methods:{
        async clickImport(){
                if(this.tabindex == 1){
                    if(!this.mnemonic){
                        return this.mnemonicError = true;
                    }else{
                        this.mnemonicError = false;
                    }
                }else{
                    if(!this.privateKey){
                        return this.privateKeyError = true;
                    }else{
                        this.privateKeyError = false;
                    }
                }
                if(this.walletPassword !== this.onceWalletPassword){
                    return this.passwordError = true;
                }else{
                    this.passwordError = false;
                }
                
              
                let localFile = this.$store.state.wallets
                let wallets = localFile.Eth;
                if(this.tabindex == 1){
                    const path = "m/44'/60'/0'/0";
                    const wallet = ethers.Wallet.fromMnemonic(this.mnemonic, path);
                    console.log(wallet)
                    const elem = wallets.find(ele => ele.address === wallet.address)
                    if (elem) {
                        // 钱包已经存在
                        console.log('钱包已存在')
                    } else {
                        // 密码加密
                        const seed = await PasswordService.encrypt(this.walletPassword)
                        // 私钥加密
                        const encryptedPrivateKey = CryptoAES.encrypt(wallet.privateKey,seed)
                        for (let item of wallets) {
                            if (item.isDefault) {
                                item.isDefault = false
                            }
                        }
                        wallets.unshift({
                            chain: 'Eth',
                            privateKey: encryptedPrivateKey,
                            address: wallet.address,
                            name: this.walletName,
                            tokenList: [],
                            isDefault: true
                        })
                        let currdata = {
                            chain: 'Eth',
                            privateKey: encryptedPrivateKey,
                            address: wallet.address,
                            name: this.walletName,
                            tokenList: [],
                            isDefault: true
                        }
                        localStorage.setItem('current_wallet',JSON.stringify(currdata));
                        localStorage.setItem('isecsp_wallet',JSON.stringify(localFile));
                        this.$store.commit('walletsFun', localFile);
                        this.$store.commit('currentWalletFun', currdata);
                        this.$router.push({name:"Home"});
                    }
                   
                }else{
                    try {
                        let wallet = new ethers.Wallet(this.privateKey);
                        console.log(wallet)
                        const elem = wallets.find(ele => ele.address === wallet.address)
                        if (elem) {
                            // 钱包已经存在
                            console.log('钱包已存在')
                        } else {
                            // 密码加密
                            const seed = await PasswordService.encrypt(this.walletPassword)
                            // 私钥加密
                            const encryptedPrivateKey = CryptoAES.encrypt(wallet.privateKey,seed)
                            for (let item of wallets) {
                                if (item.isDefault) {
                                    item.isDefault = false
                                }
                            }
                            wallets.unshift({
                                chain: 'Eth',
                                privateKey: encryptedPrivateKey,
                                address: wallet.address,
                                name: this.walletName,
                                tokenList: [],
                                isDefault: true
                            })
                            let currdata = {
                                chain: 'Eth',
                                privateKey: encryptedPrivateKey,
                                address: wallet.address,
                                name: this.walletName,
                                tokenList: [],
                                isDefault: true,
                                password:seed
                            }
                            localStorage.setItem('current_wallet',JSON.stringify(currdata))
                            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
                            this.$store.commit('walletsFun', localFile)
                            this.$store.commit('currentWalletFun', currdata)
                            this.successState = true;
                        }
                    } catch (error) {
                        console.log(error)
                    }
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
    margin: 3rem auto 0 auto;
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
    top: 14%;
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