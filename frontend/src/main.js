import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueRouter from 'vue-router'

import Login from './components/Login'
import Home from './components/Home'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Login},
    { path: '/home', component: Home},
  ]
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
