<template>
  <div id="login">
    <house-detail-nav-bar />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
import HouseDetailNavBar from "@/views/HouseDetail/childComponent/HouseDetailNavBar";

export default {
  name: "Login",
  components: {
    HouseDetailNavBar
  },
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter,
.fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
