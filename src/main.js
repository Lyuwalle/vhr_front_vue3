import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import Message from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(Message);

/*路由导航守卫*/
/*https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html*/

router.beforeEach((to, from, next) => {
  /*页面是login，直接next，去其他页面，initMenu再next（）*/
  if (to.path == '/') {
    next();
  } else {
    /*已经登录*/
    if (window.sessionStorage.getItem("user")) {
      initMenu(router, store);
      next();
    } else {
      /*没有登录直接登录*/
      /*next('/');*/
      /*登录之后跳转到之前输入的url*//*还要修改login.vue里面登录成功之后的页面*/
      next('/?redirect='+to.path);
    }

  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
