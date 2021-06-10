<template>
  <div id="app">
    <div id="map"></div>
    <div class="control-container">
      <button
        class="control"
        :class="{ active: !isAdult }"
        @click="isAdultHandler"
        title="切換 成人 / 兒童 口罩"
      >
        <span class="fas fa-child"></span>
      </button>
      <button class="control" title="地圖放大" @click="setZoom()">
        <span class="fas fa-plus"></span>
      </button>
      <button class="control" title="地圖縮小" @click="setZoom(-1)">
        <span class="fas fa-minus"></span>
      </button>
    </div>
  </div>
</template>

<script>
// 引入靜態資料.
import MaskMapData from "./data/MaskMapData.json";
// 地圖的方法集合
import MapHandler from "./components/MapComponent/MapHandler";

export default {
  name: "App",
  data() {
    return {
      // 預設台北市為定位點.
      position: [25.03746, 121.564558],
      // 縮放程度 8, 數字越大, 越放大地圖.
      zoom: 8,
      // 預設 marker 顯示成人口罩的 icon 圖標.
      isAdult: true,
    };
  },
  computed: {
    // computed 似乎只是用好看的.
    MaskMapData() {
      return MaskMapData.features;
    },
  },
  methods: {
    // 切換顯示成人口罩 or 兒童口罩的 marker icon 圖標.
    isAdultHandler() {
      this.isAdult = !this.isAdult;
      MapHandler.setMarkersIcon(this.isAdult);
    },
    // 地圖縮放大小的控制.
    setZoom(calc) {
      // 先讀取地圖的縮放倍率, 再根據按鈕計算 zoom 的值.
      this.zoom = MapHandler.getZoom() + calc;
      // 限制地圖的縮放倍率.
      this.zoom = this.zoom > 18 ? 18 : this.zoom < 3 ? 3 : this.zoom;
      // 調整地圖倍率.
      MapHandler.setZoom(this.zoom);
    },
    // 根據 id 找到對應的藥局資料, 並將地圖跳轉到該藥局.
    setCenter() {
      // 這裡的 id 應該來自網址的 hash 值.
      const id = location.hash ? location.hash.slice(1) : undefined;

      // location.hash 不是數字, 或是不存在就停止函式.
      if (isNaN(id)) return false;

      // 藥局 id 長度好像固定是 10 位數.
      if (id.length !== 10) {
        location.hash = "";
        return false;
      }

      // Array.prototype.findIndex(); 返回 true 後就不繼續迴圈.
      const index = this.MaskMapData.findIndex((item) => {
        return item.properties.id === id;
      });

      // index 找不到就停止函式.
      if (index === -1) return false;

      // leafletjs 吃的經緯度與台灣資料的順序相反.
      const center = [
        this.MaskMapData[index].geometry.coordinates[1],
        this.MaskMapData[index].geometry.coordinates[0],
      ];

      MapHandler.setStore({ center, index });
    },
  },
  mounted() {
    // map 初始化.
    MapHandler.init({
      position: this.position,
      zoom: this.zoom,
      data: this.MaskMapData,
    });

    this.setCenter();
  },
};
</script>

<style lang="scss">
@import "../public/style/reset.css";
@import "./components/MapComponent/MapStyle.scss";

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

#map {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;
}

.control-container {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 2;

  .control {
    margin: 2rem 0;
    padding: 0px;
    width: 3.5rem;
    height: 3.5rem;
    border: 1px solid #eee;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.8);
    // input focus 時的邊框取消.
    outline: none;
    font-size: 1.2rem;
    line-height: 3.5rem;
    display: block;
    cursor: pointer;
    position: relative;
  }

  .active {
    background: rgba(16, 120, 121, 0.8);
  }
}
</style>
