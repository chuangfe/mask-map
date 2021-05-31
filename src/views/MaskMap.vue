<template>
  <div class="mask-map">
    <h1>This is an about MaskMap</h1>
    <div>
      <!-- 驚嘆號 -->
      <img src="../../public/images/alert.svg" />
      <!-- 關閉 -->
      <img src="../../public/images/cross.svg" />
      <!-- 複數集合的 marker -->
      <img src="../../public/images/current.svg" />
      <!-- 銷售 -->
      <img src="../../public/images/sale.svg" />
      <!-- 打勾 -->
      <img src="../../public/images/tick.svg" />
      <!-- 警笛 -->
      <img src="../../public/images/siren.svg" />
      <!-- 充足, 綠色 marker -->
      <img src="../../public/images/sufficient.svg" />
      <!-- 警告, 橘色 marker -->
      <img src="../../public/images/warning.svg" />
      <!-- 緊急情況, 紅色 marker -->
      <img src="../../public/images/emergency.svg" />
      <!-- 販售結束, 灰色的 marker -->
      <img src="../../public/images/sold-out.svg" />
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
// 引入靜態資料.
const MaskMapData = require("../data/MaskMapData.json");

// 這裡預先設置需要匯入的 icon 圖標
// 複數時的 icon
const currentIcon = L.icon({
  iconUrl: "./images/current.svg",
  iconSize: [48, 48],
});
// marker icons
const markerIcons = [
  // 販售結束, 灰色
  L.icon({
    iconUrl: "./images/sold-out.svg",
    iconSize: [48, 48],
  }),
  // 警急情況, 紅色
  L.icon({
    iconUrl: "./images/emergency.svg",
    iconSize: [48, 48],
  }),
  // 警告, 橘色
  L.icon({
    iconUrl: "./images/warning.svg",
    iconSize: [48, 48],
  }),
  // 充足, 綠色
  L.icon({
    iconUrl: "./images/sufficient.svg",
    iconSize: [48, 48],
  }),
];

// 創建 map
function CreateMap(data) {
  // 地圖初始化.
  let map = L.map("map", {
    // 目前的緯度, 經度.
    center: [25.03746, 121.564558],
    // 目前的縮放比例.
    zoom: 13,
  });

  // 地圖的資料.
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  ).addTo(map);

  // 使用 Marker Cluster 插件, 可以將範圍內的 marker 合併.
  let markers = L.markerClusterGroup({
    // marker 收縮範圍, 預設 80 px, 若減少會很耗性能.
    maxClusterRadius: 100,
    // 複數 marker 使用的圖標.
    iconCreateFunction() {
      return currentIcon;
    },
  });

  data.forEach(({ properties, geometry }) => {
    let iconIndex = 0;

    // 成人口罩和兒童口罩都大於 1000.
    if (properties.mask_adult > 1000 && properties.mask_child > 1000) {
      iconIndex = 3;
    }
    // 成人口罩和兒童口罩都大於 500.
    else if (properties.mask_adult > 500 && properties.mask_child > 500) {
      iconIndex = 2;
    }
    // 成人口罩和兒童口罩都大於 0.
    else if (properties.mask_adult > 0 && properties.mask_child > 0) {
      iconIndex = 1;
    }
    // 成人口罩或是兒童口罩, 其中一項售完.
    else {
      iconIndex = 0;
    }

    markers.addLayer(
      L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
        icon: markerIcons[iconIndex],
      })
    );
  });

  map.addLayer(markers);
}

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
    filterMap() {},
  },
  mounted() {
    CreateMap(this.MaskMapData);
  },
};
</script>

<style lang="scss" scoped>
.mask-map {
  font-size: 16px;
  line-height: 1.5em;
}

#map {
  width: 100%;
  height: 600px;
}

img {
  width: 50px;
  background-color: #eee;
}
</style>
