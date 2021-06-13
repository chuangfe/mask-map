<script>
// 簡略的城市地區經緯度.
import CountyTown from "../../data/CountyTown.json";

export default {
  data() {
    return {
      isActive: false,
      countyIndex: null,
      townIndex: null,
      // 計算可移動範圍.
      windowInnerHeight: 0,
      scrollHeight: 0,
      scrollRange: 0,
      // 紀錄當前 scroll top 樣式的值.
      scrollTop: 0,
      // 紀錄 scroll mousedown event y 的值.
      scrollMouseDownY: 0,
      // 設置 style top 樣式的百分比, 配合自訂指令使用.
      perfect: 0,
      // 是否需要拖拽, 要獲取高度去判斷.
      onOff: false,
    };
  },
  computed: {
    countys() {
      return CountyTown;
    },
    towns() {
      // 如果沒選擇城市, 地區就不顯示.
      return this.countyIndex === null
        ? []
        : CountyTown[this.countyIndex].towns;
    },
  },
  methods: {
    isActiveHandler() {
      this.isActive = !this.isActive;
    },
    scrollMouseDownHandler(el, event) {
      // 拖拽判斷.
      if (!this.onOff) return false;

      // 禁止選取文字.
      el.style.userSelect = "none";

      // 真是悲慘的事件 el 獲取方式.
      const scrollContainer = el.querySelector(".scroll-container");
      // 當前 top 定位座標.
      this.scrollTop = scrollContainer.offsetTop;
      // 滑鼠按下的 Y 軸座標.
      this.scrollMouseDownY = event.clientY;

      window.addEventListener("mousemove", this.scrollWindowMouseMoveHandler);
      window.addEventListener("mouseup", this.scrollWindowMouseUpHandler);
    },
    scrollWindowMouseMoveHandler({ clientY }) {
      // 組檔 mousemove 在 chreme 的 bug.
      if (clientY === this.scrollMouseDownY) return false;

      // 捲軸移動的 top 定位.
      let top = this.scrollTop + clientY - this.scrollMouseDownY;
      // 限制 top 定位的上下限.
      if (top < 0) top = 0;
      if (top > this.scrollRange) top = this.scrollRange;

      this.perfect = top / this.scrollRange;
    },
    scrollWindowMouseUpHandler() {
      window.removeEventListener(
        "mousemove",
        this.scrollWindowMouseMoveHandler
      );
      window.removeEventListener("mouseup", this.scrollWindowMouseUpHandler);

      // 允許選取文字.
      this.$el.style.userSelect = "text";
    },
    wheelHandler({ deltaY }) {
      // 拖拽判斷.
      if (!this.onOff) return false;

      this.perfect += deltaY > 0 ? 0.2 : -0.2;

      if (this.perfect > 1) this.perfect = 1;
      if (this.perfect < 0) this.perfect = 0;
    },
    // 判斷是否需要拖拽.
    toggleDrag() {
      const windowInnerHeight = window.innerHeight;
      const informationContainerHeight = this.$el.querySelector(
        ".information-container"
      ).offsetHeight;

      if (informationContainerHeight > windowInnerHeight) {
        this.onOff = true;
      } else {
        this.onOff = false;
        this.perfect = 0;
      }
    },
    windowResizeHandler() {
      // 螢幕可視區高度, 會給自訂指令去觸發樣式調整.
      this.windowInnerHeight = window.innerHeight;
      // 需要判斷捲軸拖拽事件的範圍, 捲軸高度 0.8 是樣式設置的.
      this.scrollHeight = (window.innerHeight * 0.8).toFixed(0);
      // 捲軸可移動範圍.
      this.scrollRange = (this.windowInnerHeight - this.scrollHeight).toFixed(
        0
      );

      // 判斷是否需要拖拽.
      this.toggleDrag();
    },
  },
  watch: {
    countyIndex() {
      // 每次選擇都清空 townIndex 的值.
      this.townIndex = null;
      // 避免後續出錯.
      if (this.countyIndex === null) return false;

      this.$emit("setCenter", {
        center: this.countys[this.countyIndex].center,
        zoom: 13,
      });
    },
    townIndex() {
      if (this.townIndex === null) return false;

      this.$emit("setCenter", {
        center: this.towns[this.townIndex].center,
        zoom: 15,
      });
    },
  },
  mounted() {
    window.addEventListener("resize", this.windowResizeHandler);
    this.windowResizeHandler();
  },
};
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
