/**
 * 事件節流 - 減少事件函式的執行次數
 * 事件連續觸發, 事件函式需要一定的時間才會執行
 * @param {function} func - event function
 * @param {number} wait - 事件觸發後, 多久才可以執行事件函式, 若連續觸發事件,
 * 事件函式不會執行
 * @param {number} limit - 若事件連續觸發事件, 每間隔多少時間必需執行事件函式
 * @param {boolean} immediate - true 代表第一次觸發事件時執行一次事件函式, 再
 * 開始節流, false 代表直接開始節流
 * 補充, 通常針對 resize(視窗縮放) wheel(滾輪事件) mousemove(滑鼠移動)
 * keydown(鍵盤按下) ...
 */
export default function debounce(
  func,
  { wait = 1000 / 30, limit = 0, immediate = false }
) {
  // target - 事件函式的 this 目標
  // event - 事件函式的 event 物件
  // startTime - 事件函式執行後的時間
  // currentTime - 當前時間
  // timer - 用於保存 setTimeout, 讓需要時可以 clear setTimeout
  let target, event, startTime, currentTime, timer;
  // 包裝後的事件函式
  function waitFunc() {
    func.call(target, event);
    startTime = currentTime;
  }
  // 事件函式
  return function(e) {
    // target - 事件函式的 this 目標
    target = this;
    // event - 事件函式的 event 物件
    event = e;
    // 事件觸發後, 當前的時間, 回傳由 1970-01-01 00:00:00 UTC 開始到現在的毫秒
    currentTime = new Date().getTime();
    /**
     * 第一次觸發事件
     * immediate 判斷是否要執行事件函式
     * startTime 不會有第二次是 undefined, startTime = currentTime;
     */
    if (immediate && startTime === undefined) {
      waitFunc();
    }
    // 清除定時器
    clearTimeout(timer);
    // 若需要強迫執行一次事件函式 && 間隔時間滿足條件時
    if (limit && currentTime - startTime > limit) {
      waitFunc();
    } else {
      // 間隔時間沒有滿足條件, 且沒有再觸發事件時, wait 時間到會自動執行事件函式
      timer = setTimeout(waitFunc, wait);
    }
  };
}
