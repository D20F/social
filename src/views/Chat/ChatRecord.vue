<template>
    <div class="maxBox" >
        <topbar title ='查找聊天记录' mode = '4' ></topbar>
        <!-- 筛选框 -->
        <search class="search_style" 
            v-model="search_value" 
            shape="round" 
            placeholder="请输入搜索关键词"
            @input="input" />
        <div class="listbox" v-for="(item, index) in chatList" :key='index'>
            <div>
                <img src="@/assets/images/header.png" alt="">
            </div>
            <div>
                <p>{{item.from}}</p>
                <p>{{item.content}}</p>
            </div>
            <div>
                <p>{{item.create_time}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { Search } from 'vant';
import dataBase from '@/common/js/dataBase.js'
import time from '@/common/js/time.js'
import { format, parse } from "date-fns";



export default {
    components:{Search},
    data(){
        return {
            search_value:'',
            List:[],
            chatList:[],
            backMode:[],
        }
    },
    created(){
      this.init();
    },
    methods:{
        async init(){
            this.List = await dataBase.readAll(this.$store.state.dataBase, this.$router.currentRoute.query.data);
            for(let item of this.List){
                let content = this.decrypt_msg(item);
                item.content = content;
                item.create_time = format(parse(time.time_Data(item.create_time)),'MM-DD HH:mm:ss')
            }
        },
        // 搜索功能
        input(value){
            if(value == ''){
                return  this.chatList = [];
            }
            let data = [];
            let base = JSON.parse(JSON.stringify(this.List));
            for(let item of base){
                if(item.content.indexOf(value) !== -1){
                    data.push(item)
                }
            }
            this.chatList = data;
        },
        //解密
        decrypt_msg(data){
            try{
                let content = decodeURIComponent(escape(atob(data.content)));
                return content;
            }catch(err){
                return data.content;
            }
        },
    }
   
}
</script>
<style scoped lang="scss">
div{vertical-align: top;}
.maxBox{
    font-size: 1.5rem;
    width: 100%;
    height: 100%;
    position: relative;
}
.search_style{
    position: relative;
    background: #fff;
    z-index: 5;
}
.listbox{
    width: 90%;
    height: 5rem;
    margin: 0 auto;
    padding: 1% 0;
    border-bottom: 1px solid #ebedf0;
    div{
        height: 100%;
        display: inline-block
    }
}
.listbox div:nth-child(1){
    width: 15%;
}
.listbox div:nth-child(1) img{
    width: 80%;
}
.listbox div:nth-child(2){
    width: 59%;
    margin: 0 3%;
}
.listbox div:nth-child(2) p:nth-child(1){
    margin-bottom: 3%;
}
.listbox div:nth-child(3){
    width: 20%;

}
</style>