<template>
  <div class="information" :class="{ active: isActive }">
    <div class="information-container">
      <!-- 標題 -->
      <h1 class="logo">口罩地圖</h1>
      <!-- icon 顏色介紹 -->
      <div class="legend">
        <div class="sufficient">
          <p>50%以上</p>
        </div>
        <div class="warning">
          <p>49%~21%</p>
        </div>
        <div class="emergency">
          <p>20%以下</p>
        </div>
        <div class="soldOut">
          <p>無存貨</p>
        </div>
      </div>
      <!-- icon 介紹 -->
      <div class="icon-information">
        <div class="item">
          <img src="../../../public/images/current.svg" />
          <p>附近有 2 間以上的藥局</p>
        </div>
        <div class="item">
          <img src="../../../public/images/sufficient.svg" />
          <p>藥局</p>
        </div>
      </div>
      <!-- 表單 -->
      <div class="from">
        <h3>縣市</h3>
        <select v-model="countyIndex">
          <option :value="null">請選擇</option>
          <option v-for="(item, index) of countys" :value="index" :key="index">
            {{ item.county }}
          </option>
        </select>

        <h3>地區</h3>
        <select v-model="townIndex">
          <option :value="null">請選擇</option>
          <option v-for="(item, index) of towns" :value="index" :key="index">
            {{ item.town }}
          </option>
        </select>
      </div>
      <!-- 版權 -->
      <div class="copyright">
        <p>
          Copyright© 2021 <a href="https://www.facebook.com/kai73002981">Kai</a>
        </p>
      </div>
    </div>
    <!-- 按鈕 -->
    <button class="menu" @click="isActiveHandler" :class="{ active: isActive }">
      <span class="fas fa-chevron-up"></span>
    </button>
  </div>
</template>

<script>
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
      this.$emit("setCenter", {
        center: this.countys[this.countyIndex].center,
        zoom: 13,
      });
      this.townIndex = null;
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

<style lang="scss" scoped>
@import "../../assets/style/_variable.scss";
@import "../../assets/style/_font.scss";

// 最外層的容器, 顯示隱藏動畫使用.
.information {
  transform: translateX(-100%);
  transition: transform 0.2s ease-out;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 1;

  &.active {
    transform: translateX(0%);
  }

  // 資訊容器
  .information-container {
    padding: 0px 2rem;
    max-width: 18rem;
    height: 100vh;
    @include font-style(1rem, 2rem);
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0 1rem 1rem 0;
    box-shadow: 0 0 1rem 1rem rgb(0 0 0 / 10%);
    position: relative;
    top: 0;
    left: 0;

    // 預設卷軸
    overflow: auto;
  }

  // 標題
  .logo {
    @include font-style(1.8rem);
    font-weight: 900;
    padding: 1.5rem 0;
  }

  // icon color 說明.
  .legend {
    color: #fff;
    border-radius: 1rem;
    overflow: hidden;

    div {
      padding: 1rem 4rem;
      @include font-style(1.2rem);
      font-weight: 700;
    }

    .sufficient {
      @include sufficient-background-color(0.7);
    }

    .warning {
      @include warning-background-color(0.65);
      color: #000;
    }

    .emergency {
      @include emergency-background-color(0.3);
      color: #000;
    }

    .soldOut {
      @include soldOut-background-color(0.5);
      color: #000;
    }
  }

  // icon 說明.
  .icon-information {
    padding: 2rem 0;
    // 不可以換行
    white-space: nowrap;

    .item {
      display: flex;

      &:first-child {
        margin-bottom: 1rem;
      }
    }

    img {
      width: 3rem;
      height: 3rem;
    }

    p {
      padding: 0 1rem;
      @include font-style(1.2rem, 3rem);
    }
  }

  // 表單, 城市區域選擇.
  .from {
    padding: 1rem 0;
    @include font-style(1.2rem);
    border: 1px solid $sufficient;
    border-radius: 1rem;

    h3 {
      padding: 0.5rem 0;
      @include font-style(1.2rem);
      font-weight: 700;
    }

    select {
      margin-left: 0.5rem;
      padding: 0 4rem 0 4.5rem;
      @include font-style(1.2rem);
    }
  }

  // 版權
  .copyright {
    padding-top: 1.8rem;
    @include font-style(1.2rem);
    font-weight: 700;

    a {
      // 文字底線.
      text-decoration-line: underline;
    }
  }

  .menu {
    @include button-style();
    margin: 1rem;
    transform: rotate(90deg);
    position: absolute;
    left: 100%;
    top: 0px;

    &:hover {
      background: rgba(255, 255, 255, 1);
    }

    &.active {
      transform: rotate(-90deg);
    }
  }
}
</style>
