<template>

    <div class="MaxBox">
        <div class="routerBox">
            <router-view />
        </div>
        <tabbar active-color="#27E0B1"
                inactive-color="#ccc" 
                v-model="active" 
                @change="changeTabbar"
                :class="{hid:tabstate}">
            <tabbar-item>
                <template #icon="props">
                    <img class="menu_icon" :src="props.active ? iconList.home.active : iconList.home.inactive"/>
                </template>
                聊天
            </tabbar-item>
            <tabbar-item icon="friends">
                <template #icon="props">
                    <img class="menu_icon" :src="props.active ? iconList.linkman.active : iconList.linkman.inactive"/>
                </template>
                联系人
            </tabbar-item>
            <tabbar-item icon="map-marked">
                <template #icon="props">
                    <img class="menu_icon" :src="props.active ? iconList.discover.active : iconList.discover.inactive"/>
                </template>
                发现
            </tabbar-item>
            <tabbar-item icon="card">
                <template #icon="props">
                    <img class="menu_icon" :src="props.active ? iconList.wallet.active : iconList.wallet.inactive"/>
                </template>
                钱包
            </tabbar-item>
            <tabbar-item icon="manager">
                <template #icon="props">
                    <img class="menu_icon" :src="props.active ? iconList.my.active : iconList.my.inactive"/>
                </template>
                我的
            </tabbar-item>
        </tabbar>
    </div>
</template>
<script>
import { Tabbar, TabbarItem } from 'vant';
import { pog } from '@/servers/blockChain';
export default {
    components:{Tabbar,TabbarItem},
    data(){
        return {
            active:0,
            iconList:{
                home: {
                    active: require('../assets/images/home_a.png'),
                    inactive: require('../assets/images/home.png')
                },
                linkman:{
                    active: require('../assets/images/linkman_a.png'),
                    inactive: require('../assets/images/linkman.png')
                },
                discover:{
                    active: require('../assets/images/discover_a.png'),
                    inactive: require('../assets/images/discover.png')
                },
                wallet:{
                    active: require('../assets/images/wallet_a.png'),
                    inactive: require('../assets/images/wallet.png')
                },
                my:{
                    active: require('../assets/images/my_a.png'),
                    inactive: require('../assets/images/my.png')
                },
            }
        }
    },
    methods:{
        init(){
            let routerName = this.$router.history.current.path;
            switch(routerName){
                case "/home":this.active = 0;break
                case "/linkman":this.active = 1;break
                case "/discover":this.active = 2;break
                case "/wallet":this.active = 3;break
                case "/my":this.active = 4;break
            }
        },
        changeTabbar(e){
            switch(e){
                case 0:this.$router.push({path:"/home"});break
                case 1:this.$router.push({path:"/linkman"});break
                case 2:this.$router.push({path:"/discover"});break
                case 3:this.$router.push({path:"/wallet"});break
                case 4:this.$router.push({path:"/my"});break
            }
        }
    },
    created(){
        this.init();
        
       
    },
    computed:{
        tabstate() {
            let data = ['Home','Linkman','Discover','Wallet','My'];
            return (data.indexOf(this.$store.state.beRouter) !== -1)?false:true;
        }
    }
}
</script>
<style scoped>
.hid{
    display:none;
}
.menu_icon{
    width: 2rem;
    height: 2rem;
}
.routerBox{
    width:100%;
    height:100%;
    overflow-y: hidden;
}
</style>