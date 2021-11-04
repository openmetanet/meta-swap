<template>
  <div class="detailWrap">
    <detail-header></detail-header>
    <div class="splitWrap"></div>
    <detail-footer></detail-footer>
  </div>
</template>

<script>
import DetailFooter from "../components/detailFooter.vue";
import DetailHeader from "../components/detailHeader.vue";
export default {
  name: "Detail",
  components: {
    DetailHeader,
    DetailFooter,
  },
  data() {
    return {};
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$route.params.tx) {
        next();
      } else {
        next("/");
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.detailWrap {
  background-color: #f7fafc;
  .splitWrap {
    padding: 0.535714rem /* 7.5/14 */ 0;
  }
}
@media screen and (min-width: 750px) {
  .detailWrap {
    width: 53.571429rem /* 750/14 */;
    margin: 0 auto;
  }
}
</style>
