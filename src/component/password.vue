<template>
    <div class="password" >
        <pursecard></pursecard>
        <div class="passwordBox">
            <p>请输入密码</p>
            <img src="@/assets/img/chacha.png" alt="" @click="$emit('parent_close')">
            <div >
                <input type="password" v-model="password" placeholder='请输入钱包密码验证'   >
            </div>
            <div class="next" @click="child_check">确认</div>
        </div>
    </div>
</template>
<script>
import CryptoAES from '@/util/CryptoAES';
import PasswordService from '../util/PasswordService';



export default {
    name: 'password',
    data(){
        return {
            password:'',
        }
    },
    created(){
      
    },
    methods:{
        async child_check(){
            try {
                let seed = await PasswordService.encrypt(this.password);
                let privateKey = CryptoAES.decrypt(this.$storage.get("current_wallet").privateKey, seed);
                this.$emit('parent_check',privateKey);
            } catch (error) {
                console.log(error);
                this.$toast('密码错误，请再次输入')
            }
        },
    }
   
}
</script>
<style scoped>
div{vertical-align: top;}
.password{
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}
.passwordBox{
    width: 80%;
    height: 28rem;
    position: absolute;
    top: 22%;
    left: 10%;
    z-index: 110;
    background: #ffffff;
    border-radius: 3rem;
}
.passwordBox img{
    position: absolute;
    top: 5%;
    right: 5%;
}
.passwordBox p{
    text-align: center;
    position: relative;
    top: 15%;
    font-size: 1.8rem;
    word-wrap: break-word;
}
.passwordBox div:nth-child(3){
    width: 90%;
    margin: 0 auto;
    background: rgb(248, 249, 255);
    height: 15%;
    border-radius: 2rem;
    position: relative;
    top: 30%;
}
.passwordBox input{
    width: 80%;
    height: 100%;
    margin-left: 10%;
}

.next{
    width: 90%;
    height: 5rem;
    background: RGB(66,222,181);
    border-radius: 1rem;
    color: #ffffff;
    position: relative;
    left: 5%;
    top: 50%;
    text-align: center;
    line-height: 5rem;
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