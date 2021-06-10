// cluster marker 組合時使用的 icon 圖標.
import clusterIcon from "./ClusterIcon";
// 依據口罩的數量, 選擇不同的 icon class 使用.
import markerIcons from "./MarkerIcons";
// 生產 popup Element 的 function.
import getPopupTemplate from "./GetPopupTemplate";

// map 地圖, 需要後續操作.
// marker 單一的標記, 迴圈時會再賦值.
// 配合 Marker Cluster 插件的變數.
let map, marker, cluster;

// markers 保存所有的資料產生的 marker 和兩種口罩的 icon 的索引.
const markers = [],
  // 地圖最大的放大倍率.
  maxZoom = 18;

/**
 * 依據兩種口罩數量, 判斷口罩使用的 icon 圖標.
 * @param {Number} adultMask 成人口罩數量.
 * @param {Number} childMask 兒童口罩數量.
 */
function getIconIndex({ adultMask, childMask }) {
  let adultIconIndex = 0,
    childIconIndex = 0;

  // 判斷成人口罩資料使用 markerIcons 的索引.
  if (adultMask > 1000) {
    adultIconIndex = 3;
  } else if (adultMask > 500) {
    adultIconIndex = 2;
  } else if (adultMask > 0) {
    adultIconIndex = 1;
  } else {
    adultIconIndex = 0;
  }

  // 判斷小孩口罩資料使用 markerIcons 的索引.
  if (childMask > 1000) {
    childIconIndex = 3;
  } else if (childMask > 500) {
    childIconIndex = 2;
  } else if (childMask > 0) {
    childIconIndex = 1;
  } else {
    childIconIndex = 0;
  }

  return { adultIconIndex, childIconIndex };
}

// marker 點擊事件, 用於設置 hash 值.
function markerClickHandler(e) {
  // 藥局 id 資料, 字串類型.
  // this.options.storeId;
  // marker index, 數值資料
  // this.options.markerId;

  location.hash = this.options.storeId;
}

export default {
  // 地圖初始化.
  init({ data, position, zoom }) {
    // 地圖初始化.
    map = L.map("map", {
      // 目前的緯度, 經度.
      // center: [25.03746, 121.564558],
      // center: [25.583234, 120.58552886],
      center: position,
      // 目前的縮放比例.
      zoom,
    });

    // 地圖的資料.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    ).addTo(map);

    // 使用 Marker Cluster 插件, 可以將範圍內的 marker 合併.
    cluster = L.markerClusterGroup({
      // marker 收縮範圍, 預設 80 px, 若減少提高消耗性能.
      maxClusterRadius: 100,
      // 複數 marker 收縮時, 使用的圖標.
      iconCreateFunction() {
        return clusterIcon;
      },
      // 當地圖縮放到達限制後, 不再收縮複數的 marker icon 圖標.
      disableClusteringAtZoom: maxZoom,
    });

    data.forEach(({ properties, geometry }, index) => {
      // 紀錄兩種口罩的 icon index 物件.
      const indexes = getIconIndex({
        adultMask: properties.mask_adult,
        childMask: properties.mask_child,
      });

      // 新增藥局的 marker 座標, 與 icon 圖標.
      marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
        icon:
          // marker 預設顯示成人口罩數量的 icon 圖標.
          markerIcons[indexes.adultIconIndex].icon,
        // marker 保存藥局 id 資料, 字串類型.
        storeId: properties.id,
        // marker 索引, 數值類型.
        markerIndex: index,
      });

      // marker 的 popup 彈窗新建.
      marker.bindPopup(
        // 藥局的 popup Element 模板.
        getPopupTemplate({
          name: properties.name,
          phone: properties.phone,
          address: properties.address,
          adultMask: {
            number: properties.mask_adult,
            class: markerIcons[indexes.adultIconIndex].class,
          },
          childMask: {
            number: properties.mask_child,
            class: markerIcons[indexes.childIconIndex].class,
          },
          updated: properties.updated,
        }),
        {
          // 藥局的 popup 不限制寬度.
          maxWidth: "auto",
        }
      );

      // marker click 時, 修改 hash 值.
      marker.on("click", markerClickHandler);

      // 保存資料, 切換口罩顯示不同的 icon 時會用到.
      // 格式應該是這樣 item = { marker, adultIconIndex, childIconIndex };
      markers.push({
        adultIconIndex: indexes.adultIconIndex,
        childIconIndex: indexes.childIconIndex,
        marker,
      });

      // 將 marker 包進 Marker Cluster 插件的物件.
      // addLayer 是用於創建畫不規則形狀的圖層時用的方法.
      cluster.addLayer(marker);
    });

    // 將 Marker Cluster 插件的物件, 丟給 map 地圖.
    map.addLayer(cluster);
  },
  /**
   * 切換 marker icon 圖標, 是依照成人口罩 or 兒童口罩的資料.
   * @param {Boolean} boolean
   * true = 顯示成人口罩的 icon.
   * false = 顯示兒童口罩的 icon.
   */
  setMarkersIcon(boolean) {
    markers.forEach((item) => {
      // 如果 icon index 相同, 可以檔掉這次迴圈.
      if (item.adultIconIndex === item.childIconIndex) return false;

      item.marker.setIcon(
        markerIcons[boolean ? item.adultIconIndex : item.childIconIndex].icon
      );
    });
  },
  // 讀取當前 map 的縮放倍率.
  getZoom() {
    return map.getZoom();
  },
  /**
   * 設定 map 的縮放倍率.
   * @param {Number} zoom 地圖縮放的倍率.
   */
  setZoom(zoom) {
    map.setZoom(zoom);
  },
  /**
   * 顯示指定的藥局.
   * @param {Array} center 經緯度.
   * @param {Number} index 藥局在資料的陣列中的索引.
   */
  setStore({ center, index }) {
    // 地圖跳轉到指定藥局.
    map.setView(center, maxZoom);
    // 藥局的 popup 顯示.
    markers[index].marker.openPopup();
  },
  /**
   * 設定地圖中央的經緯度, 預計將功能給縣市的跳轉.
   * @param {Array} center 經緯度.
   * @param {Number} zoom 地圖縮放的倍率.
   */
  setCenter({ center, zoom = maxZoom }) {
    map.setView(center, zoom);
  },
};
