import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from "vant";
import { Toast } from "vant";
import "./assets/css/reset.css";
import "vant/lib/index.css";
import dayjs from "dayjs";
import utils from "./utils";
import VueCookies from "vue-cookies";
import VueI18n from "vue-i18n";
import MetaIdJs from "metaidjs";
import fastclick from "fastclick";
fastclick.attach(document.body);
fastclick.prototype.foucs = function () {
  let length;
  let deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
  let deviceIsIOS =
    /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;
  //兼容处理:在iOS7中，有一些元素（如date、datetime、month等）在setSelectionRange会出现TypeError
  //这是因为这些元素并没有selectionStart和selectionEnd的整型数字属性，所以一旦引用就会报错，因此排除这些属性才使用setSelectionRange方法
  if (
    deviceIsIOS &&
    targetElement.setSelectionRange &&
    targetElement.type.indexOf("date") !== 0 &&
    targetElement.type !== "time" &&
    targetElement.type !== "month" &&
    targetElement.type !== "email"
  ) {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length); //修复bug ios 11.3不弹出键盘，这里加上聚焦代码，让其强制聚焦弹出键盘
    targetElement.focus();
  } else {
    targetElement.focus();
  }
};
Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(VueCookies);
Vue.use(Vant);
Vue.use(Toast);
Vue.use(VueI18n);
Vue.prototype.$metaidjs = MetaIdJs;
Vue.prototype.$cookie = VueCookies;
Vue.prototype.$utils = utils;
Vue.prototype.$dayjs = dayjs;
let timeout;
Vue.prototype.debounce = (func, wait, immediate) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  if (immediate) {
    let callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow) func();
  } else {
    timeout = setTimeout(() => {
      func();
    }, wait);
  }
};
Vue.prototype.gotoUrl = function (name, params) {
  const that = this;

  that.$router
    .push({
      name: name,
      params: {
        ...params,
      },
    })
    .catch((err) => {
     
    });
};
const i18n = new VueI18n({
  locale: "zh", // 定义默认语言为中文
  messages: {
    zh: require("./assets/lang/zh.json"),
    en: require("./assets/lang/en.json"),
  },
});
new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");
