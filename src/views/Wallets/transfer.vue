<template>
    <div class="maxBOX">
        <div class="tab">
            <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
        </div>
        <div class="condition">
            <div><p>转账</p></div>
            <div @click="purseStatus = true"><p>{{currencyData[currencyIndex].name}}</p><img src="" alt=""></div>
            <div><p>{{currentWallet.name}}</p><img src="" alt=""></div>
        </div>
        <div class="amountBox">
            <p>收款账号</p>
            <div >
                <input type="text"  v-model="transferName" maxlength="12" @focus='showBtn' @blur='showBtn'>
                <!-- <img src="../.././assets/img/transfer_icon_contact@3x.png" alt="" class="contactPerson">
                <img @click="jumpScanit" src="../.././assets/img/transfer_icon_scan@3x.png" alt="" class="scanIt"> -->
            </div>
        </div>
        <div class="amountBox">
            <p>转出金额</p>
            <div>
                <input type="number" placeholder="0" v-model="transferAmount" @focus='showBtn' @blur='showBtn'>
                <span>{{currencyData[currencyIndex].name}}</span>
            </div>
            <div><p>可用余额 {{currencyData[currencyIndex].balance}}</p></div>
            <div class="green" @click="transferAmount = currencyData[currencyIndex].balance"><p>全部转出</p></div>
        </div>
        <div class="btn" @click="payStatus = true" v-if="btn">确认转账</div>

        <div class="success" v-if="sucStatus">
            <img src="../.././assets/img/team_icon_successful@3x.png" alt="">
            <p class="boldfont">转账成功</p>
            <p class="gary">恭喜您， 转账成功</p>
            <div @click="sucStatus = false">确认</div>
            <p class="gary">查看详情</p>
        </div>

        <div class="pursecard" v-if="purseStatus" @click="purseStatus = false"></div>
        <div class="purse" v-if="purseStatus">
            <p class="boldfont">选择币种</p>
            <div class="currency">
                <p v-for="(item, index ,key) in currencyData"  :key="key" :class="{black:currencyIndex == index}" @click="selectIndex(index)">{{item.name}}</p>
            </div>
            <p class="cancel" @click="purseStatus = false">取消</p>
        </div>

        <div class="pursecard" v-if="payStatus"></div>
        <div class="pay" v-if="payStatus">
            <img src="../.././assets/img/cancels_icon.png" alt="" @click="payStatus = false">
            <p>请输入支付密码</p>
            <div><input type="password"  v-model="password"></div>
            <div @click="clickTransfer" ><p>确认</p></div>
        </div>

    </div>
</template>
<script>
import PasswordService from '../../util/PasswordService'
import CryptoAES from '../../util/CryptoAES'
import {pog} from '../../servers/blockChain'
import { Decimal } from "decimal.js"



