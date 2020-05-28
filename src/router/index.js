import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
import { format } from 'date-fns'


Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    component:() => import(/* webpackChunkName: "menu" */ "../views/Menu.vue"),
    explain:"底部菜单",
    children:[
      {
        path: '/home',
        name: 'Home',
        explain:"首页",
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
      },
      {
        path: "/linkman",
        name:"Linkman",
        explain:"联系人",
        component: () => import(/* webpackChunkName: "linkman" */ "../views/Linkman/Linkman.vue")
      },
      {
        path: "/discover",
        name:"Discover",
        explain:"发现",
        component: () => import(/* webpackChunkName: "discover" */ "../views/Discover.vue")
      },
      {
        path: "/wallet",
        name:"Wallet",
        explain:"钱包",
        component: () => import(/* webpackChunkName: "wallet" */ "../views/Wallet.vue"),
      },
      {
        path: "/my",
        name:"My",
        explain:"我的",
        component: () => import(/* webpackChunkName: "my" */ "../views/My.vue")
      },
      {
        path: '/LogIn',
        name: 'logIn',
        explain:"登录界面",
        component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/logIn.vue')
      },
    ]
  },
  //资产类别
  {
    path: '/Assets',
    name: 'assets',
    explain:"资产详情",
    component: () => import(/* webpackChunkName: "home" */ '../views/Wallets/assets.vue')
  },
  {
    path: '/Transfer',
    name: 'transfer',
    explain:"资产详情",
    component: () => import(/* webpackChunkName: "home" */ '../views/Wallets/transfer.vue')
  },
  {
    path: '/Collection',
    name: 'collection',
    explain:"收款",
    component: () => import(/* webpackChunkName: "home" */ '../views/Wallets/collection.vue')
  },
  {
    path: '/Scanit',
    name: 'scanit',
    explain:"扫一扫",
    component: () => import(/* webpackChunkName: "home" */ '../views/Wallets/scanit.vue')
  },
  {
    path: '/AddPogCurrency',
    name: 'addPogCurrency',
    explain:"pog添加token",
    component: () => import(/* webpackChunkName: "home" */ '../views/Wallets/addPogCurrency.vue')
  },
  {
    path: '/AddEthCurrency',
    name: 'addEthCurrency',
    explain:"eth添加token",
    component: () => import(/* webpackChunkName: "home" */ '../views/Wallets/addEthCurrency.vue')
  },
  //创建导入钱包
  {
    path: '/Create',
    name: 'create',
    explain:"创建界面",
    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/create.vue')
  },
  {
    path: '/ImportWalletEth',
    name: 'importWalletEth',
    explain:"导入钱包ETH",
    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/importWalletEth.vue')
  },
  {
    path: '/ImportWalletEos',
    name: 'importWalletEos',
    explain:"导入钱包Eos",
    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/importWalletEos.vue')
  },
  {
    path: '/ImportWalletPog',
    name: 'importWalletPog',
    explain:"导入钱包Pog",
    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/importWalletPog.vue')
  },
  {
    path: '/CreateWalletEth',
    name: 'createWalletEth',
    explain:"创建钱包ETH",

    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/createWalletEth.vue')
  },
  {
    path: '/CreateWalletEos',
    name: 'createWalletEos',
    explain:"创建钱包Eos",
    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/createWalletEos.vue')
  },
  {
    path: '/CreateWalletPog',
    name: 'createWalletPog',
    explain:"创建钱包Pog",
    component: () => import(/* webpackChunkName: "home" */ '../views/SignIn/createWalletPog.vue')
  },
  // 聊天相关
  {
    path:"/linkmanNew",
    name:"LinkmanNew",
    explain:"新联系人",
    component:() => import(/* webpackChunkName: "linkmanNew" */ "../views/Linkman/Add/LinkmanNew.vue")
  },
  {
    path:"/linkmanNewInfo",
    name:"LinkmanNewInfo",
    explain:"新联系人信息",
    component:() => import(/* webpackChunkName: "linkmanNewInfo" */"../views/Linkman/Add/LinkmanNewInfo.vue")
  },
 
  {
    path:"/linkmanInfo",
    name:"LinkmanInfo",
    explain:"联系人信息",
    component:() => import(/* webpackChunkName: "linkmanInfo" */ "../views/Linkman/Add/LinkmanInfo.vue")
  },
  {
    path:"/linkmanAdd",
    name:"LinkmanAdd",
    explain:"新增联系人",
    component:() => import(/* webpackChunkName: "linkmanAdd" */ "../views/Linkman/Add/LinkmanAdd.vue")
  },
  {
    path:"/linkmanAddInfo",
    name:"LinkmanAddInfo",
    explain:"新增联系人详情",
    component:() => import(/* webpackChunkName: "linkmanAddInfo" */ "../views/Linkman/Add/LinkmanAddInfo.vue")
  },
  {
    path:"/addVerify",
    name:"AddVerify",
    explain:"新增联系人验证",
    component:() => import(/* webpackChunkName: "addVerify" */ "../views/Linkman/Add/AddVerify.vue")
  },
  {
    path:"/addSuccess",
    name:"AddSuccess",
    explain:"添加联系人成功",
    component:() => import(/* webpackChunkName: "addSuccess" */ "../views/Linkman/Add/AddSuccess.vue") 
  },
  {
    path:"/chat",
    name:"Chat",
    explain:"聊天",
    component:() => import(/* webpackChunkName: "chat" */ "../views/Chat/Chat.vue")
  },
  {
    path:"/chatConfig",
    name:"ChatConfig",
    explain:"聊天设置",
    component:() => import(/* webpackChunkName: "chatConfig" */ "../views/Chat/ChatConfig.vue")
  },
  {
    path:"/chatRecord",
    name:"ChatRecord",
    explain:"聊天记录",
    component:() => import(/* webpackChunkName: "ChatRecord" */ "../views/Chat/ChatRecord.vue")
  },
  {
    path:"/topUp",
    name:"TopUp",
    explain:"充值",
    component:() => import(/* webpackChunkName: "topUp" */ "../views/TopUp/TopUp.vue")
  },
  {
    path:"/tagCenter",
    name:"TagCenter",
    explain:"标签",
    component:() => import(/* webpackChunkName: "tab" */ "../views/Linkman/Tag/TagCenter.vue")
  },
  {
    path:"/tagAdd",
    name:"TagAdd",
    explain:"新增标签",
    component:() => import(/* webpackChunkName: "tabAdd" */ "../views/Linkman/Tag/TagAdd.vue")
  },
  {
    path:"/tagSet",
    name:"TagSet",
    explain:"设置标签",
    component:() => import(/* webpackChunkName: "tabAdd" */ "../views/Linkman/Tag/TagSet.vue")
  },
  {
    path:"/remarkSet",
    name:"RemarkSet",
    explain:"设置备注",
    component:() => import(/* webpackChunkName: "tabAdd" */ "../views/Linkman/Tag/RemarkSet.vue")
  },
  {
    path:"/topUpSuccess",
    name:"TopUpSuccess",
    explain:"充值成功",
    component:() => import(/* webpackChunkName: "topUpSuccess" */ "../views/TopUp/TopUpSuccess.vue")
  },
  {
    path:"/topUpLog",
    name:"TopUpLog",
    explain:"充值日志",
    component:() => import(/* webpackChunkName: "topUpLog" */ "../views/TopUp/TopUpLog.vue")
  },
  //我的界面
  {
    path:"/setting",
    name:"Setting",
    explain:"系统设置",
    component:() => import(/* webpackChunkName: "Setting" */ "../views/My/setting.vue")
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: __dirname,
  routes
})

router.beforeEach((to, from, next) => {
  // console.log('to',to);
  // console.log('from',from);
  // console.log(store.state.beRouter);
  if(to.name == 'Wallet' && from.name == 'logIn'){
    store.commit('beRouterFun', from.name)
    next(false)
  }else{
    store.commit('beRouterFun', to.name)
    next();
  }

})

export default router
