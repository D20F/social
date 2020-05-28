<template>
    <div class="maxBOX">
        <pursecard ></pursecard>
        <div class="versionBox" >
        <p class="verp">发现新版本{{versionData.android.versionName}}</p>
        <div v-for="(item,index) in versionDesc" :key="index" class="verdata">
            <p>{{item}}</p>
        </div>
        <div class="confirm" @click="confirm">立即更新</div>
        <img v-if="!isUpdate" src="@/assets/img/chacha.png" alt="" class="cancel" @click="cancel">
        </div>
    </div>
</template>
<script>
import axios from 'axios';

import getversion from '@/common/js/getVersion.js'


export default {
    name: 'version',
    props:['versionData'],
    data(){
        return {
            versionDesc:[],
            isUpdate:false
        }
    },
    created(){
        // console.log(this.versionData)
        this.checkVersion();
    },
    methods:{
        checkVersion() {
            const u = navigator.userAgent;
            const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                this.versionDesc = this.versionData.android.versionDesc;
                this.isUpdate = this.versionData.android.isUpdate;
            }
            if (isiOS) {
                this.versionDesc = this.versionData.ios.versionDesc;
            }
        },
        confirm() {
            const u = navigator.userAgent;
            const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                window.open(this.versionData.android.downloadUrl, '_system', 'location=yes');
            }
            if (isiOS) {
                window.open(this.versionData.ios.downloadUrl, '_system', 'location=yes');
            }
        },
        cancel() {
            this.$store.commit('setUpdatePass', "true");
            this.$store.commit('setUpdateDialog', false );
        },
    },
    computed:{
        version() {
            return this.$store.state.version 
        }
    },
    watch:{
        "$store.state.showUpdateDialog": function (val,oval){
            this.show = val;
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
    position: fixed;
    top: 0;
    z-index: 10;

}

.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}



.pursecard{
    background: black;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    z-index: 10;
}
.versionBox{
    position: absolute;
    top: 20%;
    z-index: 100;
    width: 80%;
    min-height: 30%;
    left: 10%;
      border-radius: 3rem;
    background: RGB(255,255,255);
}
.verdata{
    margin: 3% 0 3% 3%;
}
.verp{
    text-align: center;
    margin-top: 6%;
    font-size: 2rem;
    color: RGB(39, 224, 173);
}
.cancel{
    width: 10%;
    position: absolute;
    bottom: -28%;
    left: 45%;
}
.confirm{
    background: RGB(39, 224, 173);
    width: 50%;
    height: 4rem;
    font-size: 1.6rem;
    color: RGB(255,255,255);
    border-radius: 0.8rem;
    position: absolute;
    bottom: 10%;
    right: 25%;
    line-height: 4rem;
    text-align: center;
}
</style>