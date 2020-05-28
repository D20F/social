<template>
    <div class="maxBOX" style="height:100%;">
        <div class="tab">
            <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
            <p class="boldfont">{{page.name}}</p>
        </div>
        <div class="content">
            <img :src='page.logo' alt="">
            <p>账户余额 ({{page.name}})</p>
            <p>{{page.balance}}</p>
        </div>
        <div class="typeTab" >
            <div :class="{green : tabindex==1}" @click="selectTabIndex(1)">全部</div>
            <div :class="{green : tabindex==2}" @click="selectTabIndex(2)">转账</div>
            <div :class="{green : tabindex==3}" @click="selectTabIndex(3)">收款</div>
        </div>
        <div class="detailsBox">
            <div v-for="(item, key) in detailsData"  :key="key" class="details" >
                <div>
                    <img src='../.././assets/img/icon_transfer_prompt@3x.png' alt="" v-show="item.status == '转账'">
                    <img src='../.././assets/img/icon_collection_prompt@3x.png' alt="" v-show="item.status == '收款'">
                </div>
                <div>
                    <p class="boldfont">{{item.status}}</p>
                    <p>{{item.block_time}}</p>
                </div>
                <div>
                    <p class="boldfont" v-show="item.status == '转账'">- {{item.quantity}}</p>
                    <p class="boldfont" v-show="item.status == '收款'">+ {{item.quantity}}</p>
                    <p>￥{{item.quantity}}</p>
                </div>
            </div>
        </div>
        <div class="btnBox">
            <div @click="jumpRouter('transfer')"><img src="../.././assets/img/button_icon_transfer@3x.png" alt=""><span>转账</span></div>
            <div @click="jumpRouter('collection')"><img src="../.././assets/img/button_icon_collection@3x.png" alt=""><span>收款</span></div>
        </div>
    </div>
</template>
<script>
import { format, parse } from 'date-fns'
import {Decimal} from 'decimal.js'
import serverApi from '../../servers/blockChain/serviceApi'; 
import { dateToTimePoint } from 'eosjs/dist/eosjs-serialize';

export default {
    data(){
        return {
            tabindex:1,
            page:{},
            detailsData:[
               
            ]
        }
    },
    created(){
        console.log(this.$router.currentRoute.query.data);
        this.page = this.$router.currentRoute.query.data;
        this.loadData('');
    },
    methods:{
        jumpRouter(data){
            this.$router.push({ name: data})
        },
        selectTabIndex(data){
            this.tabindex = data;
            if(this.tabindex == 1){
                this.loadData('')
            }else if(this.tabindex == 2){
                this.loadData('out')
            }else{
                this.loadData('in')
            }
        },
        async loadData(data){
            const res = await serverApi.getPogTransfers({
                account_name: this.currentWallet.name,
                symbol: this.page.name,
                direction:data,
                page: 1
            })
            res.data.actList.forEach(item => {
                item.block_time = new Date(new Date(item.block_time).setHours(new Date(item.block_time).getHours() + 8));
                item.block_time = format(new Date(item.block_time), 'YYYY-MM-DD HH:mm:ss');
                item.status == 'out' ? item.status = '转账': item.status = '收款';
            });
            this.detailsData = res.data.actList;
            console.log(this.detailsData)
        }
    },
    computed:{
        currentWallet() {
            return this.$store.state.currentWallet 
        },
    }
}
</script>
<style scoped>
div{position: relative;}
/* p{
    margin: 1rem;
} */
.tab{
    width: 100%;
    margin: 13% auto;   
    height: 3rem;
}
.tab p{
    text-align: center;
    line-height: 3rem;
}
.tab img{
    width: 3rem;
    position: absolute;
    left: 5%;
}
.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}
.content{
    text-align: center;
    width: 100%;
}
.content :nth-child(1){
    width: 15%;
    margin-bottom: 5%;
}
.content :nth-child(2){
    font-size: 1.5rem;
    color: RGB(66,222,181);
    margin-bottom: 4%;
}
.content :nth-child(3){
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 10%;
}

.typeTab{
    width: 90%;
    margin: 0 auto;
}
.typeTab div{
    display: inline-block;
    width: 33.3%;
    height: 3rem;
    text-align: center;
    font-size: 1.5rem;
}
.green{
    border-bottom: .4rem solid RGB(66,222,181);
    color: RGB(66,222,181);
}
.detailsBox{
    width: 100%;
    height: 45%;
    overflow-y: auto;
}
.details{
    width: 100%;
}
.details div{
    display: inline-block;
    height: 4rem;
    margin: 1rem 0;
}
.details img{
    width: 50%;
    position: relative;
    top: 26%;
    left: 27%;
}
.details div:nth-child(1){
    width: 4rem;
    vertical-align: top;
    margin: 1rem 1rem;
    height: 4rem;
}
.details div:nth-child(2){
    width: 40%;
    vertical-align: top;
}
.details div:nth-child(3){
    width: 40%;
    vertical-align: top;
    text-align: right;
}
.details div:nth-child(2) p:nth-child(1){
    margin: 0 0 .5rem 0;
}
.details div:nth-child(2) p:nth-child(2){
    margin: 0;
    color: RGB(206,204,207);
}
.details div:nth-child(3) p:nth-child(1){
    margin: 0 0 .5rem 0;
}
.details div:nth-child(3) p:nth-child(2){
    margin: 0;
}
.details div:nth-child(3) p:nth-child(3){
    margin: 0;
    color: RGB(206,204,207);
}
.btnBox{
    width: 100%;
    height: 13%;
    margin: 0 auto;
    position: fixed;
    bottom: 0%;
    text-align: center;
    font-size: 1.5rem;
    background: #ffffff;
}
.btnBox img{
    width: 20%;
    position: relative;
    top: 21%;
}
.btnBox div:nth-child(1){
    width: 45%;
    height: 5.5rem;
    display: inline-block;
    border: 0.1rem solid RGB(66,222,181);
    color: RGB(66,222,181);
    border-radius: 1rem;
    margin-right: 3%;
}
.btnBox div:nth-child(2){
    width: 45%;
    height: 5.5rem;
    display: inline-block;
    background: RGB(66,222,181);
    border-radius: 1rem;
    color: #ffffff;
}
</style>