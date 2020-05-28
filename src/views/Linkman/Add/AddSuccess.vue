<template>
    <div>
        <div class="image">
            <img class="img_tile" src="@/assets/images/success.png" alt="" srcset="">
        </div>
        <div class="info">
            <p>添加成功</p>
            <p>恭喜您，添加联系人成功</p>
        </div>
        <div class="button_box">
            <van-button type="primary" 
                        @click="pass"
                        block>
                确定
            </van-button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        pass(){
            this.$router.replace(location)
            this.$router.push({path:"/"})
        }
    }
}
</script>
<style lang="scss" scoped>
    .image{
        margin: 9rem auto 3rem;
        width: 7rem;
        height: 7rem;
    }
    .info{
        text-align: center;
        p:nth-child(1){
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
        }
        p:nth-child(2){
            color:#ccc
        }
    }
    .button_box{
        margin: 8rem;
    }
</style>