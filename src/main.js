import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import lc from "./assets/js/leancloud";

import "element-plus/es/components/message/style/css";
import "element-plus/es/components/notification/style/css";
import "@/assets/css/base.css";

lc.init();

const app = createApp(App);

app.use(router);

app.mount("#app");
