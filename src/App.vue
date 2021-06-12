<template>
  <div id="app">
    <div id="map"></div>
    <Panel
      @isAdult="isAdultHandler"
      @setZoom="setZoomHandler"
      :zoom="zoom"
      :isAdult="isAdult"
    />
    <Information @setCenter="setCenterHandler" />
  </div>
</template>

<script>
// 引入靜態資料.
import MaskMapData from "./data/MaskMapData.json";
// 地圖的方法集合
import MapHandler from "./components/MapComponent/MapHandler";
// 控制板組件
import Panel from "./components/PanelComponent/Panel";
// 資訊組件
import Information from "./components/InformationComponent/Information";

// 六角學院提供的口罩資料.
const MaskMapDataUrl =
  "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json";

// const MaskMapDataUrl =
//   "https://raw.githubusercontent.com/kiang/pharmacies/master/json";

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
  methods: {
    // 切換顯示成人口罩 or 兒童口罩的 marker icon 圖標.
    isAdultHandler(isAdult) {
      this.isAdult = isAdult;
      MapHandler.setMarkersIcon(this.isAdult);
    },
    // 地圖縮放大小的控制.
    setZoomHandler(calc) {
      // 先讀取地圖的縮放倍率, 再根據按鈕計算 zoom 的值.
      this.zoom = MapHandler.getZoom() + calc;
      // 限制地圖的縮放倍率.
      this.zoom = this.zoom > 18 ? 18 : this.zoom < 3 ? 3 : this.zoom;
      // 調整地圖倍率.
      MapHandler.setZoom(this.zoom);
    },
    setCenterHandler({ center, zoom }) {
      MapHandler.setCenter({ center, zoom });
    },
    // 根據 id 找到對應的藥局資料, 並將地圖跳轉到該藥局.
    getHash(data) {
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
      const index = data.findIndex((item) => {
        return item.properties.id === id;
      });

      // index 找不到就停止函式.
      if (index === -1) return false;

      // leafletjs 吃的經緯度與台灣資料的順序相反.
      const center = [
        data[index].geometry.coordinates[1],
        data[index].geometry.coordinates[0],
      ];

      // 顯示指定的藥局.
      MapHandler.setStore({ center, index });
    },
  },
  components: { Panel, Information },
  mounted() {
    // 使用 axios, 請求六角學院提供的口罩資料.
    axios({
      method: "get",
      url: MaskMapDataUrl,
      responseType: "json",
    })
      // 如果請求成功, 就使用新的 ajax 資料.
      .then((response) => {
        // map 初始化.
        MapHandler.init({
          position: this.position,
          zoom: this.zoom,
          data: response.data.features,
        });
        // 判斷 hash 值是不是藥局的 id.
        this.getHash(response.data.features);
      })
      // 如果請求失敗, 使用舊的靜態資料.
      .catch(() => {
        // map 初始化.
        MapHandler.init({
          position: this.position,
          zoom: this.zoom,
          data: MaskMapData.features,
        });
        // 判斷 hash 值是不是藥局的 id.
        this.getHash(MaskMapData.features);
      });
  },
};
</script>

<style lang="scss">
@import "./components/MapComponent/MapStyle.scss";

html {
  font: 16px "Helvetica Neue", Arial, Helvetica, sans-serif;
  line-height: 1.5rem;
}

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
</style>
