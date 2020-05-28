<template>
    <div class="maxBOX">
        <div class="stepOne" >
            <div class="tab">
                <!-- <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)"> -->
            </div>
            <p class="boldfont marBottom">早上好，欢迎使用</p>
            <div class="pursetab">
                <div class="pursetabGray" :class="{ pursetabGreen:purseAssetsIndex == 'Pog'}" @click="switchWallet('Pog')">POG</div>
                <div class="pursetabGray" :class="{ pursetabGreen:purseAssetsIndex == 'Eos'}" @click="switchWallet('Eos')">EOS</div>
                <div class="pursetabGray" :class="{ pursetabGreen:purseAssetsIndex == 'Eth'}" @click="switchWallet('Eth')">ETH</div>
            </div>
            <div class="heightBox" v-show="purseAssetsIndex == 'Pog'">
                <div class="">
                    <p>钱包名称</p>
                </div>
                <van-dropdown-menu >
                    <van-dropdown-item v-model="pogName" :options="currentName" />
                </van-dropdown-menu>
                <div class="BoxTwo gazy_normal" >
                    <p>钱包密码</p>
                    <input type="password" v-model="pogPassword" placeholder='请输入钱包密码验证'   >
                </div>
                <div class="next" @click="LoginPog"  >登录</div>
            </div>
            <div class="heightBox" v-show="purseAssetsIndex == 'Eos'">
                <div class="BoxTwo gazy_normal">
                    <p>钱包名称</p>
                    <input type="text" v-model="eosName" placeholder='请输入钱包名称 ' maxlength='12'  > 
                </div>
                <div class="BoxTwo gazy_normal" >
                    <p>钱包密码</p>
                    <input type="password" v-model="eosPassword" placeholder='请输入钱包密码验证'   >
                </div>
                <div class="next" @click="LoginEos"  >登录</div>
            </div>
            <div class="heightBox" v-show="purseAssetsIndex == 'Eth'">
                <div class="BoxTwo">
                    <p>钱包地址</p>
                    <div class="BoxOne" >
                        <textarea type="text"  v-model="ethAddress"  placeholder="请输入钱包地址"  ></textarea >
                    </div>
                </div>
                <div class="BoxTwo gazy_normal" >
                    <p>钱包密码</p>
                    <input type="password" v-model="ethPassword" placeholder='请输入钱包密码验证'   >
                </div>
                <div class="next" @click="LoginEth"  >登录</div>
            </div>
        </div>
 

    </div>
</template>
<script>
import PasswordService from '../../util/PasswordService'
import CryptoAES from '../../util/CryptoAES'
import { register } from "../../servers/register"
import dataBase from '@/common/js/dataBase.js'


