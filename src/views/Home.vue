<template>
  <div class="home">
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

    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/style/_variable.scss";

a {
  color: #000;
  text-decoration: none;
}

.item-container {
  padding: 0.8rem;
  border: 1px solid #eee;
  line-height: 1.2rem;
  text-align: left;
  position: absolute;

  .store-status {
    display: flex;

    .mask-container {
      margin: 0.5rem;
      padding: 0 1rem;
      border-radius: 1rem;
      line-height: 1.5rem;
      color: #fff;
      flex-grow: 1;
      flex-shrink: 1;
      position: relative;

      &.sufficient {
        background-color: $sufficient;
      }

      &.warning {
        background-color: $warning;
      }

      &.emergency {
        background-color: $emergency;
      }

      &.soldOut {
        background-color: $soldOut;
      }
    }

    .quantity {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }

  .text {
    margin: 1rem 0.5rem;
  }

  .store-name {
    padding-left: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
    border-left: 0.3rem solid $sufficient;
  }

  .store-address span,
  .store-phone span {
    padding-bottom: 2px;
    border-bottom: 1px solid #000;
  }
}
</style>
