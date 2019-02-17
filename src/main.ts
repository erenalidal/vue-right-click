import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

// @ts-ignore
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside)

new Vue({
  render: (h) => h(App),
}).$mount('#app');
