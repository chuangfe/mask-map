// cluster marker 組合時使用的 icon 圖標.
const clusterIcon = L.icon({
  iconUrl: "./images/current.svg",
  iconSize: [48, 48],
});

// 依據口罩的數量, 選擇不同的 icon class 使用.
const icons = [
  // 販售結束, 灰色
  {
    icon: L.icon({
      iconUrl: "./images/sold-out.svg",
      iconSize: [48, 48],
    }),
    class: "sold-out",
  },
  // 警急情況, 紅色
  {
    icon: L.icon({
      iconUrl: "./images/emergency.svg",
      iconSize: [48, 48],
    }),
    class: "emergency",
  },
  // 警告, 橘色
  {
    icon: L.icon({
      iconUrl: "./images/warning.svg",
      iconSize: [48, 48],
    }),
    class: "warning",
  },
  // 充足, 綠色
  {
    icon: L.icon({
      iconUrl: "./images/sufficient.svg",
      iconSize: [48, 48],
    }),
    class: "sufficient",
  },
];

/**
 * 生產 popup Element 的 function.
 * @param {String} name 藥局店名.
 * @param {String} phone 藥局電話.
 * @param {String} address 藥局地址.
 * @param {Object} adultMask 成人口罩資料.
 * @param {Object} childMask 小孩口罩資料.
 * @param {String} updated 資料更新時間.
 */
function getPopupTemplate({
  name,
  phone,
  address,
  adultMask,
  childMask,
  updated,
}) {
  return `<div class="item-container">
      <div class="store-status">
        <div class="mask-container ${adultMask.class}">
          <p class="title">成人口罩數量</p>
          <p>
            <span class="quantity">${adultMask.number}</span>
            片
          </p>
        </div>
        <div class="mask-container ${childMask.class}">
          <p class="title">兒童口罩數量</p>
          <p class="quantity">
            <span>${childMask.number}</span>
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
      <p class="store-update">${updated}</p>
    </div>`;
}

export default function MapHandler() {
  // map 地圖, 需要後續操作.
  // marker 單一的標記, 迴圈時會再賦值.
  // markers 配合 Marker Cluster 使用的變數, 應該是複數 marker 的集合.
  // iconIndexAdult 紀錄成人口罩資料使用 icons 時的索引.
  // iconIndexChild 紀錄小孩口罩資料使用 icons 時的索引.
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
        // 判斷成人口罩資料使用 icons 的索引.
        if (properties.mask_adult > 1000) {
          iconIndexAdult = 3;
        } else if (properties.mask_adult > 500) {
          iconIndexAdult = 2;
        } else if (properties.mask_adult > 0) {
          iconIndexAdult = 1;
        } else {
          iconIndexAdult = 0;
        }

        // 判斷小孩口罩資料使用 icons 的索引.
        if (properties.mask_child > 1000) {
          iconIndexChild = 3;
        } else if (properties.mask_child > 500) {
          iconIndexChild = 2;
        } else if (properties.mask_child > 0) {
          iconIndexChild = 1;
        } else {
          iconIndexChild = 0;
        }

        // 新建 marker.
        marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
          icon:
            icons[
              // 判斷兩種口罩數量多少, 使用數量少的作為 icons 的索引.
              iconIndexAdult < iconIndexChild ? iconIndexAdult : iconIndexChild
            ].icon,
        });

        // marker 的 popup 彈窗新建.
        marker.bindPopup(
          // 彈窗 Element 模板.
          getPopupTemplate({
            name: properties.name,
            phone: properties.phone,
            address: properties.address,
            adultMask: {
              number: properties.mask_adult,
              class: icons[iconIndexAdult].class,
            },
            childMask: {
              number: properties.mask_child,
              class: icons[iconIndexChild].class,
            },
            updated: properties.updated,
          }),
          {
            // 彈窗不限制寬度.
            maxWidth: "auto",
          }
        );

        // 將 marker 包進 Marker Cluster 插件的物件.
        // addLayer 是用於畫不規則形狀的圖層.
        markers.addLayer(marker);
      });

      // 將 Marker Cluster 插件的物件, 丟給 map 地圖.
      map.addLayer(markers);
    },
  };
}
