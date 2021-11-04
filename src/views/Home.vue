<template>
  <div class="home">
    <Login />
    <Transiction />
  </div>
</template>

<script>
import Login from "@c/login.vue";
import Transiction from "../components/transiction.vue";

export default {
  name: "Home",
  components: {
    Login,
    Transiction,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 750px) {
  .home {
    width: 53.571429rem /* 750/14 */;
    margin: 0 auto;
  }
}
</style>
