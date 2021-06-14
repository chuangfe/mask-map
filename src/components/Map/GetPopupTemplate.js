/**
 * 生產 popup Element 的 function.
 * @param {String} name 藥局店名.
 * @param {String} phone 藥局電話.
 * @param {String} address 藥局地址.
 * @param {Object} adultMask 成人口罩資料.
 * @param {Object} childMask 小孩口罩資料.
 * @param {String} updated 資料更新時間.
 */

export default function getPopupTemplate({
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
          <p class="quantity">
            <span>${adultMask.number}</span>片
          </p>
        </div>
        <div class="mask-container ${childMask.class}">
          <p class="title">兒童口罩數量</p>
          <p class="quantity">
            <span>${childMask.number}</span>片
          </p>
        </div>
      </div>
      <p class="store-name">${name}</p>
      <p class="store-address">
          <span class="icon fas fa-map-marked-alt"></span>
          <span class="underline">
            <a href="https://www.google.com/maps?q=${name}+${address}" target="_blank">
              ${address}
            </a>
          </span>
      </p>
      <p class="store-phone">
        <span class="icon fas fa-phone"></span>
        <span class="underline">
          ${phone}
        </span>
      </p>
      <p class="store-update">
      <span class="icon fas fa-sync-alt"></span>
        ${updated}
      </p>
    </div>`;
}
