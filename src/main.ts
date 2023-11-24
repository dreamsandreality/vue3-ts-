import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/base.css'
import router from './router'
import ElementPlus from 'element-plus';
import { ElMessage,ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import api from './api/index';
import plugins from '../src/plugins/index'
import { createPinia } from 'pinia'
const pinia = createPinia()
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.config.globalProperties._message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.config.globalProperties.$http = api

app.use(router).use(ElementPlus).use(pinia).use(plugins).mount('#app')
