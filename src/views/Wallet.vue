<template>
    <div class="MaxBox">
        <div class="toptab">
            <div ><p class="boldfont">钱包</p></div>
            <div @click="purseStatus = true"><P>{{currentWallet.name}}</P></div>
            <div ><img src=".././assets/img/jia.png" alt="" @click="stepState = 1"></div>
        </div>
        <div class="card">
            <p>钱包余额 $</p>
            <p>{{balance}}</p>
            <div> 
                <img src=".././assets/img/wallet_icon_exchange@3x.png">
                <span>交易所</span>
            </div>
            <div>
                <img src=".././assets/img/wallet_icon_change@3x.png">
                <span>兑换所</span>
            </div>
        </div>
        <div class="features">
            <div @click="jumpRouter('transfer')"><img src=".././assets/img/wallet_icon_transfer@3x.png" alt=""><p>转账</p></div>
            <div @click="jumpRouter('collection')"><img src=".././assets/img/wallet_icon_top@3x.png" alt=""><p>收款</p></div>
            <div @click="jumpRouter('scanit')"><img src=".././assets/img/wallet_icon_scan@3x.png" alt=""><p>扫码</p></div>
        </div>
        <div class="assets">
            <p class="boldfont marignTwo">资产详情</p>
            <div @click="jumpCurrency" class="assetsMore"><img src=".././assets/img/assembly_ic_option@2x.png" alt=""></div>
            <div v-for="(item, key) in assetsData"  :key="key" class="assetsdef" @click="jumpRouter('assets', item)">
                <div><img :src='item.logo' alt=""></div>
                <div class="boldfont">{{item.name}}</div>
                <div>
                    <p class="boldfont">{{item.balance}}</p>
                    <p>￥{{item.balance}}</p>
                </div>
            </div>
        </div>

        <div class="pursecard" v-if="purseStatus"  @click="purseStatus = false">
        </div>
        <div class="purse" v-if="purseStatus">
            <p class="pursetitle">我的钱包</p>
            <div class="pursetab">
                <div class="pursetabGray" :class="{ pursetabGreen:purseAssetsIndex == 'Pog'}" @click="switchWallet('Pog')">POG</div>
                <div class="pursetabGray" :class="{ pursetabGreen:purseAssetsIndex == 'Eos'}" @click="switchWallet('Eos')">EOS</div>
                <div class="pursetabGray" :class="{ pursetabGreen:purseAssetsIndex == 'Eth'}" @click="switchWallet('Eth')">ETH</div>
            </div>
            <div class="pursedefineBox">
                <div v-for="(item, key) in purseAssets"  :key="key" class="pursedefine" @click="logWallet(item)">
                    <div><span>{{item.name}}</span><img v-if="item.privateKey == currentWallet.privateKey" src=".././assets/img/icon_choose_selected@3x.png" alt=""></div>
                    <div><p class="gary">总资产</p><p>{{item.balance}}</p></div>
                    <div><p class="gary">预估价值</p><p class="gary">￥{{item.balance}}</p></div>
                </div>
            </div>
            <p class="end" @click="purseStatus = false">确定</p>
        </div>

        <div class="blackcard" v-show="stepState == 1" @click="stepState = 0"></div>
        <div class="stepTwo" v-show="stepState == 1" >
            <p @click="stepState = 2">创建钱包</p>
            <p @click="stepState = 3">导入钱包</p>
        </div>
        <div class="stepThree" v-show="stepState == 2">
            <img src=".././assets/img/cancels_icon.png" alt="" @click="stepState = 0">
            <p>选择底层</p>
            <div class="stepThreeTab" @click="jumpRouter('createWalletPog')">
                <div><img src=".././assets/img/system_pog.png" alt=""></div>
                <div><p>POG</p></div>
            </div>
            <div class="stepThreeTab" @click="jumpRouter('createWalletEos')">
                <div><img src=".././assets/img/wallet_img_eos@3x.png" alt=""></div>
                <div><p>EOS</p></div>
            </div>
            <div class="stepThreeTab" @click="jumpRouter('createWalletEth')">
                <div><img src=".././assets/img/wallet_icon_eth@3x.png" alt=""></div>
                <div><p>ETH</p></div>
            </div>
        </div>
        <div class="stepThree" v-show="stepState == 3">
            <img src=".././assets/img/cancels_icon.png" alt="" @click="stepState = 0">
            <p>选择底层</p>
            <div class="stepThreeTab"  @click="jumpRouter('importWalletPog')">
                <div><img src=".././assets/img/system_pog.png" alt=""></div>
                <div><p>POG</p></div>
            </div>
            <div class="stepThreeTab"  @click="jumpRouter('importWalletEos')">
                <div><img src=".././assets/img/wallet_img_eos@3x.png" alt=""></div>
                <div><p>EOS</p></div>
            </div>
            <div class="stepThreeTab"  @click="jumpRouter('importWalletEth')">
                <div><img src=".././assets/img/wallet_icon_eth@3x.png" alt=""></div>
                <div><p>ETH</p></div>
            </div>
        </div>

    </div>
