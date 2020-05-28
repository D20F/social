import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/rem.js"
import storage from "./common/js/storage.js"
import { Button, Icon, Dialog, Switch, Toast, DropdownMenu, DropdownItem, Loading } from 'vant';
import plugin from './servers/blockChain/plugin'

import component_plugins from './component/plugins'

Vue.use(component_plugins);
Vue.use(plugin);

Vue.use(Button);
Vue.use(Icon);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Loading);

Vue.prototype.$storage = storage;
Vue.config.productionTip = false;

function runInBrowser() {
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}

function runInCordova() {
  // document.addEventListener("backbutton", OnBackKeyDown, false)
  document.addEventListener('deviceready', OnDeviceready, false);
  function OnDeviceready() {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
    
    // 启动后台模式
    cordova.plugins.backgroundMode.enable();
    // cordova.plugins.backgroundMode.setDefaults({ silent: true });
    cordova.plugins.backgroundMode.overrideBackButton();

    //初始化极光
    window.JPush.init();
    
    // 接收到推送消息回调
    window.plugins.jPushPlugin.receiveNotificationInAndroidCallback = function (data) {
      try {
        console.log(
          "JPushPlugin:receiveNotificationInAndroidCallback:",
          data
        );
      } catch (exception) {
        console.log("JPushPlugin:pushCallback ", exception);
      }
    };
    //点击通知栏的回调，在这里编写特定逻辑
    window.plugins.jPushPlugin.openNotificationInAndroidCallback = function (data) {
      try {
        //  location.href = 'index.html';           
        console.log(data);
      } catch (error) { }
    };
  }
}

if (process.env.NODE_ENV === 'development') {
  runInBrowser();
  Vue.config.devtools = true;
} else {
  runInCordova();
  Vue.config.devtools = false;
}
