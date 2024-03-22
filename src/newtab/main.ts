import { createApp } from 'vue'

import App from './App.vue'
// import App from './AppClean.vue'
import { setupApp } from '~/logic/commonSetup'
import '~/styles'

const app = createApp(App)
setupApp(app)
app.mount('#app')
