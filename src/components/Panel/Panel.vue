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
@import "../../assets/style/_variable.scss";

.panel {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 2;

  .control {
    @include button-style();
    margin: 2rem 0;
  }

  .active {
    @include sufficient-background-color(0.8);
  }
}
</style>
