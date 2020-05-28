<template>
    <div class="maxBox" >
        <topbar title ='设置标签' mode = '1' @parent_finish = 'finish' ></topbar>
        <div class="tagname">
            <p>标签名称</p>
            <input type="text" v-model="tagMsg">
            <p>标签成员( {{Listlength}} )</p>
        </div>
        <index-bar v-if="Object.keys(friendList).length > 0" style="margin-bottom:5rem">
            <template v-for="(item,index) in friendList">
                <index-anchor :index="index" :key="index"/>
                <div class="friend_list"  
                    v-for="(child,childIndex) in item"
                    :key="index+'-'+childIndex"
                    @click="toInfo(child)">
                    <div class="friend_image">
                        <img class="img_tile" 
                            src="@/assets/images/header.png" 
                            alt="" 
                            srcset="">
                    </div>
                    <div class="friend_info">
                        <div class="friend_name">{{child.name}}</div>
                        <div class="friend_number">{{child.account}}</div>
                    </div>
                </div>
            </template>
        </index-bar>
    </div>
</template>
<script>
import { Search, SwipeCell, IndexBar, IndexAnchor } from "vant";
import dataLetterSort from "@/common/js/letter.js";
import dataBase from '@/common/js/dataBase.js'

export default {
    components: { Search, SwipeCell, IndexBar, IndexAnchor },
    data(){
        return {
            friendList: [],
            tagMsg:'',
            Listlength:0,
        }
    },
    created(){
      this.init();
    },
    methods:{
        // 查找数据库的标签表，用name属性判断哪个标签
        async init(){
            let data = await dataBase.get_index(this.$store.state.dataBase,'tagList','name',this.$route.query.data.name);
            this.tagMsg = data.name;
            this.Listlength = data.data.length;
            if(JSON.stringify(data.data) !== '[]'){
                this.friendList = dataLetterSort(data.data,"name");
                // console.log(this.friendList)
            }else{
                this.friendList=[];
            }
        },
        toInfo(item){
            let info = {
                name:item.name,
                account:item.account
            }
            this.$router.push({path:"/linkmanInfo",query:info})
        },
        // 修改标签名
        async finish(){
            let data = await dataBase.get_index(this.$store.state.dataBase,'tagList','name',this.$route.query.data.name);
            data.name = this.tagMsg;
            dataBase.update(this.$store.state.dataBase,'tagList',data);
            this.$router.go(-1);
        }
    },
   
}
</script>
<style scoped lang="scss">
@import "@/common/css/page_title.scss";
div{vertical-align: top;}
.maxBox{
    font-size: 1.5rem;
    width: 100%;
    height: 100%;
    position: relative;
}
.friend_list{
    padding: 1.2rem;
    .friend_image{
        display: inline-block;
        width: 5rem;
        height: 5rem;
        img{
            border-radius:50%;
        }
    }
    .friend_info{
        width: 16rem;
        display: inline-block;
        vertical-align: top;
        margin: 0 1.4rem;
        .friend_name{
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: .5rem;
            margin-bottom: 1rem;
        }
        .friend_number{
            font-size: 1.5rem;
            color: #B2B2B2;
        }
    }
}
.tagname{
    width: 90%;
    margin: 0 auto;
    height: 15%;
    p{
        
    }
    input{
        width: 100%;
        border-bottom: 1px solid RGB(39, 224, 173);
        margin-bottom: 7%;
        margin-top: 3%;
        color: black;
        padding-bottom: .8rem;
    }
}
</style>