<script>
// 簡略的城市地區經緯度.
import CountyTown from "../../data/CountyTown.json";

export default {
  data() {
    return {
      isActive: false,
      countyIndex: null,
      townIndex: null,
    };
  },
  computed: {
    countys() {
      return CountyTown;
    },
    towns() {
      // 如果沒選擇城市, 地區就不顯示.
      return this.countyIndex === null
        ? []
        : CountyTown[this.countyIndex].towns;
    },
  },
  methods: {
    isActiveHandler() {
      this.isActive = !this.isActive;
    },
  },
  watch: {
    countyIndex() {
      // 每次選擇都清空 townIndex 的值.
      this.townIndex = null;
      // 避免後續出錯.
      if (this.countyIndex === null) return false;

      this.$emit("setCenter", {
        center: this.countys[this.countyIndex].center,
        zoom: 13,
      });
    },
    townIndex() {
      if (this.townIndex === null) return false;

      this.$emit("setCenter", {
        center: this.towns[this.townIndex].center,
        zoom: 15,
      });
    },
  },
};
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