export default {
    data(){
        return {
            sucStatus:false,
            purseStatus:false,
            payStatus:false,
            password:'',
            transferName:'',
            transferAmount:'',
            currencyIndex:0,
            currencyData:[
                
            ],
            btn:true,
        }
    },
    created(){
        this.currencyData = this.currentWallet.tokenList;
        console.log(this.currentWallet.tokenList);
        this.getBalance();
    },
    methods:{
        jumpScanit(){
            this.$router.push({ name: 'scanit'})
        },
        selectIndex(data){
            this.currencyIndex = data;
        },
        showBtn(){
            this.btn = !this.btn;
        },
        async getBalance() {
            for (let i = 0; i < this.currencyData.length; i++) {
                let balances = await this.$nodeApi.read.getTableRows({
                    json: true,
                    code: this.currencyData[i].account_name,
                    scope: this.currentWallet.name,
                    table: 'accounts',
                    limit: 500
                })
                this.currencyData[i].balance = balances.rows.length ? balances.rows[0].balance.split(' ')[0] : '0';
            }
        },
        async clickTransfer(){
            let seed = await PasswordService.encrypt(this.password);
            let privateKey = CryptoAES.decrypt(this.currentWallet.privateKey, seed);
            let contract = this.currencyData[this.currencyIndex].account_name
            let token = this.currencyData[this.currencyIndex].name
            if(privateKey == ''){
                return console.log('密码错误');
            }
            try {
                if(contract == "ue.token"){
                    const res = await this.$nodeApi.tr.transfer({
                        tokenContract: contract,
                        from: this.currentWallet.name,
                        to: this.transferName,
                        quantity: `${Decimal(this.transferAmount).toFixed(4)} ${token}`,
                        memo: "",
                        privateKeyList: [privateKey]
                    });
                    this.getBalance();
                    this.payStatus=false;   this.sucStatus=true;
                    this.transferAmount = '';   this.transferName = '';   this.password = '';
                }
            } catch (error) {
                console.log("转账error:", error);
            }            
      } 
    },
    computed:{
        currentWallet() {
            return this.$store.state.currentWallet 
        }
    }
}
</script>
<style scoped>
div{position: relative;vertical-align: top;}
p{margin: 0;}
.maxBOX{
    font-size: 1.5rem;
     width: 100%;
    height: 100%;
}
.tab{
    width: 90%;
    margin: 3rem auto;   
    height: 3rem;
}
.tab span{
    position: relative;
    left: 36%;
    top: -25%;
}
.tab img{
    width: 3rem;
}
.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}
.condition{
    width: 90%;
    margin: 0 auto 2rem auto;
    height: 3.5rem;
}
.condition div{
    display: inline-block;
    height: 100%;;
}
.condition div:nth-child(1){
    width: 25%;
    text-align: left;
    font-size: 2rem;
}
.condition div:nth-child(2){
    width: 25%;
    border-radius: 1rem;
    background: RGB(246,254,252);
    text-align: center;
    color: #29E0B0;
    line-height: 3.5rem;
    margin-right: 5%;
}
.condition div:nth-child(3){
    width: 40%;
    border-radius: 1rem;
    background: RGB(246,254,252);
    text-align: center;
    color: #29E0B0;
    line-height: 3.5rem;
}
.amountBox{
    width: 90%;
    margin: 0 auto 7% auto;
}
.amountBox div:nth-child(2){
    width: 100%;
    height: 5rem;
    margin: 2rem auto 0 auto;
    border-radius: 1rem;
    background : RGB(249,248,255);
    line-height: 5rem;
}
.amountBox div:nth-child(2) input{
    width: 70%;
    margin-left: 10%;
}
.amountBox div:nth-child(3){
    color: RGB(206,204,207);
    width: 80%;
    display: inline-block;
    margin-top: 1.5rem;
}
.amountBox div:nth-child(4){
    width: 20%;
    display: inline-block;
    margin-top: 1.5rem;
}
.contactPerson{
    position: absolute;
    width: 3rem;
    top: 62%;
    left: 71%;
}
.scanIt{
    position: absolute;
    width: 3rem;
    top: 62%;
    left: 85%;
}
.btn{
    width: 90%;
    height: 4rem;
    background: RGB(66,222,181);
    border-radius: 1rem;
    color: #ffffff;
    bottom: 7%;
    position: fixed;
    left: 5%;
    text-align: center;
    line-height: 4rem;
}
.success{
    width: 100%;
    height: 100%;
    background: #ffffff;
    position: fixed;
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
    margin: 58% auto 5% auto;
    text-align: center;
    line-height: 4rem;
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
    height: 50%;
    padding: 0 5%;
    left: 5%;
}
.purse p{
    margin-top: 2rem;
}
.currency{
    color: RGB(206, 204, 207);
    width: 100%;
    height: 67%;
    overflow-y: auto;
}
.pay{
    width: 80%;
    height: 40%;
    position: fixed;
    top: 20%;
    left: 10%;
    border-radius: 2rem;
    background: RGB(255,254,255);
    text-align: center;
}
.pay img:nth-child(1){
    width: 5%;
    position: absolute;
    left: 86%;
    top: 8%;
}
.pay p:nth-child(2){
    margin: 8% auto;
}
.pay div:nth-child(3){
    width: 80%;
    height: 5rem;
    margin: 15% auto;
    border-radius: 1rem;
    background: RGB(249,248,255);
    line-height: 5rem;
}
.pay div:nth-child(4){
    width: 80%;
    height: 5rem;
    margin: 5% auto;
    border-radius: 1rem;
    background: RGB(66,222,181);
    line-height: 5rem;
    color: RGB(249,246,250);
}



.cancel{
    color: RGB(206, 204, 207);
    text-align: center;
}

.black{
    color: black;
}
input{
    background:none;  
    outline:none;  
    border:none;
}
textarea{
    background:none;  
    outline:none;  
    border:none;
    line-height: 2rem;
    font-size: 1.5rem;
    width: 80%;
    margin: 1rem 10%;
}

</style>