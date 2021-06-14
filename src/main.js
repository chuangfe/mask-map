import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.directive("set-top", {
  // 生命週期, 指令的值更新時執行, 指令會傳進來 perfect informationContainerHeight.
  // perfect 代表你的 top 該設定的百分比.
  // informationContainerHeight 為了螢幕 resize 時要觸發指令, 而增加的值.
  update(el, binding) {
    const informationContainerHeight = binding.value.informationContainerHeight;
    const targetHeight = el.offsetHeight;
    const Range = Math.abs(informationContainerHeight - targetHeight);
    const top = Range * binding.value.perfect;

    el.style.top = top + "px";
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