</template>
<script>
import {ethers} from 'ethers'



export default {
    data(){
        return {
            purseStatus:false,
            balance:0,
            stepState:0,
            assetsData:[
                
            ],
            purseAssetsIndex:'Pog',
            purseAssets:[
                
            ]
        }
    },
    created(){
       this.init()
    },
    methods:{
        jumpRouter(name,data){
            this.$router.push({ name: name, query: { data: data }})
        },
        jumpCurrency(){
            if(this.currentWallet.chain == 'Pog'){
                this.$router.push({ name: 'addPogCurrency' })
            }else if(this.currentWallet.chain == 'Eth'){
                this.$router.push({ name: 'addEthCurrency' })
            }
        },
        async switchWallet(data){
            this.purseAssetsIndex = data;
            for(let l = 0; l < this.wallets[data].length; l++){
                let total = 0;
                for(let i = 0; i < this.wallets[data][l].tokenList.length; i++){
                    let balances = await this.$nodeApi.read.getTableRows({
                        json: true,
                        code: this.wallets[data][l].tokenList[i].account_name,
                        scope: this.wallets[data][l].name,
                        table: 'accounts',
                        limit: 500
                    })
                    this.wallets[data][l].tokenList[i].balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0';
                    total += parseInt(this.wallets[data][l].tokenList[i].balance);
                }
                this.wallets[data][l].balance = total + '.0000';
            }
            this.purseAssets = this.wallets[data];
            // console.log(this.purseAssets)
        },
        async getCurrentBalance() {
            for (let i = 0; i < this.assetsData.length; i++) {
                let balances = await this.$nodeApi.read.getTableRows({
                    json: true,
                    code: this.assetsData[i].account_name,
                    scope: this.currentWallet.name,
                    table: 'accounts',
                    limit: 500
                })
                this.assetsData[i].balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0';
            }
        },
        async init(){
            this.assetsData = this.currentWallet.tokenList;
            this.getCurrentBalance();
            this.switchWallet('Pog');
        },
        async logWallet(data){
            if(this.purseAssetsIndex =='Pog'){
                localStorage.setItem('current_wallet',JSON.stringify(data));
                this.$store.commit('currentWalletFun', data);
                this.jumpRouter('logIn',data);
            }else if(this.purseAssetsIndex =='Eth'){
                localStorage.setItem('current_wallet',JSON.stringify(data));
                this.$store.commit('currentWalletFun', data);
                this.jumpRouter('logIn',data);
            }else{

            }
            this.assetsData = this.currentWallet.tokenList;
            // console.log(data);
        }
    },
    computed:{
        currentWallet() {
            return this.$store.state.currentWallet 
        },
        wallets() {
            return this.$store.state.wallets 
        }
    }
}
</script>
<style scoped>
/* div{position: relative;} */
span{
    font-size: 1.4rem;
}
p{
    font-size: 1.4rem;
}
.toptab{
    width: 90%;
    margin: 1.5rem auto;
}
.toptab div{
    display: inline-block;
    height: 100%;
}
.toptab div:nth-child(1){
    width: 45%;
}
.toptab div:nth-child(2){
    width: 40%;
    border-radius: 1rem;
    background: RGB(245,255,252);
    text-align: center;
    color: #29E0B0;
}
.toptab div:nth-child(3){
    background: RGB(245,255,252);
    width: 10%;
    height: 3rem;
    border-radius: 1rem;
    margin-left: 5%;
    text-align: center;
}
.toptab div:nth-child(3) img{
    width: 50%;
    position: relative;
    top: 22%;
}
.toptab p{
    margin: 1rem;
}
.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}
.card{
    background: RGB(82,233,194);
    width: 90%;
    height: 20%;
    border-radius: 1rem;
    margin: 0 auto;
}
.card p:nth-child(1){
    margin: 0rem 0 0 3rem ;
    padding-top: 1.5rem;
    color: #FFFFFF;
}
.card p:nth-child(2){
    margin: 1.5rem 0 1rem 2.6rem ;
    color: #FFFFFF;
    font-size:3rem;
}
.card div{
    display: inline-block;
    width: 50%;
    height: 4rem;
    text-align:center;
    line-height: 4rem;
    font-size: 1.4rem;
    color: #FFFFFF;
}
.card img{
    width: 2rem;
    right: .6rem;
    top: .5rem;
    position: relative;
}
.features{
    display: flex;
    width: 100%;
    margin: 3rem auto;
    justify-content: space-around; /* 水平居中 */
    align-items: center;  
    text-align: center;
}
.features img{
    width: 100%;
}
.features div{
    width: 16%;
}
.assets{
    width: 90%;
    height: 40%;
    overflow-y: scroll;
    margin: 0 auto;
    position: relative;
}
.assetsMore{
    position: absolute;
    background: RGB(236,253,248);
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    right: 4%;
    top: 0%;
    text-align: center;
}
.assetsMore img{
    width: 53%;
    position: relative;
    top: 19%;
}
.assetsdef{
    width: 100%;
}
.assetsdef div{
    display: inline-block;
    height: 4rem;
    margin: 1rem 0;
}
.assetsdef img{
    width: 75%;
    position: relative;
    top: 12.5%;
    left: 12.5%;
}
.assetsdef div:nth-child(1){
    width: 4rem;
    background: RGB(246,246,246);
    vertical-align: text-bottom;
    border-radius: 50%;;
    margin-right: 1.2rem;
}
.assetsdef div:nth-child(2){
    width: 20%;
    vertical-align: top;
    line-height: 4rem;
}
.assetsdef div:nth-child(3){
    width: 60%;
    vertical-align: top;
    text-align: right;
}
.assetsdef div:nth-child(3) p:nth-child(1){
    margin: 0 0 .5rem 0;
}
.assetsdef div:nth-child(3) p:nth-child(2){
    margin: 0;
    color: RGB(206,204,207);
}
.pursecard{
    background: black;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
}
.purse{
    background: RGB(255,254,255);
    position: absolute;
    top: 37%;
    border-radius: 1rem;
    width: 90%;
    height: 52%;
    padding: 0 5%;
    left: 5%;
}
.pursetitle{
    font-size: 1.8rem;
    font-weight: 600;
    margin: 7% 0;
}
.pursetab{
    overflow-x: auto;
    width: 100%;
    margin-bottom: 7%;
    /* height: 2rem; */
}
.pursetabGray{
    width: 20%;
    border-radius: 2rem;
    display: inline-block;
    border: 1px solid RGB(206,204,207);
    text-align: center;
    line-height: 2.5rem;
    color: RGB(206,204,207);
    margin-right: 5%;
}
.pursetabGreen{
    width: 20%;
    border-radius: 2rem;
    display: inline-block;
    text-align: center;
    line-height: 2.5rem;
    border: 0px solid;
    color: RGB(52,204,186);
    background: RGB(235,251,248);
    margin-right: 5%;
}