export default {
    data(){
        return {
          pogName:0,
          pogPassword:'',
          eosName:'',
          eosPassword:'',
          ethAddress:'',
          ethPassword:'',
          purseAssetsIndex:'Pog',
          currentName:[],
        }
    },
    created(){
        if(JSON.stringify(this.$route.query ) == '{}'){
            this.switchWallet('Pog');
        }else{
            this.switchWallet(this.$route.query.data.chain,this.$route.query.data.name);
        }
        this.$nextTick(function () {
            // 修改vant下拉菜单的默认样式
            document.querySelector('.van-dropdown-menu__title').style = 'width: 100%;';
            document.querySelector('.van-dropdown-menu').style = 'border-bottom: 0.1rem solid RGB(179,179,179); margin-bottom: 6%;';
            document.styleSheets[0].addRule('.van-hairline--top-bottom::after','border-width: 0rem 0;');
        })
    },
    methods:{
        //数据库初始化
        dataBase_init(){
            //如果已经打开了数据库，先关闭这个数据库
            if(JSON.stringify(this.$store.state.dataBase) !== '{}'){
                dataBase.close(that.$store.state.dataBase);
            }
            // 打开当前选择账号数据库
            var request = dataBase.open_dataBase(this.currentName[this.pogName].text);
            let that = this;
            request.onsuccess = async function (event) {
                // console.log('拿到数据库对象存入vuex',request.result);
                that.$store.commit('dataBaseFun', request.result);
            };
        },
        jumpHome(){
            this.$router.push({name:"Home"});
        },
        switchWallet(data,name){
            this.purseAssetsIndex = data;
            this.currentName = [];
            this.wallets[data].forEach( ( item, index ) => {
                this.currentName.push({ text: item.name, value: index });
                if(item.name == name){
                    this.pogName = index;
                }
            });
        },
        async LoginPog(){
            this.$store.commit('pursecard_animateFun', true);
            this.$store.commit('login_animateFun', true);
            var localFile = this.$store.state.wallets;
            var wallets = localFile.Pog;
            if(wallets == ''){
                this.$store.commit('pursecard_animateFun', false);
                this.$store.commit('login_animateFun', false);
                this.$toast("没有POG钱包");
                return 
            }
            const elem = wallets.find((ele, index) => ele.name === this.currentName[this.pogName].text)
            if (elem) {
                let seed = await PasswordService.encrypt(this.pogPassword);
                let privateKey = CryptoAES.decrypt(elem.privateKey, seed);
                if(privateKey == ''){
                    this.$toast("密码错误");
                    this.$store.commit('pursecard_animateFun', false);
                    this.$store.commit('login_animateFun', false);
                }else{
                    // console.log('密码正确');
                    // 注册聊天权限
                    let res = await register(elem.name,privateKey, this.$store.state.regID);
                    let currdata = elem;
                    currdata.password = seed;
                    currdata.key = res;
                    this.$store.commit('currentWalletFun', currdata);
                    localStorage.setItem('current_wallet',JSON.stringify(currdata));
                    // console.log(this.$store.state.currentWallet);
                    this.$store.commit('pursecard_animateFun', false);
                    this.$store.commit('login_animateFun', false);
                    this.dataBase_init();
                    this.jumpHome();
                }
            }else{
                this.$store.commit('pursecard_animateFun', false);
                this.$store.commit('login_animateFun', false);
                console.log('不存在');this.$toast("钱包不存在");
            }
        },
        async LoginEos(){
            var localFile = this.$store.state.wallets;
            var wallets = localFile.Eos;
            if(wallets == ''){
                return console.log('没有Eos钱包')
            }
        },
        async LoginEth(){
            var localFile = this.$store.state.wallets;
            var wallets = localFile.Eth;
            if(wallets == ''){
                return console.log('没有ETH钱包')
            }
            const elem = wallets.find((ele, index) => ele.address === this.ethAddress)
            if (elem) {
                console.log('钱包已经存在');
                let seed = await PasswordService.encrypt(this.ethPassword);
                let privateKey = CryptoAES.decrypt(elem.privateKey, seed);
                if(privateKey == ''){
                    console.log('密码错误');
                }else{
                    console.log('密码正确');
                    let currdata = elem;
                    currdata.password = seed;
                    this.$store.commit('currentWalletFun', currdata);
                    localStorage.setItem('current_wallet',JSON.stringify(currdata));
                    console.log(this.$store.state.currentWallet);
                    this.jumpHome();
                }
            }else{
                console.log('不存在');
            }
        },
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
.heightBox{
    /* height: 100%; */
    position: relative;
}
.stepOne{
    width: 90%;
    height: 100%;
    margin: 0 auto;   
}
.tab{
    width: 100%;
    margin: 0 auto 3rem auto;
    height: 3rem;
}
.tab img{
    width: 3rem;
}
.BoxTwo{
    width: 100%;
    margin-bottom: 3rem;
}
.BoxTwo input{
    width: 100%;
    height: 3rem;
}
.BoxTwo p:nth-child(1){
    margin-bottom: 2rem;
}
.next{
    width: 90%;
    height: 5rem;
    background: RGB(66,222,181);
    border-radius: 1rem;
    color: #ffffff;
    margin-top: 55%;
    position: relative;
    left: 5%;
    text-align: center;
    line-height: 5rem;
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
    border: 0.1rem solid RGB(235,251,248);
    color: RGB(52,204,186);
    background: RGB(235,251,248);
    margin-right: 5%;
}
.BoxOne{
    border-radius: 1rem;
    width: 100%;
    height: 15%;
    margin:  1.5rem 0 1rem 0;
    border: 0.1rem solid RGB(179,179,179);
}
.BoxOne textarea{
    width: 90%;
    margin: 1rem 5%;
    height: 75%;
}


.red{
    color: RGB(242,133,134);;
}
.gazy_normal{
    border-bottom: 0.1rem solid RGB(179,179,179);
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