<template>
    <div class="maxBOX">
        <div class="tab">
            <p>我的</p>
        </div>
        <div class="space"></div>
        <div class="itemBox">
            <div @click="jumpRouter('Setting')">
                <p>系统设置</p>
                <img src="@/assets/images/setting.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>




export default {
    data(){
        return {
           
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
    height: 3%;
}
.tab p{
    position: relative;
    text-align: center;
}
.space{
    width: 100%;
    height: 4%;
    background: RGB(248,249,255);
}
.boldfont{
    font-weight:bold;
    font-size: 1.8rem;
}
.itemBox{
    width: 100%;
    height: 90%;
    background: RGB(248,249,255);
    position: relative;
}
.itemBox div{
    position: relative;
    width: 92%;
    height: 9%;
    margin: 0 auto 2rem auto;
    background: RGB(255,255,255);
    box-shadow: 0.1333rem 0.1333rem 0.13333rem #e9e9e9;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.itemBox  p{

}
.itemBox img{
    position: absolute;
    width: 10%;
    left: 9%;
}

</style>