import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

/**
 * 加密过程一
 * @param {string}  beRouter                当前路由
 * @param {object}  currentWallet           当前钱包信息
 * @param {object}  wallets                 所有钱包信息
 * @param {boolean} login_animate           登录动画显示
 * @param {boolean} pursecard_animate       遮罩动画显示
 * @param {number}  update_status           决定页面是否更新数据
 * @param {string}  version                 当前版本号
 * @param {object}  dataBase                数据库对象
 * @param {object}  contactPerson           联系人      --暂不启用   
 * @param {object}  chatRecord              聊天记录       --暂不启用
 * @param {object}  regID                   极光注册ID
 * @param {object}  showUpdateDialog        更新弹窗显示  
 * @param {object}  pass                    稍后更新判断
**/
export default new Vuex.Store({
  state: {
    beRouter : '',   
    currentWallet:{},
    wallets:{
      Eth:[],
      Eos:[],
      Pog:[],
    },
    login_animate:false,
    pursecard_animate:false,
    update_status:false,
    version:'',
    dataBase:{},
    // contactPerson:{},
    // chatRecord:{},
    regID:"",
    showUpdateDialog: false,
    pass: false
  },
  mutations: {
    beRouterFun (state, data) { 
      state.beRouter = data;
    },
    currentWalletFun (state, data) { 
      state.currentWallet = data;
    },
    walletsFun (state, data) { 
      state.wallets = data;
    },
    login_animateFun (state, data) { 
      state.login_animate = data;
    },
    pursecard_animateFun (state, data) { 
      state.pursecard_animate = data;
    },
    versionFun (state, data) { 
      state.version = data;
    },
    update_statusFun (state, data) { 
      state.update_status = data;
    },
    dataBaseFun (state, data) { 
      state.dataBase = data;
    },
    // contactPersonFun (state, data) { 
    //   state.contactPerson = data;
    // },
    // chatRecordFun (state, data) { 
    //   state.chatRecord = data;
    // },
    setRegID (state, data) { 
      state.regID = data;
    },
    setUpdateDialog (state, data) { 
      state.showUpdateDialog = data;
    },
    setUpdatePass (state, data) { 
      state.pass = data;
    }
  },
  actions: {
    
  },
  modules: {

  }
})
