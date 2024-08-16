import { createApp } from "vue";
import App from "./App.vue";

import router from "./router.js";
import pina from "./plugins/pinia.js";
import vuetify from "./plugins/vuetify.js";

createApp(App).use(pina).use(vuetify).use(router).mount("#app");
