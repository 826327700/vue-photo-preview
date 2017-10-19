import Vue from 'vue'
import App from './App.vue'

import Preview from './lib/index'

var opts={
	mainClass : 'pswp--minimal--dark',
	barsSize : {
		top: 0,
		bottom: 0
	},
	captionEl : false,
	fullscreenEl : false,
	shareEl : false,
	bgOpacity : 0.85,
	tapToClose : true,
	tapToToggleControls : false,
}
Vue.use(Preview,opts)

new Vue({
  el: '#app',
  render: h => h(App)
})
