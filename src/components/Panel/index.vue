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
<template src="./template.html"></template>
<style lang="scss" scoped src="./style.scss"></style>