.pursedefineBox{
    width: 100%;
    height: 50%;
    overflow-y: auto;
    margin-bottom: 7%;
    position: relative;
}
.pursedefine{
    width: 100%;
    margin-bottom: 5%;
}
.pursedefine p{
    margin: .5rem 0;
}
.pursedefine div:nth-child(1){
    width: 100%;
    font-size: 1.5rem;
    position: relative;
}
.pursedefine div:nth-child(1) img{
    width: 6%;
    position: absolute;
    left: 40%;
}
.pursedefine div:nth-child(2){
    width: 50%;
    display: inline-block;
}
.pursedefine div:nth-child(2) p:nth-child(2){font-size:2rem;}
.pursedefine div:nth-child(3) p:nth-child(2){font-size:2rem;}
.pursedefine div:nth-child(3){
    width: 50%;
    display: inline-block;
    text-align: right;
}
.end{
    color: RGB(206,204,207);
    text-align: center;
    font-size:1.5rem;
}
.stepTwo{
    background: RGB(255,254,255);
    position: fixed;
    top: 60%;
    border-radius: 1rem;
    width: 90%;
    height: 14rem;
    left: 5%;
    text-align: center;
    font-size: 1.6rem;
    font-weight: 600;
}
.stepTwo p:nth-child(1){
    height: 50%;
    line-height: 7rem;
}
.stepTwo p:nth-child(2){
    height: 50%;
    line-height: 7rem;
}

.stepThree{
    width: 100%;
    height: 100%;
    font-weight: 600;
    position: fixed;
    top: 0;
    background: #ffffff;
}
.stepThree img:nth-child(1){
    width: 2rem;
    margin: 5% 5%;
}
.stepThree p:nth-child(2){
    margin: 5% 5%;
}
.stepThreeTab{
    width: 90%;
    margin: 12% auto;
    height: 5rem;
}
.stepThreeTab div:nth-child(1){
    display: inline-block;
    width: 5rem;
    height: 100%;
    background: RGB(245,245,245);
    border-radius: 50%;
}
.stepThreeTab div:nth-child(1) img{
    width: 67%;
    position: relative;
    left: 12%;
    top: 10%;
}
.stepThreeTab div:nth-child(2){
    display: inline-block;
    width: 60%;
    height: 100%;
    margin-left: 5%;
}
.stepThreeTab div:nth-child(2) p{
    line-height: 5rem;
}

.marignTwo{
    margin-bottom: 2rem;
}

</style>