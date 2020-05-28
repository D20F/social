<template>
  <div class="maxBox">
  <!-- 顶部信息 -->
    <topbar title ='标签' mode = '4' ></topbar>
  <!-- 标签列表 -->
    <div class="tab_box" v-if="tabList.length > 0">
        <cell v-for="(item,index) in tabList" 
          :key="index" 
          :label="item.person"
          @click="jumpRouter('TagSet',item)"
          >
          <template #title>
            <span class="custom-title">
              {{item.name}} 
              [ {{item.data.length}} ]
            </span>
          </template>
          <template #icon>
              <img class="tab_icon_style" 
                   src="@/assets/images/icon_tab2.png" 
                   alt="">
          </template>
        </cell>
    </div>
    <div class="blank_box" v-else>
      <p>暂无标签</p>
      <p>快来添加新的标签</p>
    </div>
    <div class="bottom_btn">
        <van-button type="primary" 
                        @click="toAdd"
                        block>
            添加标签
        </van-button>
    </div>
  </div>
</template>
<script>
import { Cell } from 'vant';
import dataBase from '@/common/js/dataBase.js'
export default {
    components:{Cell},
    data(){
        return{
            tabList:[
                
            ]
        }
    },
    created(){
      this.init();
    },
    methods:{
        jumpRouter(name,data){
            this.$router.push({ name: name, query: { data: data }})
        },
        toAdd(){
            this.$router.push({path:"/tagAdd"})
        },
        async init(){
          this.tabList = await dataBase.readAll(this.$store.state.dataBase,'tagList');
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
.tab_box{
    padding: 1.2rem;
}
.custom-title{
    font-size: 1.5rem;
}
.tab_icon_style{
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;
}
.bottom_btn{
    position: fixed;
    height: 7.6rem;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1rem 3rem;
}
.blank_box{
  p{
    text-align: center;
    color: RGB(39, 224, 173);
  }
}
</style>