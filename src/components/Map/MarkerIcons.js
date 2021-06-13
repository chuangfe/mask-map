// 依據口罩的數量, 選擇不同的 icon class 使用.
export default [
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
