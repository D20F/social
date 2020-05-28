<template>
    <div class="maxBOX">
        <div class="tab">
            <img src="../.././assets/img/wallet_home_ic_return_w.png" alt="" @click="$router.go(-1)">
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
        
    },
    computed:{
        
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

</style>