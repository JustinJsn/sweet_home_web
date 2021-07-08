<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    const userInfo = window.localStorage.getItem("SH_userInfo");
    const token = window.localStorage.getItem("SH_token");

    window.addEventListener("beforeunload", () => {
      if (userInfo) {
        this.$store.dispatch("setUser", JSON.parse(userInfo));

        this.$store.dispatch("token_set", JSON.parse(token));
      } else {
        this.$store.dispatch("setUser", null);
      }
    });

    window.addEventListener("load", () => {
      if (userInfo) {
        this.$store.dispatch("setUser", JSON.parse(userInfo));

        this.$store.dispatch("token_set", JSON.parse(token));
      } else {
        this.$store.dispatch("setUser", null);
      }
    });
  }
};
</script>
<style scoped lang="scss">
#app {
  width: 100%;
  height: 100%;
}
#nprogress .bar {
  background: #ff5777 !important;
}
</style>
