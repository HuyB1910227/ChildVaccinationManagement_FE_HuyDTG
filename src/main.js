import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import router from "./router";

import BaseBlock from "@/components/BaseBlock.vue";
import BaseBackground from "@/components/BaseBackground.vue";
import BasePageHeading from "@/components/BasePageHeading.vue";

import clickRipple from "@/directives/clickRipple";

import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

const app = createApp(App);

app.component("BaseBlock", BaseBlock);
app.component("BaseBackground", BaseBackground);
app.component("BasePageHeading", BasePageHeading);

app.directive("click-ripple", clickRipple);
app.use(createPinia());
app.use(router);
app.mount("#app");
