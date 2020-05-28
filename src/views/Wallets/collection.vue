<template>
    <div class="maxBOX" ref="card">
        <div class="tab">
            <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
        </div>
        <div class="condition">
            <div><p>收款</p></div>
            <div @click="purseStatus = true"><p>{{currencyData[currencyIndex].name}}</p><img src="" alt=""></div>
            <div><p>{{currentWallet.name}}</p><img src="" alt=""></div>
        </div>
        
        <div class="pursecard" v-if="purseStatus" @click="purseStatus = false"></div>
        <div class="purse" v-if="purseStatus">
            <p class="boldfont">选择币种</p>
            <div class="currency">
                <p v-for="(item, index ,key) in currencyData"  :key="key" :class="{black:currencyIndex == index}" @click="selectIndex(index)">{{item.name}}</p>
            </div>
            <p class="cancel" @click="purseStatus = false">取消</p>
        </div>
        <div class="qrcodeBox">
            <qrcode-vue class="qrcode" :value="qrcode" :size="240" level="H"></qrcode-vue>
        </div>
        <div class="copy">
            <p :data-clipboard-text="currentWallet.name" @click="screenshotHandler">保存二维码</p>
        </div>
    </div>
</template>
<script>
import Clipboard from 'clipboard'
import html2canvas from 'html2canvas'
import QrcodeVue from 'qrcode.vue'



export default {
    components: {
        QrcodeVue
    },
    data(){
        return {
          purseStatus:false,
          qrcode:'',
          currencyIndex:0,
          currencyData:[
              
          ],
          token:''
        }
    },
    created(){
        this.currencyData = this.currentWallet.tokenList;
        this.token = this.currencyData[this.currencyIndex].name;
        this.generateQrcode();
    },
    methods:{
        selectIndex(data){
            this.currencyIndex = data;
            this.token = this.currencyData[this.currencyIndex].name;
        },
        generateQrcode() {
            this.qrcode = JSON.stringify({
                account: this.currentWallet.name,
                amount: '',
                token: this.token,
                action: 'pogreceive'
            })
        },
        screenshotHandler() {
            html2canvas(this.$refs.card,{
                backgroundColor: null,
                scale: 1.5
            }).then(canvas => {
                var image = new Image();
                let base64String = canvas.toDataURL("image/png")
                image.src = base64String
                var params = {data: base64String, prefix: 'myPrefix_', format: 'JPG', quality: 80, mediaScanner: true};
                window.imageSaver.saveBase64Image(params, this.onSaveImageSuccess, this.onSaveImageError);
            })
        },   
        onSaveImageSuccess(filePath){
            console.log('成功')
        },
        onSaveImageError(error){
            console.log('失败')
        },
    },
    computed:{
        currentWallet() {
            return this.$store.state.currentWallet 
        },
    },
    watch: {
        token() {
            this.generateQrcode()
        },
    },
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

.pursecard{
    background: black;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    z-index: 1;
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
    z-index: 1;
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
.qrcodeBox{
    width: 100%;
    margin: 12% auto;
}
.qrcode{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
.copy{
    width: 100%;
    text-align: center;
    font-weight: 600;
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