import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.directive("set-top", {
  /**
   * 讓 el 根據 binding 調整 style stop 的值.
   * @param {DOM} el 綁訂指令的 el 物件.
   * @param {Object} binding
   * binding.perfect 你需要調整 style stop 的比例.
   * binding.informationContainerHeight 你父元素的高度, 用來配合 resize 事件.
   *
   * 當 binding.perfect 改變時, 代表正在執行 scroll wheel 事件.
   * 當 binding.informationContainerHeight 改變時, 代表正在執行 resize 事件.
   */
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
