import { createApp } from 'vue'

//CSS
import './main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import './assets/style.css'

import App from './App.vue'
import router from './router.js'
import store from './store/index.js'

createApp(App).use(router).use(store).mount('#app')
