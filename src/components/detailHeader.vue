<template>
  <div class="detailHeaderWrap">
    <div class="top">
      <i @click.stop="toHome"><van-icon name="arrow-left" /></i>
      <span @click="toTx">TX</span>
    </div>
    <div class="band">
      <img src="../assets/image/img_successful@2x.png" alt="" />
      <span>{{ $t("swapSuccess") }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "DetailHeader",
  components: {},
  data() {
    return {};
  },
  methods: {
    toHome() {
      this.$router.back();
    },
    toTx() {
      window.open(process.env.VUE_APP_WHATS_ON_CHAIN + this.$route.params.tx);
    },
  },
};
</script>

<style lang="scss" scoped>
.detailHeaderWrap {
  background-color: #fff;

  padding: 0 1.071429rem /* 15/14 */;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 1.428571rem /* 20/14 */;
    }
    span {
      color: #909399;
      padding: 1.142857rem /* 16/14 */ 0;
      font-size: 1rem /* 14/14 */;
      cursor: pointer;
    }
  }
  .band {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2.142857rem /* 30/14 */ 0;
    img {
      width: 5rem /* 70/14 */;
      height: 5rem /* 70/14 */;
      border-radius: 5rem /* 70/14 */;
      margin-bottom: 0.714286rem /* 10/14 */;
    }
    span {
      color: #303133;
      font-size: 1rem /* 14/14 */;
      font-weight: 550;
    }
  }
}
</style>
