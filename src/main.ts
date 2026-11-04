import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@fontsource/nunito";
import "@fontsource/noto-sans-sc";
import "virtual:uno.css";
import "./main.css";

createApp(App).use(createPinia()).use(router).mount("#app");
