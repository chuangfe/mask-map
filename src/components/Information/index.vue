<script>
// 簡略的城市地區經緯度.
import CountyTown from "../../data/CountyTown.json";
// 節流函式.
import debounce from "../../assets/script/debounce";

export default {
  data() {
    return {
      isActive: false,
      countyIndex: null,
      townIndex: null,

      // information container 的可高度.
      informationContainerHeight: 0,
      // information 內容的高度.
      informationHeight: 0,
      // 計算 information 可移動範圍.
      informationRange: 0,

      // scroll 的高度.
      scrollHeight: 0,
      // 計算 scroll 可移動範圍.
      scrollRange: 0,
      // 紀錄當前 scroll top 樣式的值.
      scrollTop: 0,
      // 紀錄 scroll mousedown event y 的值.
      scrollMouseDownY: 0,

      // 設置 style top 樣式的百分比, 配合自訂指令使用.
      perfect: 0,
      // 判斷是否需要 scroll 的功能, 影響 scroll .active, scroll event 的執行.
      onOff: true,
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
      // scroll 功能開啟關閉判斷.
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
      // 阻擋 mousemove 在 chreme 的 bug.
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
      // scroll 功能開啟關閉判斷.
      if (!this.onOff) return false;

      this.perfect += deltaY > 0 ? 0.2 : -0.2;

      if (this.perfect > 1) this.perfect = 1;
      if (this.perfect < 0) this.perfect = 0;
    },
    resizeHandler() {
      // information container.
      let el = this.$el;

      // information container 的高度.
      this.informationContainerHeight = el.offsetHeight;
      // information 內容的高度.
      this.informationHeight = el.querySelector(".information").offsetHeight;
      // information 可移動範圍.
      this.informationRange = Math.abs(
        this.informationContainerHeight - this.informationHeight
      ).toFixed(0);

      // scroll 的高度.
      this.scrollHeight = el.querySelector(".scroll-container").offsetHeight;
      // scroll 可移動範圍.
      this.scrollRange = (
        this.informationContainerHeight - this.scrollHeight
      ).toFixed(0);

      // 判斷是否需要拖拽.
      if (this.informationHeight > this.informationContainerHeight) {
        this.onOff = true;
      } else {
        this.onOff = false;
        this.informationRange = 0;
        this.scrollRange = 0;
        this.perfect = 0;
      }
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
    window.addEventListener(
      "resize",
      debounce(this.resizeHandler, {
        // resize 1 秒後執行函式.
        wait: 1000,
      })
    );
    this.resizeHandler();
  },
};
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
