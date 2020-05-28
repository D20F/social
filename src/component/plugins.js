import Vue from 'vue'
import pursecard from './pursecard'
import version from './version'
import sendAnimation from './sendAnimation'
import password from './password'
import topbar from './topbar'


function plugins(Vue) {
  Vue.component("pursecard", pursecard);
  Vue.component("version", version);
  Vue.component("sendAnimation", sendAnimation);
  Vue.component("password", password);
  Vue.component("topbar", topbar);

}

export default plugins;