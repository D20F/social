<template>
    <div class="topbar" >
        <div class="tab" v-if="mode == 1">
            <img src="@/assets/img/wallet_home_ic_return_w.png" alt="" @click="back">
            <p>{{title}}</p>
            <p style="color: RGB(39, 224, 173);" @click="$emit('parent_finish')">完成</p>
        </div>
        <div class="tab" v-if="mode == 2">
            <p @click="back">取消</p>
            <p>{{title}}</p>
            <p style="color: RGB(39, 224, 173);" @click="$emit('parent_finish')">完成</p>
        </div>
        <div class="tabtwo" v-if="mode == 3">
            <p @click="back">取消</p>
            <p>{{title}}</p>
        </div>
        <div class="tabtwo" v-if="mode == 4">
            <img src="@/assets/img/wallet_home_ic_return_w.png" alt="" @click="back">
            <p>{{title}}</p>
        </div>
    </div>
</template>
<script>
import { arrayToHex } from 'eosjs/dist/eosjs-serialize'


/**
 * 顶部栏组件 
 * @param {number}  mode             顶部栏模式       代表不同样式
 * @param {string}  title            标题属性           
 * @param {Array}   backMode         back返回模式     不传默认为back-1模式  传入数字[-1]返回上一层  传入数组[进入的路由名字, 传递的参数]
**/

export default {
    name: 'topbar',
    props:['title', 'mode', 'backMode'],
    data(){
        return {

        }
    },
    created(){
      
    },
    methods:{
        back(){
            if(this.backMode == undefined){
                this.$router.back(-1)
            }else{
                this.$router.push({name:this.backMode[0],query:{data:this.backMode[1]}})
            }
        }
    }
   
}
</script>
<style scoped>
div{vertical-align: top;}
.topbar{
    width: 100%;
    height: 10%;
    position: relative;
}
.tab{
    width: 90%;
    margin: 0rem auto;   
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
}
.tab img{
    width: 3rem;
}
.tabtwo{
    width: 90%;
    margin: 0rem auto;   
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
}
.tabtwo img{
    width: 3rem;
    position: absolute;
    left: 3%;
}

</style>