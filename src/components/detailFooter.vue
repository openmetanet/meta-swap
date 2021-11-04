<template>
  <div class="detailFooterWrap">
    <div class="detailItem">
      <span>{{ $t("from") }}</span>
      <div class="right">
        <span>{{ fromData.fromBalance }}</span>
        <span>{{ fromData.fromName }}</span>
        <img
          src="../assets/image/BSV.svg"
          alt=""
          v-if="fromData.fromIcon === 'BSVIcon'"
        />
        <img
          :src="fromData.fromIcon | imgUrl"
          alt=""
          v-if="fromData.fromIcon !== 'BSVIcon'"
        />
      </div>
    </div>
    <div class="detailItem">
      <span>{{ $t("to") }}</span>
      <div class="right">
        <span>{{ toData.toBalance }}</span>
        <span>{{ toData.toName }}</span>
        <img
          src="../assets/image/BSV.svg"
          alt=""
          v-if="toData.toIcon === 'BSVIcon'"
        />
        <img
          :src="toData.toIcon | imgUrl"
          alt=""
          v-if="toData.toIcon !== 'BSVIcon'"
        />
      </div>
    </div>
    <div class="detailItem">
      <span>{{ $t("timer") }}</span>
      <div class="right">
        <span>{{ $dayjs().format("YYYY-MM-DD HH:mm:ss") }}</span>
      </div>
    </div>
    <van-button type="info" @click.stop="toHome">{{
      $t("confirm")
    }}</van-button>
  </div>
</template>

<script>
import { imgUrl, cutLength } from "@filters";
export default {
  name: "DetailFooter",
  components: {},
  data() {
    return {};
  },
  filters: {
    imgUrl,
    cutLength,
  },

  computed: {
    fromData() {
      return this.$route.params.from;
    },
    toData() {
      return this.$route.params.to;
    },
  },
  methods: {
    toHome() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.detailFooterWrap {
  background-color: #fff;

  padding: 0 1.071429rem /* 15/14 */;
  .detailItem {
    font-size: 1rem /* 14/14 */;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > span {
      padding: 1.142857rem /* 16/14 */ 0;
      color: #909399;
    }
    .right {
      display: flex;
      align-items: center;
      i {
        color: #ffc051;
        font-size: 1.571429rem !important;
      }
      span {
        color: #303133;
        margin-right: 0.357143rem /* 5/14 */;
      }
      img {
        width: 1.571429rem /* 22/14 */;
        height: 1.571429rem /* 22/14 */;
        border-radius: 50%;
      }
    }
  }
  ::v-deep .van-button.van-button--info.van-button--normal {
    background-color: #01bafb;
    border: 1px solid #01bafb;
    font-size: 1.142857rem /* 16/14 */;
    border-radius: 0.714286rem /* 10/14 */;
    width: 100%;
    height: 4.285714rem /* 60/14 */;
    margin-top: 4.285714rem /* 60/14 */;
    .van-button__content {
      .van-button__text {
        padding: 1.357143rem /* 19/14 */ 0;
        font-size: 1.142857rem /* 16/14 */;
      }
    }
  }
}
</style>
