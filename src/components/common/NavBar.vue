<template>
  <div class="banner-wrapper">
    <div class="banner">
      <!-- 左图片 -->
      <div class="banner-left">
        <slot name="left" />
      </div>
      <div class="banner-center">
        <slot name="center" />
      </div>
      <!-- 右文字导航 -->
      <div class="banner-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar"
};
</script>

<style scoped lang="scss">
.banner-wrapper {
  height: 78px;
  min-width: 1065px;
  background-color: #fff;
  box-shadow: 0 0 14px rgba(0, 0, 0, 0.1);
}
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1065px;
  margin: 0 auto;
}
.banner-left {
  display: flex;
  align-items: center;
}
.banner-right {
  display: flex;
  align-items: center;
}
</style>
