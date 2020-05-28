<template>
    <div class="maxBOX">
        <div class="stepOne" v-show="stepState<3" @click="stepState = 2">
            <img src="../.././assets/img/logo@3x.png" alt="">
            <p>欢迎使用earless</p>
            <img src="../.././assets/img/zuojianto@3x.png" alt="">
        </div>
        <div class="blackcard" v-show="stepState == 2" ></div>
        <div class="stepTwo" v-show="stepState == 2" >
            <p @click="stepState = 3">创建钱包</p>
            <p @click="stepState = 4">导入钱包</p>
        </div>
        <div class="stepThree" v-show="stepState == 3">
            <img src="../.././assets/img/cancels_icon.png" alt="" @click="stepState = 1">
            <p>选择底层</p>
            <div class="stepThreeTab" @click="jumpRouter('createWalletPog')">
                <div><img src="../.././assets/img/system_pog.png" alt=""></div>
                <div><p>POG</p></div>
            </div>
            <div class="stepThreeTab" @click="jumpRouter('createWalletEos')">
                <div><img src="../.././assets/img/wallet_img_eos@3x.png" alt=""></div>
                <div><p>EOS</p></div>
            </div>
            <div class="stepThreeTab" @click="jumpRouter('createWalletEth')">
                <div><img src="../.././assets/img/wallet_icon_eth@3x.png" alt=""></div>
                <div><p>ETH</p></div>
            </div>
        </div>
        <div class="stepThree" v-show="stepState == 4">
            <img src="../.././assets/img/cancels_icon.png" alt="" @click="stepState = 1">
            <p>选择底层</p>
            <div class="stepThreeTab"  @click="jumpRouter('importWalletPog')">
                <div><img src="../.././assets/img/system_pog.png" alt=""></div>
                <div><p>POG</p></div>
            </div>
            <div class="stepThreeTab"  @click="jumpRouter('importWalletEos')">
                <div><img src="../.././assets/img/wallet_img_eos@3x.png" alt=""></div>
                <div><p>EOS</p></div>
            </div>
            <div class="stepThreeTab"  @click="jumpRouter('importWalletEth')">
                <div><img src="../.././assets/img/wallet_icon_eth@3x.png" alt=""></div>
                <div><p>ETH</p></div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    data(){
        return {
          stepState:1,
        }
    },
    created(){

    },
    methods:{
        jumpRouter(name,data){
            this.$router.push({ name: name, query: { data: data }})
        },
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
    width: 100%;
    height: 100%;
}
.stepOne img:nth-child(1){
    width: 8rem;
    margin: 30% 0 0 10% ;
}
.stepOne p:nth-child(2){
    color: RGB(206,204,207);
    margin: 5% 0 0 10% ;
}
.stepOne img:nth-child(3){
    margin: 20% 0 0 10% ;
    width: 5rem;
    transform: rotate(180deg);
}
.stepTwo{
    background: RGB(255,254,255);
    position: absolute;
    top: 75%;
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





.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}

</style>