<template>
    <div class="maxBox" >
        <topbar title ='设置备注和标签' mode = '2' @parent_finish = 'finish' ></topbar>
        <div class="remark">
            <p>设置备注</p>
            <input type="text" v-model="remarkMsg" placeholder="请设置备注">
        </div>
        <div class="tagbox">
            <p class="tagp">设置标签</p>
            <div :class="{tagoff:!item.state,tagon:item.state}" v-for="(item, index) in tagList" :key='index' @click="select(item)">
                <p>{{item.name}}</p>
            </div>
        </div>
    </div>
</template>
<script>

import dataBase from '@/common/js/dataBase.js'
import commonTool from '@/common/js/commonTool.js'

export default {
    data(){
        return {
           remarkMsg:'',
           tagList:[],
           backMode:{},
        }
    },
    created(){
      this.init();
    },
    methods:{
        // 
        async init(){
            // 备注
            let person = await dataBase.get_index(this.$store.state.dataBase,'contactPerson','name',this.$route.query.data.name);
            if(JSON.stringify(person.remark) !== '[]'){
                this.remarkMsg = person.remark;
            }
            // 标签
            let data = await dataBase.readAll(this.$store.state.dataBase,'tagList');
            if(JSON.stringify(data) !== '[]'){
                for (let i of data) {
                    // 根据标签成员，赋予选中状态
                    if(commonTool.search(i.data,'name', this.$route.query.data.name)){
                        this.tagList.push({name:i.name,state:true});
                    }else{
                        this.tagList.push({name:i.name,state:false});
                    }
                }   
            }else{
                this.tagList= []
            }
        },
        select(data){
            data.state = !data.state;
        },
        async finish(){
            // 联系人表更新备注
            await dataBase.replace(this.$store.state.dataBase,'contactPerson','name',this.$route.query.data.name,['remark'],[this.remarkMsg]);
            // 聊天缓存表更新备注
            let state = await dataBase.get_index(this.$store.state.dataBase,'chatCurrent','name',this.$route.query.data.name);
            if(state !== undefined){
                await dataBase.replace(this.$store.state.dataBase,'chatCurrent','name',this.$route.query.data.name,['remark'],[this.remarkMsg]);
            }
            // 更新标签
            for (let i of this.tagList) {
                //此标签选中状态
                if(i.state){
                    let tag = await dataBase.get_index(this.$store.state.dataBase,'tagList','name',i.name);
                    // 此标签没有此用户，加入此用户
                    if(! commonTool.search(tag.data,'name', this.$route.query.data.name)){
                        tag.data.push(this.$route.query.data)
                        dataBase.update(this.$store.state.dataBase,'tagList',tag);
                    }
                }else{
                //标签未被选中
                    let tag = await dataBase.get_index(this.$store.state.dataBase,'tagList','name',i.name);
                    let data = [];
                    // 此标签有此用户,给此用户取消此标签
                    if(commonTool.search(tag.data,'name', this.$route.query.data.name)){
                        for (let item of tag.data) {
                            if(!(item.name == this.$route.query.data.name)){
                               data.push(item)
                            }
                        }
                        tag.data = data;
                        dataBase.update(this.$store.state.dataBase,'tagList',tag);
                    }
                }
            }   
            this.backMode = this.$route.query.data;
            this.backMode.remark = this.remarkMsg;
            this.$router.push({name:'LinkmanInfo',query:this.backMode})
        },
    },
   
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
.remark{
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
.tagbox{
    width: 90%;
    margin: 0 auto;
    div{
        display: inline-block;
        padding: 1rem 3rem;
        margin:0 1rem 1rem 0;
        border-radius: 2rem;
    }
}
.tagp{
    margin-bottom: 2rem;
}
.tagoff{
    border: 1px solid RGB(192,192,192);
    color: RGB(192,192,192);
    p{
        
    }
}
.tagon{
    background: RGB(233, 252, 247);
    color: RGB(39, 224, 173);
    p{
    
    }
}

</style>