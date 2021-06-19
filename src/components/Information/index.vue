<script>
// 簡略的城市地區經緯度.
import CountyTown from "../../data/CountyTown.json";
// 節流函式.
import debounce from "../../assets/script/debounce";
// 保存 DOM, 事件需要計算與設值樣式.
let informationContainer, information, scroll;

// 判斷裝置.
const mobileDevices = [
  "Android",
  "webOS",
  "iPhone",
  "iPad",
  "iPod",
  "BlackBerry",
  "Windows Phone",
];
function isMobileDevice(userAgent) {
  const index = mobileDevices.findIndex((item) => {
    // 若找到字串就返回 true.
    if (userAgent.indexOf(item) !== -1) return true;
  });
  // index === -1 代表沒有找到字串, 是使用電腦打開網頁.
  return index === -1 ? false : true;
}

export default {
  data() {
    return {
      // 表單使用, 當前選擇的城市.
      countyIndex: null,
      // 表單使用, 當前選擇的地區.
      townIndex: null,

      // information-container 區塊是否顯示.
      isActive: false,
      // 判斷當前裝置的類型.
      isMobile: false,
      // 判斷 scroll wheel event 是否執行.
      isScroll: false,
      // scroll 是否顯示.
      isShowScroll: false,

      // window 的寬度.
      windowInnerWidth: 0,
      // information container 的可移動高度.
      informationContainerHeight: 0,
      // information 內容的高度.
      informationHeight: 0,
      // 計算 information 可移動範圍.
      informationRange: 0,
      // 當前 information 的 top 樣式的值.
      informationTop: 0,
      // touchstart 事件的 clientY.
      informationTouchstartY: 0,

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
    scrollMouseDownHandler(event) {
      // 關閉 scroll whell event 事件, 當前是 mobile 裝置.
      if (!this.isScroll && this.isMobile) return false;

      // 當前 top 定位座標.
      this.scrollTop = scroll.offsetTop;
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
      this.setTop();
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
    // 滾輪事件.
    wheelHandler({ deltaY }) {
      // 關閉 scroll whell event 事件, 當前是 mobile 裝置.
      if (!this.isScroll && this.isMobile) return false;

      this.perfect += deltaY > 0 ? 0.2 : -0.2;

      if (this.perfect > 1) this.perfect = 1;
      if (this.perfect < 0) this.perfect = 0;

      this.setTop();
    },
    // mobile 觸控按下事件.
    touchstartHandler(event) {
      // 關閉 scroll whell event 事件, 當前不是 mobile 裝置.
      if (!this.isScroll && !this.isMobile) return false;

      // 當前 information top 定位座標.
      this.informationTop = information.offsetTop;
      // 手機按下的 Y 軸座標.
      this.informationTouchstartY = event.changedTouches[0].clientY;

      window.addEventListener("touchmove", this.touchmoveHandler);
      window.addEventListener("touchend", this.touchendHandler);
    },
    // mobile 觸控移動事件.
    touchmoveHandler(e) {
      // 手指移動的 top 定位.
      let top =
        this.informationTop +
        e.changedTouches[0].clientY -
        this.informationTouchstartY;

      // 限制 top 定位的上下限.
      if (top > 0) top = 0;
      if (top < -this.informationRange) top = -this.informationRange;

      this.perfect = top / this.informationRange;

      this.setTop();
    },
    // mobile 觸控抬起事件.
    touchendHandler() {
      window.removeEventListener("touchmove", this.touchmoveHandler);
      window.removeEventListener("touchend", this.touchendHandler);
    },
    // 判斷是電腦或 mobole 裝置的 event, 設定 information scroll 的 top 樣式.
    setTop() {
      if (this.isMobile) {
        // 當前是 mobile 裝置.
        this.informationRange = Math.abs(this.informationRange);
        this.scrollRange = Math.abs(this.scrollRange) * -1;
      } else {
        // 當前是電腦.
        this.informationRange = Math.abs(this.informationRange) * -1;
        this.scrollRange = Math.abs(this.scrollRange);
      }

      information.style.top = this.informationRange * this.perfect + "px";
      scroll.style.top = this.scrollRange * this.perfect + "px";
    },
    resizeHandler() {
      // 判斷當前裝置類型.
      this.isMobile = isMobileDevice(navigator.userAgent);

      // 獲取螢幕寬度.
      this.windowInnerWidth = window.innerWidth;
      // information container 的高度.
      this.informationContainerHeight = informationContainer.offsetHeight;
      // information 內容的高度.
      this.informationHeight = information.offsetHeight;
      // information 可移動範圍.
      this.informationRange = Math.abs(
        this.informationContainerHeight - this.informationHeight
      ).toFixed(0);

      // scroll 的高度.
      this.scrollHeight = scroll.offsetHeight;
      // scroll 可移動範圍.
      this.scrollRange = (
        this.informationContainerHeight - this.scrollHeight
      ).toFixed(0);

      /**
       * 判斷 information 內容的高度, 是否有超過 information Container 容器的高度,
       * 若超過則需要 scroll 與 wheel 的 event 事件, 並顯示 scroll 的樣式.
       */
      if (this.informationHeight > this.informationContainerHeight) {
        this.isScroll = this.isShowScroll = true;
      } else {
        this.isScroll = this.isShowScroll = false;
      }

      // 當前是 mobile 裝置, 關閉 scroll wheel event, 隱藏 scroll 樣式.
      if (this.isMobile) this.isShowScroll = false;

      // 調整 information scroll 的高度.
      this.perfect = 0;
      this.setTop();

      // 刪除事件.
      window.removeEventListener(
        "mousemove",
        this.scrollWindowMouseMoveHandler
      );
      window.removeEventListener("mouseup", this.scrollWindowMouseUpHandler);
      window.removeEventListener("touchmove", this.touchmoveHandler);
      window.removeEventListener("touchend", this.touchendHandler);
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
    // 保存 dom, 事件計算時會用到.
    informationContainer = this.$el;
    information = this.$el.querySelector(".information");
    scroll = this.$el.querySelector(".scroll");

    window.addEventListener(
      "resize",
      debounce(this.resizeHandler, {
        // resize 1 秒後執行函式.
        wait: 1000,
      })
    );
    this.resizeHandler();

    // 阻止 mobile 下拉重新整理.
    document.body.addEventListener(
      "touchmove",
      function(e) {
        // 阻止默認事件函式.
        e.preventDefault();
      },
      // 待補充.
      { passive: false }
    );
  },
};
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
