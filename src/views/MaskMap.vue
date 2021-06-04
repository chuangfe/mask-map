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
    <div id="popup-template">
      <div class="item-container">
        <div class="store-status">
          <div class="mask-container sufficient">
            <p class="title">成人口罩數量</p>
            <p>
              <span class="quantity mask-adult-quantity">280</span>
              片
            </p>
          </div>
          <div class="mask-container emergency">
            <p class="title">兒童口罩數量</p>
            <p>
              <span class="quantity mask-child-quantity">180</span>
              片
            </p>
          </div>
        </div>
        <p class="text store-name">大楓藥師藥局</p>
        <p class="text store-address">
          <span>
            <a href="https://www.google.com/maps?q=店名+地址" target="_blank">
              新北市板橋區懷仁街８４號（１樓）
            </a>
          </span>
        </p>
        <p class="text store-phone">
          <span>
            (02)29560576
          </span>
        </p>
        <p class="text store-update">2021/06/05 01:53:24</p>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>

<script>
// 引入靜態資料.
const MaskMapData = require("../data/MaskMapData.json");

const MapHandler = (function() {
  // cluster 使用的 icon 圖標.
  const clusterIcon = L.icon({
    iconUrl: "./images/current.svg",
    iconSize: [48, 48],
  });

  // 依據資料的不同, 選擇不同的 icon class imageSrc 使用.
  const icons = [
    // 販售結束, 灰色
    {
      icon: L.icon({
        iconUrl: "./images/sold-out.svg",
        iconSize: [48, 48],
      }),
      class: "sold-out",
      imageSrc: "./images/cross.svg",
    },
    // 警急情況, 紅色
    {
      icon: L.icon({
        iconUrl: "./images/emergency.svg",
        iconSize: [48, 48],
      }),
      class: "emergency",
      imageSrc: "./images/siren.svg",
    },
    // 警告, 橘色
    {
      icon: L.icon({
        iconUrl: "./images/warning.svg",
        iconSize: [48, 48],
      }),
      class: "warning",
      imageSrc: "./images/alert.svg",
    },
    // 充足, 綠色
    {
      icon: L.icon({
        iconUrl: "./images/sufficient.svg",
        iconSize: [48, 48],
      }),
      class: "sufficient",
      imageSrc: "./images/tick.svg",
    },
  ];

  function getPopupTemplate({ name, phone, address, adult, child }) {
    return `<div class="item-container">
        <div class="store-status">
          <div class="mask-container ${adult.class}">
            <p class="title">成人口罩數量</p>
            <p>
              <span class="quantity mask-adult-quantity">${adult.number}</span>
              片
            </p>
          </div>
          <div class="mask-container ${child.class}">
            <p class="title">兒童口罩數量</p>
            <p>
              <span class="quantity mask-child-quantity">${child.number}</span>
              片
            </p>
          </div>
        </div>
        <p class="store-name">${name}</p>
        <p class="store-address">
          <span>
            <a href="https://www.google.com/maps?q=${name}+${address}" target="_blank">
              ${address}
            </a>
          </span>
        </p>
        <p class="store-phone">
          <span>
            ${phone}
          </span>
        </p>
        <p class="store-update">2021/06/05 01:53:24</p>
      </div>`;
  }

  // map 地圖, 需要後續操作.
  // marker 單一的標記, 迴圈時會創建.
  // markers 配合 Marker Cluster 使用的變數.
  // iconIndex 單一標記使用 icon 圖標時的判斷.
  let map, marker, markers, iconIndexAdult, iconIndexChild;

  return {
    init(data) {
      // 地圖初始化.
      map = L.map("map", {
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
      markers = L.markerClusterGroup({
        // marker 收縮範圍, 預設 80 px, 若減少提高消耗性能.
        maxClusterRadius: 100,
        // 複數 marker 收縮時, 使用的圖標.
        iconCreateFunction() {
          return clusterIcon;
        },
      });

      data.forEach(({ properties, geometry }) => {
        if (properties.mask_adult > 1000) {
          iconIndexAdult = 3;
        } else if (properties.mask_adult > 500) {
          iconIndexAdult = 2;
        } else if (properties.mask_adult > 0) {
          iconIndexAdult = 1;
        } else {
          iconIndexAdult = 0;
        }

        if (properties.mask_child > 1000) {
          iconIndexChild = 3;
        } else if (properties.mask_child > 500) {
          iconIndexChild = 2;
        } else if (properties.mask_child > 0) {
          iconIndexChild = 1;
        } else {
          iconIndexChild = 0;
        }

        marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
          icon:
            icons[
              iconIndexAdult < iconIndexChild ? iconIndexAdult : iconIndexChild
            ].icon,
        });

        marker.bindPopup(
          getPopupTemplate({
            name: properties.name,
            phone: properties.phone,
            address: properties.address,
            adult: {
              number: properties.mask_adult,
              class: icons[iconIndexAdult].class,
              imageSrc: icons[iconIndexAdult].imageSrc,
            },
            child: {
              number: properties.mask_child,
              class: icons[iconIndexChild].class,
              imageSrc: icons[iconIndexChild].imageSrc,
            },
          })
        );

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    },
  };
})();

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
    MapHandler.init(this.MaskMapData);
  },
};
</script>

<style lang="scss">
@import "../assets/style/_variable.scss";

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

.leaflet-popup-content {
  width: auto !important;
}

.item-container {
  text-align: left;

  .store-status {
    display: flex;
  }

  .mask-container {
    padding: 0 1rem;
    border-radius: 1rem;
    font-size: 1.2rem;
    color: #fff;
    flex-grow: 1;
    flex-shrink: 1;
    position: relative;

    &:first-child {
      margin-right: 1rem;
    }

    &.sufficient {
      background-color: $sufficient;
    }

    &.warning {
      background-color: $warning;
    }

    &.emergency {
      background-color: $emergency;
    }

    &.sold-out {
      background-color: $soldOut;
    }
  }

  .title {
    white-space: nowrap;
  }

  .quantity {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .store-name {
    padding-left: 1rem;
    font-size: 1.2rem;
    font-weight: 900;
    border-left: 0.3rem solid $sufficient;
  }

  .store-address,
  .store-phone,
  .store-update {
    font-size: 1rem;
  }

  .store-address span,
  .store-phone span {
    padding-bottom: 2px;
    border-bottom: 1px solid #000;
  }
}
</style>
