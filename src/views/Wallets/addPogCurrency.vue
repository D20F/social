<template>
    <div class="MaxBox">
      <div class="header">
        <div class="back_page">
          <img class="ion_back" @click="clickCancel" src="../.././assets/img/encourage_back.png">
        </div>
        <div class="item_search">
          <img src="../.././assets/img/addToken_search.png">
          <input type="search" placeholder="TOKEN / 合约地址" class="text-input search" v-model="search">
        </div>
      </div>
      <div ref="mescroll" class="mescroll">
          <div class="token" v-for="(item) in tokens"  :key="item.id">
                <img class="token_icon" :src="item.logo" v-if="item.logo">
                <img class="token_icon" src="../.././assets/img/question.png" v-else>
                <div class="token_text">
                    <div class="token_name">{{item.symbol}}</div>
                    <div class="token_contract">{{item.account_name}}</div>
                </div>
                <div :class="{btnOne:item.checked,btnTwo:!item.checked}"  @click="clickCheck(item)"></div>
          </div>
      </div>

    </div>
</template>
<script>
import { getAllTokens } from '../../servers'
import MeScroll from 'mescroll.js'
import 'mescroll.js/mescroll.min.css'

export default {
    data() {
        return {
            mescroll: null,
            tokens: [],
            search: '',
            page: 0
        }
    },
    created(){
        this.loadData();
    },
    watch: {
        search(newVal) {
            console.error(0)
            this.searchToken()
        }
    },
    methods: {
        async searchToken() {    // 输入框变化时，重置页码和列表再发送请求
            this.page = 1
            this.tokens = []
            this.loadData()
        },
        async loadData() {
            try {
                const res = await getAllTokens({
                    symbol:this.search.toUpperCase(),
                    page:this.page,
                    limit:20,
                    chain_type: 'pog'
                })
                let token = this.$store.state.currentWallet.tokenList;
                if(token == ''){
                    for (let item of res.data) {
                        item.checked = false;
                        this.tokens = res.data;
                    }
                }else{
                    for (let item of res.data) {
                        let temp = token.find(ele => (ele.name == item.name))
                        if (temp) {
                            item.checked = temp.checked;
                        } else {
                            item.checked = false
                        }
                    }
                    this.tokens = res.data;
                }
                console.log(this.tokens);
            } catch (error) {
                console.log(error)
            }
        },
        async clickCheck(item){
            if(item.checked){
                this.deleteCheck(item);
            }else{
                this.addCheck(item);
            }
        },
        async addCheck(item) {
            let currentWallet = this.$store.state.currentWallet;
            let token = currentWallet.tokenList;
            let localFile = this.$store.state.wallets;
            let wallets = localFile.Pog;
            let temp = this.tokens.find(ele => (ele.name == item.name))
            if (temp) {
                temp.checked = true;
                token.push(temp);
            }
            let test = wallets.find(ele => (ele.name == currentWallet.name))
            if (test) {
                test.tokenList = token;
            }
            this.$store.commit('walletsFun', localFile)
            this.$store.commit('currentWalletFun', currentWallet)
            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
            localStorage.setItem('current_wallet',JSON.stringify(currentWallet))
            this.loadData();
        },
        async deleteCheck(item) {
            let currentWallet = this.$store.state.currentWallet;
            let token = currentWallet.tokenList;
            let localFile = this.$store.state.wallets;
            let wallets = localFile.Pog;
            let temp = this.tokens.find(ele => (ele.name == item.name))
            if (temp) {
                temp.checked = false;
                let index = token.findIndex(ele => (ele.name == item.name))
                if(index !== -1){
                    token.splice(index,1)
                }
            }
            let test = wallets.find(ele => (ele.name == currentWallet.name))
            if (test) {
                test.tokenList = token;
            }
            this.$store.commit('walletsFun', localFile)
            this.$store.commit('currentWalletFun', currentWallet)
            localStorage.setItem('isecsp_wallet',JSON.stringify(localFile))
            localStorage.setItem('current_wallet',JSON.stringify(currentWallet))
            this.loadData();
        },
        clickCancel() {
            this.$router.go(-1)
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
div{position: relative;vertical-align: top;}
p{margin: 0;}
.header {
    width: 100%;
    height: 6%;
    margin: 2rem 0;
    font-size: 3rem;
}
.back_page{
    width: 10%;
    margin: 0 5%;
    display: inline-block;
}
.back_page>img{
    width: 100%;
}
.item_search {
    display: inline-block;
    background-color: RGB(248,249,255);
    width: 70%;
    height: 4rem;
    border-radius: 2.5rem;
}
.item_search img {
    width: 8%;
    position: absolute;
    top: 27%;
    left: 7%;
}
.item_search input {
    height: 80%;
    width: 75%;
    font-size: 1.8rem;
    margin-left: 20%;
}
.item_cancel {
    height: 76px;
    padding: 0 20px;
    color: RGB(210, 172, 116);
}
.mescroll {
    width: 100%;
}
.token {
    display: flex;
    align-items: center;
    width: 90%;
    margin: 0 5% 5% 5%;
}
.token_text {
    margin-left: 8%;
    flex: 1;
}
.token_name {
    font-size: 1.8rem;
    line-height: 1.5;
}
.token_contract {
    font-size: 1.8rem;
    line-height: 1.5;
    color: grey;
}
.token_icon {
    width: 15%;
}
.btnOne {
    width: 10%;
    height: 4rem;
    background-size: 100%;
    background-image: url('../.././assets/img/addToken_true.png');
    background-repeat: no-repeat;
}
.btnTwo {
    width: 10%;
    background-size: 100%;
    height: 4rem;
    background-image: url('../.././assets/img/addToken_add.png');
    background-repeat: no-repeat;
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
</style>