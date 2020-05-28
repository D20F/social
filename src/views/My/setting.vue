<template>
    <div class="maxBOX">
        <div class="tab">
            <p>系统设置</p>
            <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
        </div>
        <div class="itemBox">
            <div @click="showpassword = true">
                <p>导出私钥</p>
                <img src="@/assets/img/right.png" alt="">
            </div>
            <div>
                <p>语言</p>
                <img src="@/assets/img/right.png" alt="">
            </div>
            <div>
                <p>货币单位</p>
                <img src="@/assets/img/right.png" alt="">
            </div>
            <div @click="checkVersion">
                <p>检查新版本{{version}}</p>
                <img src="@/assets/img/right.png" alt="">
            </div>
        </div>

        <version v-if="$store.state.showUpdateDialog" :versionData = 'versionData'></version>
        <password v-if="showpassword" @parent_check = 'check' @parent_close = 'close_password'></password>
        <div class="privateBox" v-if="privateKey">
            <img src="@/assets/img/chacha.png" alt="" @click="close_privatekey">
            <p >我的私钥</p>
            <p >{{privateKey}}</p>
        </div>
    </div>
</template>
<script>
import getversion from '@/common/js/getVersion.js';
import CryptoAES from '@/util/CryptoAES';
import PasswordService from '../../util/PasswordService';

export default {
    data(){
        return {
            versionData:'',
            privateKey:'',
            showpassword:false,
        }
    },
    created(){
      
    },
    methods:{
        check(data){
            this.privateKey = data;
            this.$store.commit('pursecard_animateFun', true);
            this.showpassword = false;
            this.password = '';
        },
        close_password(){
            this.showpassword = false;
            this.password = '';
        },
        close_privatekey(){
            this.$store.commit('pursecard_animateFun', false);
            this.privateKey = '';
        },
        async checkVersion() {
            this.versionData = await getversion();
            const u = navigator.userAgent;
            const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            let versionName,downloadUrl;
            if (isAndroid) {
                versionName = this.versionData.android.versionName;
                downloadUrl = this.versionData.android.downloadUrl;
            }else if (isiOS) {
                versionName = this.versionData.ios.versionName;
                downloadUrl = this.versionData.ios.downloadUrl;
            }
            if (downloadUrl) {
                cordova.getAppVersion.getVersionNumber().then(version => {
                    if (versionName && version !== versionName) {
                        // this.showDialog = true;
                        this.$store.commit('setUpdateDialog', true );
                    }else {
                        this.$toast('已经是最新版本');
                    }
                })
            }
        },
    },
    computed:{
        version() {
            return this.$store.state.version 
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
    display: flex;
    justify-content: center;
    align-items: center;
}
.tab img{
    position: absolute;
    width: 3rem;
    left: 0%;
}
.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}
.itemBox{
    width: 100%;
    height: 90%;
    position: relative;
}
.itemBox div{
    position: relative;
    width: 100%;
    height: 6rem;
    border-bottom: 1px solid RGB(248,249,255);
    display: flex;
    align-items: center;
    margin-left: 6%;
}
.itemBox  p{

}
.itemBox img{
    position: absolute;
    width: 2%;
    right: 9%;
}



.privateBox{
    width: 80%;
    height: 28rem;
    position: absolute;
    top: 22%;
    left: 10%;
    z-index: 110;
    background: #ffffff;
    border-radius: 3rem;
}
.privateBox img{
    position: absolute;
    top: 5%;
    right: 5%;
}
.privateBox p:nth-child(2){
    text-align: center;
    position: relative;
    margin-bottom: 15%;
    top: 15%;
    font-size: 1.8rem;
    word-wrap: break-word;
}

.privateBox p:nth-child(3){
    width: 90%;
    margin: 0 auto;
    text-align: left;
    position: relative;
    top: 15%;
    font-size: 1.8rem;
    word-wrap: break-word;
}





</style>