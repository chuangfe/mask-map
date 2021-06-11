<template>
  <div class="panel">
    <button
      class="control"
      :class="{ active: !isAdult }"
      @click="$emit('isAdult', !isAdult)"
      title="切換 成人 / 兒童 口罩"
    >
      <span class="fas fa-child"></span>
    </button>
    <button class="control" title="地圖放大" @click="$emit('setZoom', 1)">
      <span class="fas fa-plus"></span>
    </button>
    <button class="control" title="地圖縮小" @click="$emit('setZoom', -1)">
      <span class="fas fa-minus"></span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    zoom: {
      // 型別限制.
      type: Number,
      // 必定需要傳值.
      required: true,
    },
    isAdult: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
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
