<template>
  <div class="maxBox">
    <!-- 顶部信息 -->
    <topbar title ='添加标签' mode = '1' @parent_finish = 'finish' ></topbar>
    <!-- 表单 -->
    <div class="form">
        <div class="sub_title">标签名称</div>
        <input type="text" placeholder="输入标签名称" v-model="tagList">
        <div class="sub_title">标签成员({{result.length}})</div>
        <div class="pitch_list">
            <div v-for="(item,index) in result" :key="index">
                {{item.name}}
            </div>
        </div>
    </div>
    <!-- 底部按钮 -->
    <div class="bottom_btn">
        <van-button type="primary" 
                    plain 
                    @click="showAddMenu"
                    icon="plus"
                    block>
            添加成员
        </van-button>
    </div>
    <!-- 添加成员 -->
    <popup
        v-model="personMenu"
        round
        closeable
        position="bottom"
        class="popup_style">
        <index-bar style="margin-top:.5rem">
             <checkbox-group v-model="result">
                <template v-for="(item,index) in friendList">
                    <index-anchor :index="index" :key="index" />
                    <div class="friend_list"  
                        v-for="(child,childIndex) in item"
                        :key="index+'-'+childIndex">
                        <checkbox :name="child" checked-color="#2BE0B0">
                            <!-- 联系人头像以后换上 -->
                            <div class="friend_image">
                                <img class="img_tile" 
                                     src="https://i.niupic.com/images/2020/03/19/73n9.png" 
                                     alt="" 
                                     srcset="">
                            </div>
                            <div class="friend_info">
                                <div class="friend_name">{{child.remark || child.name}}</div>
                                <div class="friend_number">{{child.account}}</div>
                            </div>
                        </checkbox>
                    </div>
                </template>
             </checkbox-group>
        </index-bar>
    </popup>
 </div>
</template>
<script>
import { Popup, IndexBar, IndexAnchor } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import dataBase from '@/common/js/dataBase.js'
import dataLetterSort from "@/common/js/letter.js";

export default {
    components:{Popup, IndexBar, IndexAnchor,Checkbox,CheckboxGroup},
    data(){
        return {
            personMenu:false,
            tagList:'',
            // 选择人员结果
            result:[],
            friendList:[

            ]
        }
    },
    created(){
        this.init();
    },
    methods:{
        // 初始化 并且分类数组
        async init(){
            let linkman = await dataBase.readAll(this.$store.state.dataBase,'contactPerson');
            if(JSON.stringify(linkman) !== '[]'){
                this.friendList = dataLetterSort(linkman,"name");
            }else{
                this.friendList=[]
            }
            // console.log(this.friendList)
        },
        // 储存标签分组
        async finish(){
            if(await dataBase.readAll_exist(this.$store.state.dataBase,'tagList','name',this.tagList)){
                return this.$toast('已有此标签')   
            }
            let data = [];
            for (let item of this.result) {
                let saveData = {
                    name: item.name,
                    account: item.account,
                    publicKey: item.publicKey,
                    remark: item.remark,
                }
                data.push(saveData);
            }
            dataBase.add(this.$store.state.dataBase,'tagList',{name:this.tagList,data:data});
            this.$router.go(-1);
        },
        showAddMenu(){
            this.personMenu = true;
        }
    }
}
</script>
<style lang="scss" scoped>
.maxBox{
    font-size: 1.5rem;
    width: 100%;
    height: 100%;
    position: relative;
}

.form{
    padding: 4rem 1.4rem;
    input{
        border: none;
        width: 100%;
        margin:1rem 0 3rem;
        padding: 1rem 0;
        color: black;
    }
}
.bottom_btn{
    position: fixed;
    height: 7.6rem;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1rem 3rem;
}
.popup_style{
    height: 90%;
    overflow-y: auto;
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
.pitch_list{
    div{
        padding: 0.5rem;
        border: 0.1rem solid #ccc;
        color: #ccc;
        display: inline-block;
        border-radius: 5px;
        margin: .8rem .8rem .8rem 0;
    }
}
</style>