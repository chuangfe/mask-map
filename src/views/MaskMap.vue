<template>
  <div class="mask-map">
    <h1>This is an about MaskMap</h1>

    <div class="images">
      <!-- 販售結束, 灰色的 marker -->
      <img src="../../public/images/sold-out.svg" />
      <!-- 關閉 -->
      <img src="../../public/images/cross.svg" />

      <!-- 緊急情況, 紅色 marker -->
      <img src="../../public/images/emergency.svg" />
      <!-- 警笛 -->
      <img src="../../public/images/siren.svg" />

      <!-- 警告, 橘色 marker -->
      <img src="../../public/images/warning.svg" />
      <!-- 驚嘆號 -->
      <img src="../../public/images/alert.svg" />

      <!-- 充足, 綠色 marker -->
      <img src="../../public/images/sufficient.svg" />
      <!-- 打勾 -->
      <img src="../../public/images/tick.svg" />

      <!-- 複數集合的 marker -->
      <img src="../../public/images/current.svg" />

      <!-- 銷售 -->
      <img src="../../public/images/sale.svg" />
    </div>

    <div id="map"></div>
  </div>
</template>

<script>
import MapHandler from "../modules/MapHandler";
// 引入靜態資料.
const MaskMapData = require("../data/MaskMapData.json");
// 宣告 map 物件
const map = MapHandler();

// 話說都有框架和插件, 我用 vue 幹嘛?
export default {
  data() {
    return {
      // 台北市緯度 25.03746.
      // latitude: 25.03746,
      // 台北市經度 121.564558.
      // longitude: 121.564558,
    };
  },
  computed: {
    MaskMapData() {
      return MaskMapData.features;
    },
  },
  mounted() {
    map.init(this.MaskMapData);
  },
};
</script>

<style lang="scss">
@import "../modules/MapStyle.scss";

body {
  font: 18px "Helvetica Neue", Arial, Helvetica, sans-serif;
  line-height: 1.5rem;
}

#map {
  width: 100%;
  height: 600px;
}

.images img {
  width: 50px;
  background-color: #eee;
}

#popup-template {
  display: none;
}

a {
  color: #000 !important;
  text-decoration: none;
}
</style>
